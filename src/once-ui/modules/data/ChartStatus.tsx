"use client";

import React from "react";
import { Column, Text, Spinner } from "../../components";

export interface ChartStatusProps {
  loading?: boolean;
  isEmpty?: boolean;
  emptyState?: React.ReactNode;
}

export const ChartStatus: React.FC<ChartStatusProps> = ({
  loading = false,
  isEmpty = false,
  emptyState = "No data available for the selected period",
}) => {
  if (!loading && !isEmpty) {
    return null;
  }

  return (
    <Column fill center>
      {loading ? (
        <Spinner size="m" />
      ) : (
        isEmpty && (
          <Text variant="label-default-s" onBackground="neutral-weak">
            {emptyState}
          </Text>
        )
      )}
    </Column>
  );
};
