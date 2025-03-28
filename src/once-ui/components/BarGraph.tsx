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
}

const CustomTooltip = ({ active, payload, tooltipTitle }: any) => {
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
      style={{height: "100%"}}
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
              tick={hideXAxisLabels || hideLabels ? false : {
                fill: "var(--neutral-on-background-medium)",
                fontSize: 12,
              }}
              
              label={
                xAxisTitle && !hideXAxisTitle && !hideAxisTitles
                  ? { value: xAxisTitle, position: 'bottom', offset: 0, fill: "var(--neutral-on-background-medium)" }
                  : undefined
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--neutral-on-background-medium)",
                fontSize: 12,
               }}
               width={yAxisTitle ? 40 : 0}
              label={
                yAxisTitle && !hideYAxisTitle && !hideAxisTitles
                  ? { 
                      value: yAxisTitle, 
                      angle: -90, // Rotate the label 90 degrees counter-clockwise
                      position: 'left', 
                      dx: 5, // Move label to the left
                      dy: -20, // Adjust vertical position
                      fill: "var(--neutral-on-background-medium)" 
                    }
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
