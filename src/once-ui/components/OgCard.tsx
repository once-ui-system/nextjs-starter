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

export interface OgDisplayOptions {
  favicon?: boolean;
  domain?: boolean;
  title?: boolean;
  description?: boolean;
  image?: boolean;
}

interface OgCardProps extends React.ComponentProps<typeof Card> {
  url?: string;
  ogData?: Partial<OgData> | null;
  direction?: "column" | "row" | "column-reverse" | "row-reverse";
  display?: OgDisplayOptions;
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

const OgCard = ({ 
  url, 
  ogData: providedOgData, 
  direction = "column", 
  display,
  ...card 
}: OgCardProps) => {
  // Merge with defaults
  const displayOptions = {
    favicon: true,
    domain: true,
    title: true,
    description: true,
    image: true,
    ...display
  };
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
      {displayOptions.image && (proxiedImageUrl || loading) && (
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
      <Column fillWidth paddingX="12" paddingY="12" gap="8">
        {(displayOptions.favicon || displayOptions.domain) && (
          <Row fillWidth gap="8" vertical="center">
            {displayOptions.favicon && (faviconUrl || loading) && (
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
            {displayOptions.domain && data.url && (
              <Text variant="label-default-s" onBackground="neutral-weak">{formatDisplayUrl(data.url)}</Text>
            )}
          </Row>
        )}
        <Column fillWidth gap="2">
          {displayOptions.title && data.title && (
            <Text variant="label-default-s">{data.title}</Text>
          )}
          {displayOptions.description && data.description && (
            <Text variant="label-default-s" onBackground="neutral-weak">{data.description}</Text>
          )}
        </Column>
      </Column>
    </Card>
  );
};

OgCard.displayName = "OgCard";
export { OgCard };