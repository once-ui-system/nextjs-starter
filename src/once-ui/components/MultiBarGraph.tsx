import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { SpacingToken, ColorScheme, ColorWeight } from "../types";


import styles from "./BarGraph.module.scss";
import { Text, Flex, Heading } from ".";

// Data structure supporting multiple values
interface MultiBarDataPoint {
  name: string;
  value1?: number;
  value2?: number;
  value3?: number;
  startDate?: string;
  endDate?: string;
}

interface MultiBarGraphProps extends React.ComponentProps<typeof Flex> {
  data: MultiBarDataPoint[];
  xAxisKey?: string;
  yAxisKeys?: string[]; // Keys for multiple bars
  barLabels?: string[]; // Labels for each bar series
  /**
   * Size of the bar graph.
   * @default "m"
   */
  barWidth?: SpacingToken | "fill" | number | string;
  blur?: boolean;
  title?: string;
  tooltipTitle?: string;
  /**
   * When true, hides labels on the X axis
   * @default false
   */
  hideXAxisLabels?: boolean;
  /**
   * When true, hides labels on the Y axis
   * @default false
   */
  hideYAxisLabels?: boolean;
  /**
   * When true, hides all axis labels
   * @default false
   */
  hideLabels?: boolean;
  /**
   * When true, hides the X axis title
   * @default false
   */
  hideXAxisTitle?: boolean;
  /**
   * When true, hides the Y axis title
   * @default false
   */
  hideYAxisTitle?: boolean;
  /**
   * When true, hides all axis titles
   * @default false
   */
  hideAxisTitles?: boolean;
  /**
   * Title for X-axis
   */
  xAxisTitle?: string;
  /**
   * Title for Y-axis
   */
  yAxisTitle?: string;
  /**
   * When true, hides the Y axis  title
   * @default false
   */
}

const CustomTooltip = ({ active, payload, tooltipTitle, barLabels }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Flex className={styles.tooltip} background="surface" border="neutral-alpha-medium" direction="column">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          horizontal="center"
          padding="8"
        >
          <Text
            variant="body-default-s"
            style={{ fontWeight: "600" }}
            onBackground="neutral-strong"
          >
            {data.startDate && data.endDate
              ? `${data.startDate} - ${data.endDate}`
              : data.name}
          </Text>
        </Flex>
        <Flex padding="s" direction="column">
          {payload.map((entry: any, index: number) => (
            <Text
              key={`value-${index}`}
              variant="body-default-s"
              onBackground="neutral-strong"
              style={{ color: entry.color }}
            >
              {`${barLabels?.[index] || entry.dataKey}: ${entry.value}`}
            </Text>
          ))}
        </Flex>
      </Flex>
    );
  }
  return null;
};

export const MultiBarGraph: React.FC<MultiBarGraphProps> = ({
  data,
  xAxisKey = "name",
  yAxisKeys = ["value1", "value2", "value3"],
  barWidth = "fill",
  blur = false,
  border,
  title,
  radius,
  tooltipTitle,
  barLabels,
  background,
  hideXAxisLabels = false,
  xAxisTitle,
  hideXAxisTitle = false,
  hideYAxisLabels = false,
  yAxisTitle,
  hideYAxisTitle = false,
  hideAxisTitles = false,
  hideLabels = false,
  ...flexProps
}) => {


  // Using the same colors from LineGraph
  const barColors = ["var(--success-solid-strong)", "var(--danger-solid-strong)", "#6c5ce7"]; // green, red, purple

  return (
    <Flex
      fill
      radius={radius}
      border={border}
      align="center"
      direction="column"
      vertical="center"
      background={background}
      className={blur ? styles.blur : undefined}
      {...flexProps}
    >
      {title && (
        <Flex
          borderBottom={border}
          fillWidth
          align="center"
          horizontal="center"
        >
          <Heading padding="s">{title}</Heading>
        </Flex>
      )}
      <Flex padding={title ? "s" : "2"} fill>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            barGap={4} // Small gap between bars in the same group
            barCategoryGap={1} // Control spacing between different groups (x-axis categories)
            >
            <CartesianGrid
              strokeDasharray="2 2"
              horizontal={true}
              vertical={false}
              stroke="var(--neutral-border-medium)"
            />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--neutral-on-background-weak)",
              fontSize: 12,
              }}
              hide={hideLabels || hideXAxisLabels}
              label={
              xAxisTitle && !hideXAxisTitle && !hideAxisTitles
                ? { value: xAxisTitle,               fontWeight: "500",
                  position: 'bottom', offset: -2, fill: "var(--neutral-on-background-medium)" }
                : undefined
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--neutral-on-background-weak)",
              fontSize: 12,
              }}
              width={yAxisTitle ? 40 : 0} // Adjust width based on number of bars
              label={
                yAxisTitle && !hideYAxisTitle && !hideAxisTitles
                  ? { 
                      value: yAxisTitle, 
                      angle: -90, // Rotate the label 90 degrees counter-clockwise
                      position: 'left', 
                      fontWeight: "500",
                      dx: 0, // Move label to the left
                      dy: -20, // Adjust vertical position
                      fill: "var(--neutral-on-background-medium)" 
                    }
                  : undefined
              }
              domain={[0, "auto"]} // Start from 0, auto-scale the upper bound
              allowDataOverflow={false} // Prevent data from exceeding the domain
              hide={hideLabels || hideYAxisLabels}
            />
            <Tooltip
              content={
                <CustomTooltip
                  tooltipTitle={tooltipTitle}
                  barLabels={barLabels}
                />
              }
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              wrapperClassName={styles.tooltipWrapper}
            />

            {/* Define gradients for each bar color */}
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
                  <stop offset="35%" stopColor={color} stopOpacity={0.6} />
                  <stop offset="70%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            {/* Create a Bar component for each data key */}
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
                    ? "98%"
                    : barWidth === "xs"
                    ? 6
                    : barWidth === "s"
                    ? 12
                    : barWidth === "m"
                    ? 20
                    : barWidth === "l"
                    ? 40
                    : barWidth === "xl"
                    ? 50
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
