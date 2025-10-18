const DEFAULT_IMAGE = "/images/card.jpg";

const buildImageProxyUrl = (path: string) =>
  `/api/product-image?${new URLSearchParams({ path }).toString()}`;

const encodePath = (value: string) =>
  value
    .split("/")
    .map((segment) => {
      if (!segment) return "";
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");

export const resolveImageUrl = (path?: string | null, apiBaseUrl?: string | null) => {
  if (!path) {
    return DEFAULT_IMAGE;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return buildImageProxyUrl(path);
};

export const formatPrice = (price: string | number | null | undefined) => {
  if (price === null || price === undefined) {
    return "Sin precio";
  }

  const numericPrice = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(numericPrice)) {
    return `${price}`;
  }

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
};

export const extractTags = (tags?: string | null) =>
  tags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];

export const formatViewLabel = (view?: string | null, index?: number) => {
  if (!view) {
    return index !== undefined ? `Vista ${index + 1}` : "Vista";
  }
  return view
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalize = (value?: string | null) => value?.toLowerCase() ?? "";

export const selectPrimaryImage = <T extends { view?: string | null; url?: string | null }>(
  images?: T[] | null,
  preferences: string[] = ["side", "profile", "lateral"],
): T | undefined => {
  if (!images || images.length === 0) {
    return undefined;
  }

  for (const preference of preferences) {
    const exactMatch = images.find((image) => normalize(image.view) === preference);
    if (exactMatch) {
      return exactMatch;
    }
  }

  for (const preference of preferences) {
    const viewContains = images.find((image) => normalize(image.view).includes(preference));
    if (viewContains) {
      return viewContains;
    }
  }

  for (const preference of preferences) {
    const urlContains = images.find((image) => normalize(image.url).includes(preference));
    if (urlContains) {
      return urlContains;
    }
  }

  const frontFallback =
    images.find((image) => normalize(image.view).includes("front")) ??
    images.find((image) => normalize(image.url).includes("front"));

  return frontFallback ?? images[0];
};

export const formatDateTime = (date?: string | null) => {
  if (!date) {
    return null;
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

export const buildVariantSummary = (variant: {
  title: string;
  sku?: string | null;
  price?: string | number | null;
  compare_at_price?: string | number | null;
  inventory_quantity?: number | null;
  available?: boolean | null;
}) => {
  const bits: string[] = [variant.title];
  if (variant.sku) {
    bits.push(`SKU ${variant.sku}`);
  }
  if (variant.price !== undefined && variant.price !== null) {
    bits.push(`Precio ${formatPrice(variant.price)}`);
  }
  if (variant.compare_at_price !== undefined && variant.compare_at_price !== null) {
    bits.push(`Antes ${formatPrice(variant.compare_at_price)}`);
  }
  if (variant.inventory_quantity !== undefined && variant.inventory_quantity !== null) {
    bits.push(`Inventario ${variant.inventory_quantity}`);
  }
  bits.push(variant.available ? "Disponible" : "Agotado");
  return bits.join(" · ");
};

export const stripHtml = (value?: string | null) => {
  if (!value) {
    return "";
  }
  return value
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};
