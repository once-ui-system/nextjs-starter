import { lookup as dnsLookup } from "node:dns/promises";
import * as http from "node:http";
import * as https from "node:https";
import { BlockList, isIP, type LookupFunction } from "node:net";
import sharp from "sharp";

export const runtime = "nodejs";

const maxFileBytes = 25 * 1024 * 1024;
const maxPixels = 40_000_000;
const maxDimension = 4096;
const blockedIPv4 = new BlockList();

for (const [network, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16],
  ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24], ["192.168.0.0", 16],
  ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) {
  blockedIPv4.addSubnet(network, prefix, "ipv4");
}

class ImageSourceError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function isPublicAddress(address: string) {
  const family = isIP(address);
  if (family === 4) return !blockedIPv4.check(address, "ipv4");
  if (family !== 6) return false;

  const normalized = address.toLowerCase();
  const firstGroup = Number.parseInt(normalized.split(":")[0] || "0", 16);
  return firstGroup >= 0x2000 && firstGroup <= 0x3fff && !normalized.startsWith("2001:db8:") && !normalized.startsWith("2002:");
}

const publicLookup: LookupFunction = (hostname, options, callback) => {
  void dnsLookup(hostname, { all: true, verbatim: true }).then((addresses) => {
    const safeAddresses = addresses.filter(({ address }) => isPublicAddress(address));
    if (!addresses.length || safeAddresses.length !== addresses.length) {
      throw new ImageSourceError("Image URLs must resolve to a public internet address.", 400);
    }
    if (options.all) callback(null, safeAddresses);
    else callback(null, safeAddresses[0].address, safeAddresses[0].family);
  }).catch((error: unknown) => callback(error as NodeJS.ErrnoException, "", 0));
};

type RemoteImageResult = { buffer: Buffer } | { redirect: string };

function downloadRemoteImage(url: URL): Promise<RemoteImageResult> {
  return new Promise((resolve, reject) => {
    const transport = url.protocol === "https:" ? https : http;
    const request = transport.get(url, {
      headers: { Accept: "image/*,application/octet-stream;q=0.8" },
      lookup: publicLookup,
    }, (response) => {
      const status = response.statusCode ?? 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        const location = response.headers.location;
        response.resume();
        if (!location) reject(new ImageSourceError("The image URL returned an invalid redirect.", 502));
        else resolve({ redirect: location });
        return;
      }
      if (status < 200 || status >= 300) {
        response.resume();
        reject(new ImageSourceError(`The image server returned HTTP ${status}.`, 502));
        return;
      }

      const contentType = response.headers["content-type"]?.split(";")[0].trim().toLowerCase();
      if (contentType && !contentType.startsWith("image/") && contentType !== "application/octet-stream") {
        response.resume();
        reject(new ImageSourceError("The URL does not point to an image.", 415));
        return;
      }
      const declaredLength = Number(response.headers["content-length"] ?? 0);
      if (declaredLength > maxFileBytes) {
        response.resume();
        reject(new ImageSourceError("Images must be 25 MB or smaller.", 413));
        return;
      }

      const chunks: Buffer[] = [];
      let size = 0;
      response.on("data", (chunk: Buffer | string) => {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > maxFileBytes) {
          request.destroy();
          reject(new ImageSourceError("Images must be 25 MB or smaller.", 413));
          return;
        }
        chunks.push(buffer);
      });
      response.on("end", () => resolve({ buffer: Buffer.concat(chunks) }));
      response.on("error", reject);
    });

    request.setTimeout(12_000, () => request.destroy(new ImageSourceError("The image URL took too long to respond.", 504)));
    request.on("error", reject);
  });
}

async function getRemoteImage(urlValue: string) {
  let current: URL;
  try {
    current = new URL(urlValue);
  } catch {
    throw new ImageSourceError("Enter a valid image URL.", 400);
  }

  for (let redirectCount = 0; redirectCount <= 3; redirectCount++) {
    if (!(["http:", "https:"].includes(current.protocol)) || current.username || current.password) {
      throw new ImageSourceError("Use a public HTTP or HTTPS image URL.", 400);
    }
    const hostname = current.hostname.replace(/^\[|\]$/g, "");
    if (isIP(hostname) && !isPublicAddress(hostname)) {
      throw new ImageSourceError("Image URLs must resolve to a public internet address.", 400);
    }
    const result = await downloadRemoteImage(current);
    if ("buffer" in result) return result.buffer;
    if (redirectCount === 3) throw new ImageSourceError("The image URL redirected too many times.", 502);
    try {
      current = new URL(result.redirect, current);
    } catch {
      throw new ImageSourceError("The image URL returned an invalid redirect.", 502);
    }
  }
  throw new ImageSourceError("Unable to load this image URL.", 502);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Choose a valid image file." }, { status: 400 });
  }

  const file = form.get("image");
  const url = form.get("url");
  if (!(file instanceof File) && typeof url !== "string") {
    return Response.json({ error: "Choose an image or enter an image URL." }, { status: 400 });
  }
  if (file instanceof File && file.size > maxFileBytes) {
    return Response.json({ error: "Images must be 25 MB or smaller." }, { status: 413 });
  }

  try {
    const source = file instanceof File ? Buffer.from(await file.arrayBuffer()) : await getRemoteImage(url as string);
    const result = await sharp(source, { limitInputPixels: maxPixels, failOn: "error" })
      .rotate()
      .resize({ width: maxDimension, height: maxDimension, fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer({ resolveWithObject: true });

    return new Response(new Uint8Array(result.data), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "X-Image-Width": String(result.info.width),
        "X-Image-Height": String(result.info.height),
      },
    });
  } catch (error) {
    if (error instanceof ImageSourceError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "This image format is unsupported or the file is damaged." }, { status: 415 });
  }
}