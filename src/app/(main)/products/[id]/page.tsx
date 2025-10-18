import {
  Column,
  Row,
  Card,
  Avatar,
  Text,
  Media,
  Line,
  Icon,
  Heading,
  Tag,
  List,
  ListItem,
  Grid,
} from "@once-ui-system/core";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  buildVariantSummary,
  extractTags,
  formatDateTime,
  formatViewLabel,
  resolveImageUrl,
  selectPrimaryImage,
  stripHtml,
} from "../utils";

const envBaseUrl = process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL;
const API_BASE_URL = (envBaseUrl ?? "http://localhost:4440").replace(/\/$/, "");

type ApiVariant = {
  id: number;
  product_id?: number;
  title: string;
  sku: string | null;
  price: string | number | null;
  available: boolean | null;
  compare_at_price?: string | number | null;
  inventory_quantity?: number | null;
  image_id?: number | null;
};

type ApiProduct = {
  id: number;
  shopify_id?: number | string;
  title: string;
  description?: string | null;
  description_html?: string | null;
  handle?: string | null;
  vendor?: string | null;
  product_type?: string | null;
  status?: string | null;
  tags?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  extraction_date?: string | null;
  local_dir?: string | null;
  variants: ApiVariant[];
  images: {
    view: string;
    url: string;
  }[];
};

const fetchProduct = async (id: string): Promise<ApiProduct | null> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`No se pudo cargar el producto (${response.status})`);
  }

  return response.json();
};

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.id);

  if (!product) {
    notFound();
  }

  const tags = extractTags(product.tags);
  const createdAt = formatDateTime(product.created_at);
  const updatedAt = formatDateTime(product.updated_at);
  const extractionDate = formatDateTime(product.extraction_date);
  const descriptionSource = product.description_html ?? product.description ?? "";
  const description =
    stripHtml(descriptionSource) || "Este producto no tiene descripción disponible por el momento.";

  const availableVariants =
    product.variants?.filter((variant) => variant.available).length ?? 0;
  const totalVariants = product.variants?.length ?? 0;

  const fallbackImage = product.images?.[0] ?? null;
  const primaryImage =
    selectPrimaryImage(product.images, ["side", "profile", "front", "lateral"]) ??
    fallbackImage;
  const primaryIndex =
    primaryImage && product.images
      ? product.images.findIndex((image) => image === primaryImage)
      : -1;
  const secondaryImages =
    product.images?.filter((_, index) => index !== primaryIndex) ?? [];
  const highlightImages = secondaryImages.slice(0, 4);
  const galleryImages = secondaryImages.slice(4);
  const primaryIndexSafe = primaryIndex >= 0 ? primaryIndex : 0;

  return (
    <Column fillWidth center padding="xl" gap="xl" style={{ minHeight: "100vh" }}>
      <Column maxWidth="xl" fillWidth gap="xl">
        <Row>
          <Link href="/products" className="product-detail__back">
            Volver a Productos
          </Link>
        </Row>

        <div className="product-detail-hero">
          <div className="product-detail-visual">
            <Card
              radius="l-4"
              direction="column"
              border="neutral-alpha-medium"
              padding="0"
              shadow="m"
            >
              <Media
                border="neutral-alpha-weak"
                fillWidth
                aspectRatio="4 / 3"
                objectFit="cover"
                radius="l"
                height={480}
                alt={`${product.title} - ${formatViewLabel(primaryImage?.view, primaryIndexSafe)}`}
                src={resolveImageUrl(primaryImage?.url, API_BASE_URL)}
              />
            </Card>

            {highlightImages.length > 0 && (
              <div className="product-detail-thumbs">
                {highlightImages.map((image, index) => {
                  const viewLabel = formatViewLabel(image.view, index);
                  return (
                    <Card
                      key={`${product.id}-highlight-${image.view}-${index}`}
                      radius="l"
                      direction="column"
                      border="neutral-alpha-medium"
                      padding="0"
                    >
                      <Media
                        border="neutral-alpha-weak"
                        aspectRatio="1 / 1"
                        objectFit="cover"
                        height={120}
                        radius="l"
                        alt={`${product.title} - ${viewLabel}`}
                        src={resolveImageUrl(image.url, API_BASE_URL)}
                      />
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <Card
            radius="l-4"
            direction="column"
            border="neutral-alpha-medium"
            padding="24"
            shadow="m"
            className="product-detail-info"
          >
            <Column gap="16">
              <Column gap="8">
                <Row gap="8" vertical="center">
                  <Avatar size="s" src="/images/avatar.jpg" />
                  <Column gap="2">
                    <Text variant="label-default-s">{product.vendor ?? "Sin proveedor"}</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {product.handle ?? `ID interno ${product.id}`}
                    </Text>
                  </Column>
                </Row>
                <Heading variant="display-strong-m">{product.title}</Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {description}
                </Text>
              </Column>

              {tags.length > 0 && (
                <Row gap="8" wrap>
                  {tags.map((tag) => (
                    <Tag key={tag} size="s" variant="neutral" label={tag} />
                  ))}
                </Row>
              )}

              <Column gap="4">
                {product.product_type && (
                  <Text variant="body-default-xs" onBackground="neutral-medium">
                    Tipo: {product.product_type}
                  </Text>
                )}
                {product.status && (
                  <Text variant="body-default-xs" onBackground="neutral-medium">
                    Estado: {product.status}
                  </Text>
                )}
                {createdAt && (
                  <Text variant="body-default-xs" onBackground="neutral-medium">
                    Creado: {createdAt}
                  </Text>
                )}
                {updatedAt && (
                  <Text variant="body-default-xs" onBackground="neutral-medium">
                    Actualizado: {updatedAt}
                  </Text>
                )}
                {extractionDate && (
                  <Text variant="body-default-xs" onBackground="neutral-medium">
                    Última extracción: {extractionDate}
                  </Text>
                )}
                {product.local_dir && (
                  <Text variant="body-default-xs" onBackground="neutral-medium">
                    Carpeta local: {product.local_dir}
                  </Text>
                )}
              </Column>

              <Line background="neutral-alpha-medium" />
              <Row
                paddingY="8"
                gap="16"
                vertical="center"
                textVariant="label-default-s"
                onBackground="neutral-medium"
              >
                <Icon name="like" size="s" onBackground="neutral-strong" />
                {availableVariants}
                <Icon name="chat" size="s" onBackground="neutral-strong" marginLeft="24" />
                {totalVariants}
              </Row>
            </Column>
          </Card>
        </div>

        {(product.images?.length ?? 0) === 0 && (
          <Card
            radius="l-4"
            direction="column"
            border="neutral-alpha-medium"
            padding="24"
            horizontal="center"
            vertical="center"
          >
            <Column gap="8" align="center">
              <Text variant="label-default-m" onBackground="neutral-medium">
                Sin imágenes procesadas
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak" align="center">
                Aún no hay vistas generadas por Gemini para este producto.
              </Text>
            </Column>
          </Card>
        )}

        {galleryImages.length > 0 && (
          <Card radius="l-4" direction="column" border="neutral-alpha-medium" padding="24" shadow="m">
            <Column gap="16">
              <Heading variant="display-strong-s">Galería adicional</Heading>
              <Grid columns="3" gap="m" m={{ columns: 2 }} s={{ columns: 1 }}>
                {galleryImages.map((image, index) => {
                  const viewLabel = formatViewLabel(image.view, index + highlightImages.length + 1);
                  return (
                    <Card
                      key={`${product.id}-gallery-${image.view}-${index}`}
                      radius="l-4"
                      direction="column"
                      border="neutral-alpha-medium"
                      padding="0"
                    >
                      <Media
                        border="neutral-alpha-weak"
                        fillWidth
                        aspectRatio="4 / 3"
                        radius="l"
                        objectFit="cover"
                        alt={`${product.title} - ${viewLabel}`}
                        src={resolveImageUrl(image.url, API_BASE_URL)}
                      />
                      <Column paddingX="16" paddingY="12" gap="4">
                        <Text variant="body-default-xs" onBackground="neutral-medium">
                          {viewLabel}
                        </Text>
                      </Column>
                    </Card>
                  );
                })}
              </Grid>
            </Column>
          </Card>
        )}

        {product.variants?.length > 0 && (
          <Card radius="l-4" direction="column" border="neutral-alpha-medium" padding="24">
            <Column gap="8">
              <Heading variant="display-strong-s">Variantes</Heading>
              <List as="ul" gap="8" paddingLeft="0" style={{ listStyle: "none" }}>
                {product.variants.map((variant) => (
                  <ListItem
                    key={variant.id}
                    as="li"
                    variant="body-default-s"
                    onBackground="neutral-medium"
                  >
                    {buildVariantSummary(variant)}
                  </ListItem>
                ))}
              </List>
            </Column>
          </Card>
        )}
      </Column>
    </Column>
  );
}
