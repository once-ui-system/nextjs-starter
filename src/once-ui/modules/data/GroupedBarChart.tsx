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

interface GroupedBarChartProps extends Omit<React.ComponentProps<typeof Flex>, 'title' | 'description'> {
  data: MultiBarDataPoint[];
  labels?: "x" | "y" | "both" | "none";
  xAxisKey?: string;
  yAxisKeys?: string[];
  barLabels?: string[];
  yAxisTitle?: string;
  barWidth?: SpacingToken | "fill" | number | string;
  isTimeSeries?: boolean;
  timeFormat?: string;
  legend?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  tooltipTitle?: string;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  data,
  labels = "both",
  xAxisKey = "name",
  yAxisKeys = ["value1", "value2", "value3"],
  barLabels,
  barWidth = "fill",
  isTimeSeries = false,
  timeFormat,
  title,
  yAxisTitle,
  description,
  legend = false,
  tooltipTitle,
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
      radius="l"
      vertical="center"
      data-viz="categorical"
      height={24}
      {...flex}
    >
      {(title || description) && (
        <Column
          fillWidth
          borderBottom="neutral-medium"
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
                content={<Legend labels={labels} colors={barColors} />}
                wrapperStyle={{ position: "absolute", top: 0, right: 0 }}
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
              content={props => 
                <Tooltip
                  {...props}
                  isTimeSeries={isTimeSeries}
                  timeFormat={timeFormat}
                  showColors={true}
                />
              }
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
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
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {yAxisKeys.map((key, index) => (
              <RechartsBar
                key={key}
                dataKey={key}
                name={barLabels?.[index] || key}
                fill={`url(#barGradient${index})`}
                stroke={barColors[index % barColors.length]}
                strokeWidth={1}
                radius={[6, 6, 0, 0]}
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