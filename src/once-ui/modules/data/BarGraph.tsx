import React from "react";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { SpacingToken } from "../../types";

import styles from "./BarGraph.module.scss";
import { Text, Flex, Heading } from "../../components"; // Import Text component from OnceUI

interface DataPoint {
  name: string;
  value: number;
  startDate: string;
  endDate: string;
  color?: string; // Optional color prop, if needed
}

type BarColor = "success" | "danger" | "purple";

interface BarGraphProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  xAxisKey?: string; // Allows customization of the x-axis data key
  yAxisKey?: string; // Allows customization of the y-axis data key
  barColor?: BarColor; // Prop for bar color
  /**
   * Size of the bar graph.
   * @default "m"
   */
  barWidth?: SpacingToken | "fill" | number | string;
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

  timeFormat?: string; // Format for date display
  isTimeSeries?: boolean; // Flag for time series data
}

const CustomTooltip = ({ active, payload, tooltipTitle, timeFormat, isTimeSeries }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Flex className={styles.tooltip} minWidth={8} background="surface" radius="l" border="neutral-alpha-medium" direction="column">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          horizontal="center"
          padding="8"
        >
          <Text
            style={{ fontWeight: "500" }}
            onBackground="neutral-strong"
          >{isTimeSeries ? moment(data.name).format(timeFormat) : data.name}</Text>
        </Flex>
        <Flex padding="s">
          <Text onBackground="neutral-strong">
            {`${tooltipTitle}: ${data.value.toLocaleString()}`}
          </Text>
        </Flex>
      </Flex>
    );
  }
  return null;
};

const BarGraph: React.FC<BarGraphProps> = ({
  data,
  xAxisKey = "name",
  yAxisKey = "value",
  barColor = "success",
  barWidth = "fill",
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
  timeFormat = "YYYY-MM-DD",
  isTimeSeries = false,
  ...flexProps
}) => {


  const barColorMap = {
    success: "var(--success-solid-strong)",
    danger: "var(--danger-solid-strong)",
    purple: "#8a63d2",
  };

  const barSolidColor = barColorMap[barColor];

  return (
    <Flex
      fill
      fillHeight
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
      <Flex padding={title ? "s" : "2"} fill>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{  left: 10, bottom: 15 }}
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

              tickFormatter = {format => isTimeSeries ? moment(format).format(timeFormat) : format}
              domain = {['auto', 'auto']}
              tick={hideXAxisLabels || hideLabels ? false : {
                fill: "var(--neutral-on-background-weak)",
                fontSize: 12,
              }}
              
              label={
                xAxisTitle && !hideXAxisTitle && !hideAxisTitles
                  ? { value: xAxisTitle, fontWeight: "500", position: 'bottom', offset: 0, fill: "var(--neutral-on-background-medium)" }
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
               width={yAxisTitle ? 40 : 0}
              label={
                yAxisTitle && !hideYAxisTitle && !hideAxisTitles
                  ? { 
                      value: yAxisTitle, 
                      angle: -90, // Rotate the label 90 degrees counter-clockwise
                      position: 'left', 
                      fontWeight: "500",
                      dx: 5, // Move label to the left
                      dy: -20, // Adjust vertical position
                      fill: "var(--neutral-on-background-medium)" 
                    }
                  : undefined
              }
            />
            <Tooltip
              content={<CustomTooltip tooltipTitle={tooltipTitle} xAxisTitle={xAxisTitle} timeFormat={timeFormat}  isTimeSeries={isTimeSeries}/>}
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
              barSize={
              barWidth === "fill"
                ? "100%"
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
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};

BarGraph.displayName = "BarGraph";

export { BarGraph };
export type { BarGraphProps };
