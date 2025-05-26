"use client";

import React from "react";
import { Column, Text, Spinner } from "../../components";

export interface ChartStatusProps {
  /**
   * Whether the chart is in a loading state
   */
  loading?: boolean;
  /**
   * Whether the chart has no data
   */
  isEmpty?: boolean;
  /**
   * Custom empty state content
   */
  emptyState?: React.ReactNode;
  /**
   * The message to display when there's no data
   * @default "No data available for the selected period"
   */
  emptyMessage?: string;
}

/**
 * ChartStatus component for displaying loading and empty states in chart components
 */
export const ChartStatus: React.FC<ChartStatusProps> = ({
  loading = false,
  isEmpty = false,
  emptyState,
  emptyMessage = "No data available for the selected period"
}) => {
  if (!loading && !isEmpty) {
    return null;
  }

  return (
    <Column fill center>
      {loading ? (
        <Spinner size="m" />
      ) : isEmpty && (
        emptyState || (
          <Text variant="label-default-s" onBackground="neutral-weak">
            {emptyMessage}
          </Text>
        )
      )}
    </Column>
  );
};
