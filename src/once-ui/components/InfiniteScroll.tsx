"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { Column } from "./Column";
import { Row } from "./Row";

export interface InfiniteScrollProps<T> extends React.ComponentProps<typeof Row> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  loadMore: () => Promise<boolean>;
  loading?: boolean;
  threshold?: number;
  className?: string;
}

function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  loading = false,
  threshold = 200,
  ...flex
}: InfiniteScrollProps<T>) {
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(loading);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const hasMoreItems = await loadMore();
      setHasMore(hasMoreItems);
    } catch (error) {
      console.error("Error loading more items:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasMore || isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0.1,
      },
    );

    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items, hasMore, isLoading]);

  return (
    <>
      {items.map((item, index) => {
        // If this is the last item, attach the ref
        if (index === items.length - 1) {
          return (
            <Row key={index} ref={lastItemRef} {...flex}>
              {renderItem(item, index)}
            </Row>
          );
        }
        return <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>;
      })}

      {isLoading && (
        <Column fillWidth horizontal="center" padding="24">
          <Spinner size="m" />
        </Column>
      )}
    </>
  );
}

export { InfiniteScroll };
