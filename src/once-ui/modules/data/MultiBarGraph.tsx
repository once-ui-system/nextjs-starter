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

import moment from "moment";

import { SpacingToken } from "../../types";


import styles from "./MultiBarGraph.module.scss";
import { Text, Flex, Heading, Column } from "../../components";

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
  description?: string;
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
  timeFormat?: string;

   isTimeSeries?: boolean;
}

const CustomTooltip = ({ active, payload, tooltipTitle, barLabels, isTimeSeries, timeFormat }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Flex className={styles.tooltip} minWidth={8} background="surface" border="neutral-alpha-medium" direction="column">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          horizontal="center"
          padding="8"
        >
            <Text
            variant="label-strong-s"
            style={{ fontWeight: "600" }}
            onBackground="neutral-strong"
            >
            {isTimeSeries ? moment(data.endDate || data.name).format(timeFormat) : (data.endDate?.toLocaleString() || data.name)}
            </Text>
        </Flex>
        <Flex padding="8" gap="4" direction="column">
          {payload.map((entry: any, index: number) => (
            <Text
              variant="label-default-s"
              key={`value-${index}`}
              onBackground="neutral-strong"
              style={{ color: entry.color }}
            >
              {`${isTimeSeries 
              ? (barLabels?.[index] || moment(entry.dataKey).format(timeFormat))
              : (barLabels?.[index] || entry.dataKey)
              }: ${isTimeSeries ? moment(entry.value).format(timeFormat) : entry.value.toLocaleString()}`}
            </Text>
          ))}
        </Flex>
      </Flex>
    );
  }
  return null;
};

const MultiBarGraph: React.FC<MultiBarGraphProps> = ({
  data,
  xAxisKey = "name",
  yAxisKeys = ["value1", "value2", "value3"],
  barWidth = "fill",
  blur = false,
  border,
  title,
  description,
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
  isTimeSeries = false,
  timeFormat,
  ...flexProps
}) => {


  // Using the same colors from LineGraph
  const barColors = ["var(--data-solid-100)", "var(--data-solid-500)", "var(--data-solid-300)"]; // green, red, purple

  return (
    <Flex
      fill
      radius="l"
      border={border}
      align="center"
      direction="column"
      vertical="center"
      data-viz="categorical"
      background={background}
      {...flexProps}
    >

{title && (
  <Column fillWidth borderBottom={border} horizontal="start" paddingX="20"
  paddingY="12"
  gap="4"
>
      {title && (
                <Text variant="heading-strong-m">
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
      <Flex fill>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            barGap={4}
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
                        tick={hideXAxisLabels || hideLabels ? false : {
                          fill: "var(--neutral-on-background-weak)",
                          fontSize: 12,
                        }}

                        height={hideXAxisLabels || hideLabels ? 0 : 50}
                        label={
                          xAxisTitle && !hideXAxisTitle && !hideAxisTitles
                            ? { value: xAxisTitle, fontWeight: "500", position: 'bottom', offset: -23, fill: "var(--neutral-on-background-medium)" }
                            : undefined
                        }
                      />
                      <YAxis
                        allowDataOverflow
                        axisLine={{
                          stroke: "var(--neutral-alpha-medium)",
                        }}
                        tickLine={false}
                        padding={{ top: 40 }}
                        tick={{
                          fill: "var(--neutral-on-background-weak)",
                          fontSize: 12,
                         }}
                        width={yAxisTitle ? 54 : 0}
                        label={
                          yAxisTitle && !hideYAxisTitle && !hideAxisTitles
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
            <Tooltip
              content={
                <CustomTooltip
                  tooltipTitle={tooltipTitle}
                  barLabels={barLabels}
                  isTimeSeries={isTimeSeries}
                  timeFormat={timeFormat}
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

MultiBarGraph.displayName = "MultiBarGraph";

export { MultiBarGraph };
export type { MultiBarGraphProps };