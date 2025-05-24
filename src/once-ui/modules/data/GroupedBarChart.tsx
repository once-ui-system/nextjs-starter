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

import { SpacingToken } from "../../types";
import { Text, Flex, Column, Row } from "../../components";
import { Tooltip, Legend } from "../";

interface MultiBarDataPoint {
  name: string;
  value1?: number;
  value2?: number;
  value3?: number;
  startDate?: string;
  endDate?: string;
}

interface BarProps {
  labels?: string[];
  width?: SpacingToken | "fill" | number;
}

interface TimeProps {
  series?: boolean;
  format?: string;
}

interface TooltipProps {
  title?: string;
}

interface GroupedBarChartProps extends Omit<React.ComponentProps<typeof Flex>, 'title' | 'description'> {
  data: MultiBarDataPoint[];
  labels?: "x" | "y" | "both" | "none";
  xAxisKey?: string;
  yAxisKeys?: string[];
  yAxisTitle?: string;
  legend?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  bar?: BarProps;
  time?: TimeProps;
  tooltip?: TooltipProps;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  data,
  labels = "both",
  xAxisKey = "name",
  yAxisKeys = ["value1", "value2", "value3"],
  bar = { labels: [], width: "fill" },
  time = { series: false, format: "" },
  tooltip = { title: "" },
  title,
  yAxisTitle,
  description,
  legend = false,
  border = "neutral-medium",
  ...flex
}) => {
  const barColors = [
    "var(--data-blue)",
    "var(--data-green)",
    "var(--data-orange)",
  ];

  return (
    <Column
      fillWidth
      height={24}
      border={border}
      radius="l"
      data-viz="categorical"
      {...flex}
    >
      {(title || description) && (
        <Column
          fillWidth
          borderBottom={border}
          paddingX="20"
          paddingY="12"
          gap="4"
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
      )}
      <Row fill>
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            barGap={4}
          >
            <RechartsCartesianGrid
              horizontal
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <RechartsLegend
                content={
                  <Legend
                    labels={labels}
                    colors={barColors}
                  />
                }
                wrapperStyle={{
                  position: "absolute", 
                  top: 0, 
                  right: 0,
                  margin: 0
                }}
              />
            )}
            {(labels === "x" || labels === "both") && (
              <RechartsXAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 12,
                }}
              />
            )}
            {(labels === "y" || labels === "both") && (
              <RechartsYAxis
                allowDataOverflow
                axisLine={{
                  stroke: "var(--neutral-alpha-medium)",
                }}
                tickLine={false}
                padding={{ top: 40 }}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 11,
                }}
                width={yAxisTitle ? 54 : 0}
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
              cursor={{ fill: "var(--neutral-alpha-weak)" }}
              content={props => 
                <Tooltip
                  {...props}
                  isTimeSeries={time.series}
                  timeFormat={time.format}
                  showColors={true}
                  xAxisTitle={tooltip.title}
                />
              }
            />
            <defs>
              {barColors.map((color, index) => (
                <linearGradient
                  id={`barGradient${index}`}
                  key={index}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {yAxisKeys.map((key, index) => (
              <RechartsBar
                key={key}
                dataKey={key}
                name={bar.labels?.[index] || key}
                fill={`url(#barGradient${index})`}
                stroke={barColors[index % barColors.length]}
                strokeWidth={1}
                radius={[4, 4, 4, 4]}
                barSize={
                  bar.width === "fill"
                    ? "100%"
                    : bar.width === "xs"
                    ? 12
                    : bar.width === "s"
                    ? 16
                    : bar.width === "m"
                    ? 24
                    : bar.width === "l"
                    ? 40
                    : bar.width === "xl"
                    ? 64
                    : bar.width
                }
                isAnimationActive={false}
              />
            ))}
          </RechartsBarChart>
        </RechartsResponsiveContainer>
      </Row>
    </Column>
  );
};

GroupedBarChart.displayName = "GroupedBarChart";

export { GroupedBarChart };
export type { GroupedBarChartProps };