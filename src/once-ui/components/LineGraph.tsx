import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import styles from "./LineGraph.module.scss";
import { Flex, Heading } from ".";

interface DataPoint {
  name: string;
  value1: number;
  value2: number;
  value3: number;
}

interface LineGraphProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  xAxisKey?: string;
  yAxisKey1?: string;
  yAxisKey2?: string;
  yAxisKey3?: string;
  /**
   * Size of the line graph.
   * @default "m"
   */
  size?: "xs" | "s" | "m" | "l" | "xl";
  blur?: boolean;
  title?: string;
  tooltipTitle?: string;
  value1?: string;
  value2?: string;
  value3?: string;
  /**
   * Hide X-axis labels when true
   * @default false
   */
  hideXAxisLabels?: boolean;
  /**
   * Hide Y-axis labels when true
   * @default false
   */
  hideYAxisLabels?: boolean;
  /**
   * Hide both X and Y axis labels when true
   * @default false
   */
  hideLabels?: boolean;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  tooltipTitle?: string;
  key1?: string;
  key2?: string;
  key3?: string;
  yAxisKey1?: string;
  yAxisKey2?: string;
  yAxisKey3?: string;
}

const CustomTooltip = ({
  active,
  payload,
  tooltipTitle,
  label,
  key1,
  key2,
  key3,
  yAxisKey1 = "value1",
  yAxisKey2 = "value2",
  yAxisKey3 = "value3",
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Flex className={styles.tooltip} direction="column">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          vertical="center"
          horizontal="center"
          padding="4"
        >
          <p className={styles.label}>{`${tooltipTitle}`}</p>
        </Flex>
        <Flex padding="xs" direction="column" vertical="center">
          <p className={styles.value} style={{ color: "#047857" }}>
            {`${key1}: ${payload[0].value}`}
          </p>
          <p className={styles.value} style={{ color: "#991b1b" }}>
            {`${key2}: ${payload[1].value}`}
          </p>
          <p className={styles.value} style={{ color: "#6c5ce7" }}>
            {`${key3}: ${payload[2].value}`}
          </p>
        </Flex>
      </Flex>
    );
  }
  return null;
};

export const LineGraph: React.FC<LineGraphProps> = ({
  data,
  xAxisKey = "name",
  yAxisKey1 = "value1",
  yAxisKey2 = "value2",
  yAxisKey3 = "value3",
  size = "m",
  blur = false,
  border,
  title,
  value1,
  value2,
  value3,
  tooltipTitle,
  radius,
  background,
  hideXAxisLabels = false,
  hideYAxisLabels = false,
  hideLabels = false,
  ...flexProps
}) => {
  const height = {
    xs: 100,
    s: 150,
    m: 200,
    l: 250,
    xl: 300,
  }[size];

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
      <Flex
        borderBottom={border}
        fillWidth
        align="center"
        vertical="center"
        horizontal="center"
      >
        <Heading padding="s">{title}</Heading>
      </Flex>
      <Flex fill padding="m">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="25%" stopColor="var(--success-solid-strong)" stopOpacity={0.5} />
                <stop offset="40%" stopColor="var(--success-solid-strong)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--success-solid-strong)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="25%" stopColor="var(--danger-solid-strong)" stopOpacity={0.5} />
                <stop offset="40%" stopColor="var(--danger-solid-strong)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--danger-solid-strong)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorValue3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="25%" stopColor="#6c5ce7" stopOpacity={0.5} />
                <stop offset="40%" stopColor="#6c5ce7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 2"
              vertical={true}
              stroke="var(--neutral-background-strong)"
              horizontal={true}
            />
            <XAxis
              dataKey={xAxisKey}
              stroke="var(--neutral-background-medium)"
              tick={{
                fill: "var(--neutral-on-background-medium)",
                fontSize: 11,
                fontWeight: "bold",
              }}
              axisLine={false}
              tickLine={false}
              hide={hideXAxisLabels || hideLabels}
            />
            <YAxis
              stroke="var(--neutral-background-strong)"
              tick={{
                fill: "var(--neutral-on-background-medium)",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
              hide={hideYAxisLabels || hideLabels}
            />
            <Tooltip
              content={
                <CustomTooltip
                  tooltipTitle={tooltipTitle}
                  key1={value1}
                  key2={value2}
                  key3={value3}
                  yAxisKey1={yAxisKey1}
                  yAxisKey2={yAxisKey2}
                  yAxisKey3={yAxisKey3}
                />
              }
              contentStyle={{
                backgroundColor: "#0f0f13",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "4px",
                color: "rgba(255,255,255,0.7)",
              }}
            />
            <Area
              type="linear"
              dataKey={yAxisKey1}
              stroke="#047857"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorValue1)"
            />
            <Area
              type="linear"
              dataKey={yAxisKey2}
              stroke="#991b1b"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorValue2)"
            />
            <Area
              type="linear"
              dataKey={yAxisKey3}
              stroke="#6c5ce7"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorValue3)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};
