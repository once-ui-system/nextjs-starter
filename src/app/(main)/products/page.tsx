"use client";

import { useEffect, useState } from "react";

import {
  Column,
  Row,
  Card,
  Avatar,
  Text,
  Media,
  Line,
  Heading,
  Grid,
  Tag,
  Skeleton,
} from "@once-ui-system/core";

import {
  extractTags,
  formatDateTime,
  formatViewLabel,
  resolveImageUrl,
  selectPrimaryImage,
  stripHtml,
} from "./utils";

const envBaseUrl = process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL;
const API_BASE_URL = (envBaseUrl ?? "http://localhost:4440").replace(/\/$/, "");
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

type ApiVariant = {
  id: number;
  product_id?: number;
  title: string;
  sku: string | null;
  price: string | number | null;
  available: boolean | null;
};

type ApiProduct = {
  id: number;
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
  images: {
    view: string;
    url: string;
  }[];
  variants: ApiVariant[];
};

const SKELETON_CARD_COUNT = 6;

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(PRODUCTS_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Error al cargar productos (${response.status})`);
        }
        const data: ApiProduct[] = await response.json();
        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "No se pudieron cargar los productos";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderLoading = () => (
    <Grid columns="4" gap="l" m={{ columns: 3 }} s={{ columns: 2 }}>
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          fillWidth
          radius="l-4"
          direction="column"
          border="neutral-alpha-medium"
          padding="0"
          shadow="m"
        >
          <Row fillWidth paddingX="20" paddingY="12" gap="8" vertical="center">
            <Skeleton shape="circle" width="s" height="s" />
            <Skeleton shape="line" width="m" />
          </Row>
          <Skeleton shape="block" height="l" />
          <Column fillWidth paddingX="20" paddingY="24" gap="12">
            <Skeleton shape="line" width="m" />
            <Skeleton shape="line" width="m" />
            <Skeleton shape="line" width="m" />
          </Column>
          <Line background="neutral-alpha-medium" />
          <Row paddingX="20" paddingY="12" gap="12" vertical="center">
            <Skeleton shape="line" width="s" />
            <Skeleton shape="line" width="s" />
          </Row>
        </Card>
      ))}
    </Grid>
  );

  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }

    if (error) {
      return (
        <Row fillWidth horizontal="center">
          <Text variant="body-default-m" onBackground="danger-strong">
            {error}
          </Text>
        </Row>
      );
    }

    if (products.length === 0) {
      return (
        <Row fillWidth horizontal="center" paddingY="40">
          <Text variant="body-default-m" onBackground="neutral-medium">
            No hay productos disponibles.
          </Text>
        </Row>
      );
    }

    return (
      <Grid columns="4" gap="l" m={{ columns: 3 }} s={{ columns: 2 }}>
        {products.map((product) => {
          const primaryImage = selectPrimaryImage(product.images, ["side", "profile", "lateral"]);
          const primaryImageIndex = primaryImage ? product.images.indexOf(primaryImage) : 0;
          const viewLabel = formatViewLabel(primaryImage?.view, primaryImageIndex);
          const descriptionSource = product.description_html ?? product.description ?? "";
          const descriptionText =
            stripHtml(descriptionSource) ||
            "Este producto no tiene descripción disponible por el momento.";
          const description =
            descriptionText.length > 220
              ? `${descriptionText.slice(0, 217).trimEnd()}...`
              : descriptionText;

          const tags = extractTags(product.tags);
          const createdAt = formatDateTime(product.created_at);
          const updatedAt = formatDateTime(product.updated_at);
          const extractionDate = formatDateTime(product.extraction_date);

          const availableVariants =
            product.variants?.filter((variant) => variant.available).length ?? 0;
          const totalVariants = product.variants?.length ?? 0;

          return (
            <Card
              key={product.id}
              href={`/products/${product.id}`}
              fillWidth
              radius="l-4"
              direction="column"
              border="neutral-alpha-medium"
              padding="0"
              shadow="m"
            >
              <Row fillWidth paddingX="20" paddingY="12" gap="8" vertical="center">
                <Avatar size="xs" src="/images/avatar.jpg" />
                <Column gap="2">
                  <Text variant="label-default-s">{product.vendor ?? "Sin proveedor"}</Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {viewLabel}
                  </Text>
                </Column>
              </Row>
              <Media
                border="neutral-alpha-weak"
                sizes="400px"
                fillWidth
                aspectRatio="4 / 3"
                radius="l"
                objectFit="cover"
                alt={`${product.title} - ${viewLabel}`}
                src={resolveImageUrl(primaryImage?.url, API_BASE_URL)}
              />
              <Column fillWidth paddingX="20" paddingY="24" gap="12">
                <Text variant="body-default-xl">{product.title}</Text>
                <Text
                  onBackground="neutral-weak"
                  variant="body-default-s"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                  }}
                >
                  {description}
                </Text>
                {tags.length > 0 && (
                  <Row gap="8" wrap>
                    {tags.slice(0, 3).map((tag) => (
                      <Tag key={tag} size="s" variant="neutral" label={tag} />
                    ))}
                  </Row>
                )}
                <Column gap="4">
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
                </Column>
              </Column>
              <Line background="neutral-alpha-medium" />
              <Row
                paddingX="20"
                paddingY="12"
                gap="12"
                vertical="center"
                textVariant="label-default-s"
                onBackground="neutral-medium"
              >
                <Text variant="label-default-s" onBackground="neutral-medium">
                  {availableVariants} disponibles · {totalVariants} variantes
                </Text>
              </Row>
            </Card>
          );
        })}
      </Grid>
    );
  };

  return (
    <Column fillWidth center padding="xl" gap="xl" style={{ minHeight: "100vh" }}>
      <Column fillWidth gap="l">
        <Heading variant="display-strong-l">Productos</Heading>
        {renderContent()}
      </Column>
    </Column>
  );
}
