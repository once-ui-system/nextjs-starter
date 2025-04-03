import React from "react";
import moment from 'moment'
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
import { Flex, Column, Text } from "../../components";

interface DataPoint {
  name: string | number | Date;
  value1: number;
  value2: number;
  value3: number;
  [key: string]: any; // Allow for flexible data structure
}

interface LineGraphProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  xAxisKey?: string;
  yAxisKey1?: string;
  yAxisKey2?: string;
  yAxisKey3?: string;
  /**
   * Size of the line graph.
   * @default "m"
   */
  blur?: boolean;
  title?: string;
  description?: string;
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

  /**
   * Hide Y-axis title when true
   * @default false
   */
  hideYAxisTitle?: boolean;
  /**
   * Hide X-axis title when true
   * @default false
   */
  hideXAxisTitle?: boolean;
  /**
   * Hide both X and Y axis titles when true
   * @default false
   */
  hideAxisTitles?: boolean;
  firstDashed?: boolean,

  secondDashed?: boolean,

 thirdDashed?: boolean,

  allDashed?: boolean,

  fixedYRange?: [number, number]; // [min, max] for y-axis
  
  /**
   * Whether the X axis contains date/time values
   * @default false
   */
  isTimeAxis?: boolean;
  
  /**
  
  /**
   * Format for displaying times in tooltip and axis (when time is present)
   * @default "HH:mm"
   */
  timeFormat?: string;
   
  isTimeSeries?: boolean; // Whether the X axis contains date/time values

  curveType?: "linear" | "monotone" | "monotoneX" | "step" | "natural" ; // Type of curve for the line
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  tooltipTitle?: string;
  key1?: string;
  key2?: string;
  key3?: string;
  yAxisKey1?: string;
  yAxisKey2?: string;
  yAxisKey3?: string;
  xAxisTitle?: string;
  isTimeSeries?: boolean;
  timeFormat?: string;
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
  xAxisTitle = "",
  isTimeSeries = false,
  timeFormat = "MMM dd, yyyy",
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {

      
    return (
      <Flex className={styles.tooltip} background="surface" radius="l" border="neutral-alpha-medium" direction="column">
        <Flex
          minWidth={8}
          borderBottom="neutral-alpha-medium"
          fillWidth
          vertical="center"
          horizontal="center"
          padding="4"
        >
            <p className={styles.label}>
                {tooltipTitle ?? xAxisTitle}: {isTimeSeries ? moment(label).format(timeFormat) : label.toLocaleString()}
            </p>
        </Flex>
        <Flex padding="xs" direction="column" horizontal="center" vertical="center">
            <p className={styles.value} style={{ color: "var(--success-solid-strong)" }}>
            {`${key1}: ${Number(payload[0].value).toLocaleString()}`}
            </p>
            <p className={styles.value} style={{ color: "var(--danger-solid-strong)" }}>
            {`${key2}: ${Number(payload[1].value).toLocaleString()}`}
            </p>
            <p className={styles.value} style={{ color: "#6c5ce7" }}>
            {`${key3}: ${Number(payload[2].value).toLocaleString()}`}
          </p>
        </Flex>
      </Flex>
    );
  }
  return null;
};

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  xAxisKey = "name",
  yAxisKey1 = "value1",
  yAxisKey2 = "value2",
  yAxisKey3 = "value3",
  hideYAxisTitle = false,
  hideAxisTitles = false,
  yAxisTitle,
  xAxisTitle,
  hideXAxisTitle = false,
  blur = false,
  border,
  title,
  description,
  value1,
  value2,
  value3,
  tooltipTitle,
  background,
  firstDashed = false,
  secondDashed = false,
  thirdDashed = false,
  allDashed = false,
  hideXAxisLabels = false,
  hideYAxisLabels = false,
  hideLabels = false,
  fixedYRange,
  isTimeAxis = false,
  timeFormat = "MMM dd, yyyy",
  isTimeSeries = false,
  curveType = "linear",
  ...flexProps
}) => {
  



  return (
    <Flex
      fill
      fillHeight
      radius="l"
      border={border}
      align="center"
      horizontal="center"
      direction="column"
      vertical="center"
      background={background}
      className={blur ? styles.blur : undefined}
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
      <Flex fill className={styles.graph}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
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
                          axisLine={false}
                          tickLine={false}
                          height={hideXAxisLabels || hideLabels ? 0 : 50}
                          tick={hideXAxisLabels || hideLabels ? false : {
                            fill: "var(--neutral-on-background-weak)",
                            fontSize: 12,
                          }}
                          
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
                  key1={value1}
                  key2={value2}
                  key3={value3}
                  yAxisKey1={yAxisKey1}
                  yAxisKey2={yAxisKey2}
                  yAxisKey3={yAxisKey3}
                  xAxisTitle={xAxisTitle}
                  timeFormat={timeFormat}
                  isTimeSeries={isTimeSeries}
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
              type={curveType}
              dataKey={yAxisKey1}
              stroke="#047857"
              strokeWidth={1.5}
              strokeDasharray={allDashed || firstDashed ? "5 5" : "0"}
              fillOpacity={1}
              fill="url(#colorValue1)"
            />
            <Area
              type={curveType}
              dataKey={yAxisKey2}
              strokeDasharray={allDashed || secondDashed ? "5 5" : "0"}
              stroke="#991b1b"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorValue2)"
            />
            <Area
              type={curveType}
              dataKey={yAxisKey3}
              strokeDasharray={allDashed || thirdDashed ? "5 5" : "0"}
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

LineGraph.displayName = "LineGraph";

export { LineGraph };
export type { LineGraphProps };
