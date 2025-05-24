"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  ResponsiveContainer as RechartsResponsiveContainer,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from "recharts";

import { TShirtSizes } from "../../types";
import { Text, Flex, Column, Row } from "../../components";
import { Tooltip, Legend } from "../";

interface DataPoint {
  name: string;
  value: number;
  startDate: string;
  endDate: string;
  color?: string;
}

interface BarChartProps extends Omit<React.ComponentProps<typeof Flex>, 'title' | 'description'> {
  data: DataPoint[];
  xAxisKey?: string;
  yAxisKey?: string;
  barWidth?: TShirtSizes | "fill";
  title?: React.ReactNode;
  description?: React.ReactNode;
  legend?: boolean;
  tooltip?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  labels?: "x" | "y" | "both";
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisKey = "name",
  yAxisKey = "value",
  yAxisTitle,
  barWidth = "fill",
  border = "neutral-medium",
  color = "blue",
  legend = false,
  title,
  description,
  tooltip,
  labels = "both",
  ...flex
}) => {
  return (
    <Column
      fillWidth
      height={24}
      border={border}
      radius="l"
      data-viz="categorical"
      {...flex} 
    >
      <Column
        borderBottom={border}
        fillWidth
        paddingX="20"
        paddingY="12"
        gap="4"
        vertical="center"
      >
        {title && (
          <Text variant="heading-strong-s">
            {title}
          </Text>
        )}
        {description && (
          <Text variant="label-default-s" onBackground="neutral-weak">
            {description}
          </Text>
        )}
      </Column>
      <Row fill>
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ left: 0, right: 0, bottom: 0 }}
          >
            <RechartsCartesianGrid
              horizontal={true}
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <RechartsLegend
                content={<Legend colors={[color]} labels={labels} position="top" />}
                wrapperStyle={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  margin: 0
                }}
              />
            )}
            {(labels === "x" || labels === "both") && (
              <RechartsXAxis
                dataKey={xAxisKey}
                axisLine={{
                  stroke: "var(--neutral-alpha-weak)",
                }}
                tickLine={false}
                height={32}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 12,
                }}
              />
            )}
            {(labels === "y" || labels === "both") && (
              <RechartsYAxis
                allowDataOverflow
                padding={{ top: 40 }}
                width={yAxisTitle ? 56 : 0}
                tickLine={false}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 11,
                }}
                axisLine={{
                  stroke: "var(--neutral-alpha-medium)",
                }}
                label={
                  yAxisTitle
                    ? { 
                        value: yAxisTitle,
                        position: 'insideTop',
                        offset: 10,
                        fontSize: 12,
                        fill: "var(--neutral-on-background-medium)" 
                        }
                    : undefined
                }
              />
            )}
            <RechartsTooltip
              content={props => <Tooltip {...props} tooltip={tooltip} showColors={false} />}
              cursor={{ fill: "var(--neutral-alpha-weak)" }}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                {[
                  { offset: "0%", opacity: 0.8 },
                  { offset: "100%", opacity: 0 },
                ].map(({ offset, opacity }) => (
                  <stop
                    key={offset}
                    offset={offset}
                    stopColor={`var(--data-${color})`}
                    stopOpacity={opacity}
                  />
                ))}
              </linearGradient>
            </defs>
            <RechartsBar
              dataKey={yAxisKey}
              fill="url(#barGradient)"
              stroke={`var(--data-${color})`}
              strokeWidth={1}
              barSize={
              barWidth === "fill"
                ? "100%"
                : barWidth === "xs"
                ? 12
                : barWidth === "s"
                ? 16
                : barWidth === "m"
                ? 24
                : barWidth === "l"
                ? 40
                : barWidth === "xl"
                ? 64
                : barWidth
              }
              radius={[4, 4, 4, 4]}
            />
          </RechartsBarChart>
        </RechartsResponsiveContainer>
      </Row>
    </Column>
  );
};

BarChart.displayName = "BarChart";

export { BarChart };
export type { BarChartProps };
