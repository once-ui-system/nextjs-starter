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

import {
  GridProps,
  SpacingProps,
  SizeProps,
  StyleProps,
  CommonProps,
  DisplayProps,
  ConditionalProps,
} from "../interfaces";

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
  size?: "xs" | "s" | "m" | "l" | "xl";
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
}

const CustomTooltip = ({ active, payload, tooltipTitle, barLabels }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Flex className={styles.tooltip} direction="column">
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
  size = "m",
  blur = false,
  border,
  title,
  radius,
  tooltipTitle,
  barLabels,
  background,
  hideXAxisLabels = false,
  hideYAxisLabels = false,
  hideLabels = false,
  ...flexProps
}) => {
  const height = {
    xs: 100,
    s: 150,
    m: 250,
    l: 275,
    xl: 300,
  }[size];

  const barSize = {
    xs: 32,
    s: 32,
    m: 32,
    l: 32,
    xl: 32,
  }[size];

  // Using the same colors from LineGraph
  const barColors = ["var(--success-solid-strong)", "var(--danger-solid-strong)", "#6c5ce7"]; // green, red, purple

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
      <Flex padding="m" fill>
        <ResponsiveContainer width="100%" height={height}>
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
                fill: "var(--neutral-on-background-medium)",
                fontSize: 12,
              }}
              hide={hideLabels || hideXAxisLabels}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--neutral-on-background-medium)",
                fontSize: 12,
              }}
              width={30}
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
                barSize={barSize}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};
