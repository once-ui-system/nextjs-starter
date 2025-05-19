"use client";

import { Column, Media, Text, Row, Card } from ".";
import { useOgData } from "../hooks/useFetchOg";
import { useMemo } from "react";

export interface OgData {
  title: string;
  description: string;
  faviconUrl: string;
  image: string;
  url: string;
}

interface OgCardProps extends React.ComponentProps<typeof Card> {
  url?: string;
  ogData?: Partial<OgData> | null;
  direction?: "column" | "row" | "column-reverse" | "row-reverse";
}

const getProxiedImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return "";
  
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }
  
  return `/api/og/proxy?url=${encodeURIComponent(imageUrl)}`;
};

const formatDisplayUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  try {
    const urlObj = new URL(url);
    
    let domain = urlObj.hostname;
    
    domain = domain.replace(/^www\./, "");
    
    return domain;
  } catch (error) {
    let formattedUrl = url.replace(/^https?:\/\//, "");
    formattedUrl = formattedUrl.replace(/^www\./, "");
    
    formattedUrl = formattedUrl.split("/")[0];
    
    return formattedUrl;
  }
};

const getFaviconUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    const faviconSourceUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    return `/api/og/proxy?url=${encodeURIComponent(faviconSourceUrl)}`;
  } catch (error) {
    return "";
  }
};

const OgCard = ({ url, ogData: providedOgData, direction = "column", ...card }: OgCardProps) => {
  const { ogData: fetchedOgData, loading } = useOgData(url || null);
  const data = providedOgData || fetchedOgData;
  
  const proxiedImageUrl = useMemo(() => {
    return getProxiedImageUrl(data?.image);
  }, [data?.image]);
  
  const faviconUrl = useMemo(() => {
    return data?.faviconUrl || getFaviconUrl(data?.url);
  }, [data?.faviconUrl, data?.url]);
  
  if (!data || (!data.image && !data.title)) {
    return null;
  }
  
  return (
    <Card href={data.url} direction={direction} fillWidth vertical={direction === "row" || direction === "row-reverse" ? "center" : undefined} gap="4" radius="l" background="surface" border="neutral-alpha-medium" {...card}>
      {(proxiedImageUrl || loading) && (
        <Media 
          minWidth={(direction === "row" || direction === "row-reverse") ? 16 : undefined}
          maxWidth={(direction === "row" || direction === "row-reverse") ? 24 : undefined}
          loading={loading}
          radius="l"
          sizes="320px"
          aspectRatio="16/9" 
          border="neutral-alpha-weak"
          src={proxiedImageUrl}
        />
      )}
      <Column fillWidth paddingX="12" paddingY="12" gap="12">
        <Row fillWidth gap="8" vertical="center">
          {(faviconUrl || loading) && (
            <Media 
              aspectRatio="1/1" 
              src={faviconUrl} 
              loading={loading}
              minWidth="16"
              maxWidth="16"
              radius="xs"
              border="neutral-alpha-weak"
              unoptimized={true}
            />
          )}
          {data.url && <Text variant="label-default-s" onBackground="neutral-weak">{formatDisplayUrl(data.url)}</Text>}
        </Row>
        <Column fillWidth gap="2" paddingX="4">
          {data.title && <Text variant="label-strong-m">{data.title}</Text>}
          {data.description && <Text variant="label-default-s" onBackground="neutral-weak">{data.description}</Text>}
        </Column>
      </Column>
    </Card>
  );
};

OgCard.displayName = "OgCard";
export { OgCard };