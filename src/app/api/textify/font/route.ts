const allowedFamilies = new Set([
  "Inter",
  "Poppins",
  "Montserrat",
  "Roboto Slab",
  "Playfair Display",
  "Lora",
]);

const legacyUserAgent = "Mozilla/5.0 (Windows NT 6.1; rv:38.0) Gecko/20100101 Firefox/38.0";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const family = requestUrl.searchParams.get("family");
  const requestedWeight = requestUrl.searchParams.get("weight");
  const weight = requestedWeight === "700" ? "700" : "400";
  const italic = requestUrl.searchParams.get("italic") === "true";
  if (!family || !allowedFamilies.has(family)) {
    return Response.json({ error: "Unsupported font family." }, { status: 400 });
  }

  try {
    const variants = [
      { weight, italic },
      ...(italic ? [{ weight, italic: false }] : []),
      ...(weight === "700" ? [{ weight: "400", italic: false }] : []),
    ].filter((variant, index, all) => all.findIndex((candidate) => candidate.weight === variant.weight && candidate.italic === variant.italic) === index);

    for (const variant of variants) {
      const fontVariant = variant.italic ? `ital,wght@1,${variant.weight}` : `wght@${variant.weight}`;
      const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${fontVariant}&display=swap`;
      const cssResponse = await fetch(cssUrl, { headers: { "User-Agent": legacyUserAgent } });
      if (!cssResponse.ok) continue;

      const css = await cssResponse.text();
      const fontUrl = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff)\)/i)?.[1];
      if (!fontUrl) continue;

      const fontResponse = await fetch(fontUrl);
      if (!fontResponse.ok) continue;

      return new Response(await fontResponse.arrayBuffer(), {
        headers: {
          "Content-Type": "font/woff",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          "X-Textify-Synthetic-Italic": String(italic && !variant.italic),
        },
      });
    }

    throw new Error("Google Fonts could not provide a compatible variant for the selected family.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load the selected font.";
    return Response.json({ error: message }, { status: 502 });
  }
}