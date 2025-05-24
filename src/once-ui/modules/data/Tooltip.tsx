"use client";

import React from "react";
import moment from "moment";
import { Column, Text, Row } from "../../components";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  xAxisKey?: string;
  xAxisTitle?: string;
  tooltip?: React.ReactNode;
  isTimeSeries?: boolean;
  timeFormat?: string;
  showColors?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  xAxisKey = "name",
  xAxisTitle,
  tooltip,
  isTimeSeries = false,
  timeFormat = "MMM DD, YYYY",
  showColors = true
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Get the data point from the payload
  const dataPoint = payload[0].payload;
  
  // Get the proper label from the payload data
  const displayLabel = dataPoint?.[xAxisKey] || label;
  
  // Format the label if it's a time series
  const formattedLabel = isTimeSeries && displayLabel 
    ? moment(displayLabel).format(timeFormat) 
    : dataPoint?.endDate || displayLabel;

  return (
    <Column
      minWidth={8}
      gap="8"
      background="surface"
      radius="m"
      border="neutral-alpha-medium">
      <Row
        fillWidth
        paddingTop="8"
        paddingX="12"
      >
        <Text
          variant="label-default-s"
          onBackground="neutral-strong"
        >
          {xAxisTitle && `${xAxisTitle}: `}{formattedLabel}
        </Text>
      </Row>
      <Column
        fillWidth
        horizontal="space-between"
        paddingBottom="8"
        paddingX="12"
        gap="4">
        {payload.map((entry: any, index: number) => (
          <Row key={index} horizontal="space-between" fillWidth gap="16">
            <Row vertical="center" gap="8">
              {showColors && (
                <Row
                  style={{
                    backgroundClip: "padding-box",
                    border: `1px solid ${entry.stroke || entry.color}`,
                    background: `linear-gradient(to bottom, ${entry.stroke || entry.color} 0%, transparent 100%)`
                  }}
                  minWidth="12"
                  minHeight="12"
                  radius="xs"
                />
              )}
              <Text onBackground="neutral-weak" variant="label-default-s">
                {tooltip && index === 0 ? tooltip : entry.name}
              </Text>
            </Row>
            <Text onBackground="neutral-strong" variant="label-default-s">
              {typeof entry.value === 'number' 
                ? entry.value.toLocaleString() 
                : entry.value}
            </Text>
          </Row>
        ))}
      </Column>
    </Column>
  );
};

export { Tooltip };
export type { TooltipProps };
