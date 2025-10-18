import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const cwd = process.cwd();

const configuredRoots = process.env.PRODUCT_IMAGE_ROOT
  ? process.env.PRODUCT_IMAGE_ROOT.split(":").map((entry) => entry.trim()).filter(Boolean)
  : [];

const ALLOWED_ROOTS = (configuredRoots.length
  ? configuredRoots
  : [cwd, path.resolve(cwd, "..")])
  .map((root) => path.resolve(root));

const CONTENT_TYPE_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".tiff": "image/tiff",
};

export async function GET(request: NextRequest) {
  const pathParam = request.nextUrl.searchParams.get("path");

  if (!pathParam) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  const normalizedPath = path.normalize(pathParam);
  const isAbsolute = path.isAbsolute(normalizedPath);
  const candidatePaths = isAbsolute
    ? [normalizedPath]
    : ALLOWED_ROOTS.map((root) => path.resolve(root, normalizedPath));

  const allowedCandidates = candidatePaths.filter((candidate) =>
    ALLOWED_ROOTS.some((root) => candidate === root || candidate.startsWith(`${root}${path.sep}`)),
  );

  if (allowedCandidates.length === 0) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  try {
    let fileBuffer: Buffer | null = null;
    let finalPath: string | null = null;

    for (const candidate of allowedCandidates) {
      try {
        fileBuffer = await fs.readFile(candidate);
        finalPath = candidate;
        break;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }
    }

    if (!fileBuffer || !finalPath) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const ext = path.extname(finalPath).toLowerCase();
    const contentType = CONTENT_TYPE_MAP[ext] ?? "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("Failed to read image:", error);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
