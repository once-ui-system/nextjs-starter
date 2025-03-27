import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  GridProps,
  SpacingProps,
  SizeProps,
  StyleProps,
  CommonProps,
  DisplayProps,
  ConditionalProps,
} from "../interfaces";

import { SpacingToken, ColorScheme, ColorWeight } from "../types";

import styles from "./BarGraph.module.scss";
import { Text, Flex, Heading, Line } from "."; // Import Text component from OnceUI
import classNames from "classnames"; // Import classNames for conditional styling

interface DataPoint {
  name: string;
  value: number;
  startDate: string;
  endDate: string;
  color?: string; // Optional color prop, if needed
}

type BarColor = "success" | "danger" | "purple";

type BarRadius = "xs" | "s" | "m" | "l" | "xl";

interface BarGraphProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  xAxisKey?: string; // Allows customization of the x-axis data key
  yAxisKey?: string; // Allows customization of the y-axis data key
  barColor?: BarColor; // Prop for bar color
  /**
   * Size of the bar graph.
   * @default "m"
   */
  size?: "xs" | "s" | "m" | "l" | "xl";
  blur?: boolean; // Controls backdrop blur effect
  title?: string; // Title for the bar graph
  tooltipTitle?: string; // Title for the tooltip
  /** Hide X-axis labels */
  hideXAxisLabels?: boolean;
  /** Hide Y-axis labels */
  hideYAxisLabels?: boolean;
  /** Hide both X and Y axis labels */
  hideLabels?: boolean;
  /** Title for X-axis */
  xAxisTitle?: string;
  /** Title for Y-axis */
  yAxisTitle?: string;
  /** Hide X-axis title */
  hideXAxisTitle?: boolean;
  /** Hide Y-axis title */
  hideYAxisTitle?: boolean;
  /** Hide both X and Y axis titles */
  hideAxisTitles?: boolean;
}

const CustomTooltip = ({ active, payload, tooltipTitle }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Flex className={styles.tooltip} direction="column">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          vertical="center"
          padding="8"
        >
          <Text
            variant="body-default-s"
            style={{ fontWeight: "600" }}
            onBackground="neutral-strong"
          >{`${data.startDate} - ${data.endDate}`}</Text>
        </Flex>
        <Flex padding="s">
          <Text variant="body-default-s" onBackground="neutral-strong">
            {`${tooltipTitle}: ${data.value}`}
          </Text>
        </Flex>
      </Flex>
    );
  }
  return null;
};

export const BarGraph: React.FC<BarGraphProps> = ({
  data,
  xAxisKey = "name",
  yAxisKey = "value",
  barColor = "success",
  size = "m",
  blur = false,
  border,
  title,
  radius,
  tooltipTitle,
  background,
  hideXAxisLabels = false,
  hideYAxisLabels = false,
  hideLabels = false,
  xAxisTitle,
  yAxisTitle,
  hideXAxisTitle = false,
  hideYAxisTitle = false,
  hideAxisTitles = false,
}) => {
  const height = {
    xs: 100,
    s: 150,
    m: 200,
    l: 250,
    xl: 300,
  }[size];

  const barSize = {
    xs: 16,
    s: 24,
    m: 32,
    l: 40,
    xl: 48,
  }[size];

  const barColorMap = {
    success: "var(--success-solid-strong)",
    danger: "var(--danger-solid-strong)",
    purple: "#8a63d2",
  };

  const barSolidColor = barColorMap[barColor];

  return (
    <Flex
      fillWidth
      radius={radius}
      border={border}
      align="center"
      direction="column"
      vertical="center"
      background={background}
      className={blur ? styles.blur : undefined}
    >
      <Flex
        borderBottom={border}
        fillWidth
        align="center"
        vertical="center"
        horizontal="center"
      >
        <Heading padding="s">{title}</Heading>
      </Flex>
      <Flex padding="m" fill>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              horizontal={true}
              vertical={false}
              stroke="var(--neutral-border-medium)" // Use neutral border color
            />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={hideXAxisLabels || hideLabels ? false : {
                fill: "var(--neutral-on-background-medium)",
                fontSize: 12,
              }}
              label={
                xAxisTitle && !hideXAxisTitle && !hideAxisTitles
                  ? { value: xAxisTitle, position: 'bottom', offset: -2, fill: "var(--neutral-on-background-medium)" }
                  : undefined
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={hideYAxisLabels || hideLabels ? false : {
                fill: "var(--neutral-on-background-medium)",
                fontSize: 12,
              }}
              width={hideYAxisLabels || hideLabels ? 0 : 30}
              label={
                yAxisTitle && !hideYAxisTitle && !hideAxisTitles
                  ? { value: yAxisTitle, angle: -90, position: 'left', offset: -10, fill: "var(--neutral-on-background-medium)" }
                  : undefined
              }
            />
            <Tooltip
              content={<CustomTooltip tooltipTitle={tooltipTitle} />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              wrapperClassName={styles.tooltipWrapper} // Apply styles to the tooltip wrapper
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                {[
                  { offset: "0%", opacity: 0.8 },
                  { offset: "35%", opacity: 0.6 },
                  { offset: "70%", opacity: 0.3 },
                  { offset: "95%", opacity: 0.1 },
                  { offset: "100%", opacity: 0 },
                ].map(({ offset, opacity }) => (
                  <stop
                    key={offset}
                    offset={offset}
                    stopColor={barSolidColor}
                    stopOpacity={opacity}
                  />
                ))}
              </linearGradient>
            </defs>
            <Bar
              dataKey={yAxisKey}
              fill="url(#barGradient)"
              stroke={barSolidColor}
              strokeWidth={1}
              radius={[6, 6, 0, 0]} // Replace with appropriate numerical values
              barSize={barSize}
            />
          </BarChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};
