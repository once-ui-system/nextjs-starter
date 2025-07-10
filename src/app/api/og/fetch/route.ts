import { NextResponse } from "next/server";

export const runtime = "edge";

import he from "he";

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "bot",
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function extractMetadata(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch =
    html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i) ||
    html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"[^>]*>/i) ||
    html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"[^>]*>/i);
  const imageMatch =
    html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/i) ||
    html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"[^>]*>/i);

  const title = titleMatch?.[1]?.trim() || "";
  const description = descMatch?.[1]?.trim() || "";
  const image = imageMatch?.[1]?.trim() || "";

  return {
    title: he.decode(title),
    description: he.decode(description),
    image: image,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    const metadata = await extractMetadata(html);

    return NextResponse.json({
      ...metadata,
      url,
    });
  } catch (error) {
    console.error(
      "Error fetching metadata:",
      error instanceof Error ? error.message : String(error),
    );

    return NextResponse.json(
      {
        error: "Failed to fetch metadata",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
