"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import moment from "moment";

import { SpacingToken } from "../../types";

import { Text, Flex, Column } from "../../components";

// Data structure supporting multiple values
interface MultiBarDataPoint {
  name: string;
  value1?: number;
  value2?: number;
  value3?: number;
  startDate?: string;
  endDate?: string;
}

interface GroupedBarChartProps extends React.ComponentProps<typeof Flex> {
  data: MultiBarDataPoint[];
  /**
   * Which axis labels to show
   * @default "both"
   */
  labels?: "x" | "y" | "both" | "none";

  xAxisKey?: string;
  yAxisKeys?: string[];
  barLabels?: string[];
  yAxisTitle?: string;
  barWidth?: SpacingToken | "fill" | number | string;
  isTimeSeries?: boolean;
  timeFormat?: string;
  legend?: boolean;
  title?: string;
  description?: string;
  tooltipTitle?: string;
}

const CustomLegend = ({ payload, labels, colors }: any) => {
  if (!payload || !payload.length) return null;
  return (
    <Flex
    horizontal="start" 
    vertical="center" 
    position="absolute"
    gap="16"
    left={(labels === "y" || labels === "both") ? "80" : "12"}
    top="12"
    >
      {payload.map((entry: any, index: number) => {
        const color = colors[index];
        return (
        <Flex key={index} vertical="center" gap="8">
          <Flex
            style={{
              backgroundClip: "padding-box",
              border: `1px solid ${color}`,
              background: `linear-gradient(to bottom, ${color} 0%,
               transparent 100%)`,
            }}
            minWidth="16"
            minHeight="16"
            radius="s"
          />
          <Text variant="label-default-s">{entry.value}</Text>
        </Flex>
      );
      })}
    </Flex>
  );
};

const CustomTooltip = ({
  active,
  payload,
  isTimeSeries,
  barLabels,
  colors,
  timeFormat = "YYYY-MM-DD",
}: any) => {
  if (!(active && payload && payload.length)) return null;
  const data = payload[0].payload;
  return (
    <Column
      minWidth={8}
      gap="8"
      background="surface"
      radius="m"
      border="neutral-alpha-medium"
    >
      <Flex fillWidth paddingTop="8" paddingX="12">
        <Text variant="label-default-s" onBackground="neutral-strong">
          {isTimeSeries
            ? moment(data.name).format(timeFormat)
            : (data.name || "—")}
        </Text>
      </Flex>
      <Column
        fillWidth
        horizontal="space-between"
        paddingBottom="8"
        paddingX="12"
        gap="4"
      >
        {payload.map((entry: any, index: number) => {
          const color = colors[index];
          return (
            <Flex key={index} horizontal="space-between" fillWidth gap="16">
              <Flex vertical="center" gap="8">
                <Flex
                  style={{
                    backgroundClip: "padding-box",
                    border: `1px solid ${color}`,
                    background: `linear-gradient(to bottom, ${color} 0%, transparent 100%)`
                  }}
                  minWidth="12"
                  minHeight="12"
                  radius="xs"
                />
                <Text onBackground="neutral-weak" variant="label-default-s">
                  {barLabels?.[index] || entry.dataKey}
                </Text>
              </Flex>
              <Text onBackground="neutral-strong" variant="label-default-s">
                {typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value}
              </Text>
            </Flex>
          );
        })}
      </Column>
    </Column>
  );
};

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
  ...flexProps
}) => {
  const barColors = [
    "var(--data-blue)",
    "var(--data-green)",
    "var(--data-orange)",
  ];

  return (
    <Flex
      fill
      radius="l"
      align="center"
      direction="column"
      vertical="center"
      data-viz="categorical"
      height={24}
      {...flexProps}
    >
      {(title || description) && (
        <Column
          fillWidth
          borderBottom="neutral-medium"
          horizontal="start"
          paddingX="20"
          paddingY="12"
          gap="4"
        >
          {title && <Text variant="heading-strong-s">{title}</Text>}
          {description && (
            <Text variant="label-default-s" onBackground="neutral-weak">
              {description}
            </Text>
          )}
        </Column>
      )}
      <Flex fill>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            barGap={4}
          >
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <Legend
                content={<CustomLegend labels={labels} colors={barColors} />}
                wrapperStyle={{ position: "absolute", top: 0, right: 0 }}
              />
            )}
            {(labels === "x" || labels === "both") && (
              <XAxis
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
                          <YAxis
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
            <Tooltip
              content={
                <CustomTooltip
                  colors={barColors}
                  isTimeSeries={isTimeSeries}
                  barLabels={barLabels}
                  timeFormat={timeFormat}
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
              <Bar
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
          </BarChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};

GroupedBarChart.displayName = "GroupedBarChart";

export { GroupedBarChart };
export type { GroupedBarChartProps };