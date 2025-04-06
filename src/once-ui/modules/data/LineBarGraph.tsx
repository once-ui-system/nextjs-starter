import React from "react";
import moment from "moment";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from "recharts";
import { Flex, Column, Text } from "../../components";
import { SpacingToken } from "../../types";


interface DataPoint {
  name: string;
  lineValue: number;
  barValue: number;
  [key: string]: any; // Allow for additional properties
}

interface LineBarGraphProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  xAxisKey?: string;
  lineDataKey?: string;
  barDataKey?: string;
  lineName?: string;
  barName?: string;
  /**
   * Size of the graph.
   * @default "m"
   */
  barWidth?: SpacingToken | "fill" | number | string;
  blur?: boolean;
  title?: string;
  lineColor?: string;
  lineColorVariant?: "info" | "success" | "danger" | "purple"; // Add color variant prop
  barColor?: string;
  /**
   * Show area under the line
   * @default true
   */
  showArea?: boolean;
  /**
   * Hide X-axis labels when true
   * @default false
   */
  hideXAxisLabels?: boolean;

  dashedLine?: boolean;
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
   * Title for X-axis
   */
  xAxisTitle?: string;
  /**
   * Title for Y-axis
   */
  yAxisTitle?: string;
  /**
   * Hide X-axis title
   * @default false
   */
  hideXAxisTitle?: boolean;
  /**
   * Hide Y-axis title
   * @default false
   */
  hideYAxisTitle?: boolean;
  /**
   * Hide both X and Y axis titles
   * @default false
   */
  hideAxisTitles?: boolean;
  /**
   * Hide legend
   * @default false
   */
  showLegend?: boolean;

  timeFormat?: string; // Format for date display

  isTimeSeries?: boolean; // Whether the X axis contains date/time values

  curveType?: "linear" | "monotone" | "monotoneX" | "step" | "natural" ; // Type of curve for the line

  description?: string;
}


const CustomTooltip = ({ active, payload, label, isTimeSeries, timeFormat }: any) => {
  if (active && payload && payload.length) {
    return (
      <Flex minWidth={8} background="surface" border="neutral-alpha-medium" direction="column">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          horizontal="center"
          padding="8"
        >
          <Text variant="label-strong-s">{isTimeSeries ? moment(label).format(timeFormat) : label.toLocaleString()}</Text>
        </Flex>
        <Flex padding="8" direction="column">
          {payload.map((entry: any, index: number) => (
            <Text
             variant="label-default-s"
              key={`item-${index}`}
              style={{ color: entry.color }}
            >
              {`${entry.name.toLocaleString()}: ${entry.value.toLocaleString()}`}
            </Text>
          ))}
        </Flex>
      </Flex>
    );
  }
  return null;
};

const LineBarGraph: React.FC<LineBarGraphProps> = ({
  data,
  xAxisKey = "name",
  lineDataKey = "lineValue",
  barDataKey = "barValue",
  lineName = "Line",
  barName = "Bar",
  barWidth = "fill",
  blur = false,
  dashedLine = false,
  border,
  title,
  description,
  lineColorVariant = "info", // Options: "info", "success", "danger", "purple"
  background,
  showArea = true,
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
  showLegend = false,
  curveType = "monotone", // Default curve type
  ...flexProps
}) => {
 

  // Generate a unique ID for each gradient
  const lineGradientId = `colorLine-${Math.random().toString(36).substring(2, 9)}`;
  const barGradientId = `barGradient-${Math.random().toString(36).substring(2, 9)}`;

  const colorMap = {
    info: "var(--info-solid-strong)",
    success: "var(--success-solid-strong)",
    danger: "var(--danger-solid-strong)",
    purple: "#6c5ce7"
  };

  // Use the variant to determine the color
  const finalLineColor = lineColorVariant ? colorMap[lineColorVariant] : "var(--info-solid-strong)";

  return (
    <Flex
    direction="column"
    fillHeight
    fillWidth
    height={24}
    border={border}
    radius="l"
    data-viz="categorical"
      {...flexProps}
    >
      {title && (
  <Column fillWidth borderBottom={border} horizontal="start" paddingX="20"
  paddingY="12"
  gap="4"
>
      {(title || description) && (
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
      <Flex fill>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            barGap={4}
          >
            <defs>
              {/* Bar gradient */}
              <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
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
                    stopColor="var(--data-solid-100)"
                    stopOpacity={opacity}
                  />
                ))}
              </linearGradient>
              
              {/* Line gradient - similar to LineGraph component */}
              <linearGradient id={lineGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="25%" stopColor={finalLineColor} stopOpacity={0.5} />
                <stop offset="40%" stopColor={finalLineColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={finalLineColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
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
              content={<CustomTooltip isTimeSeries={isTimeSeries} timeFormat={timeFormat} />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            {showLegend && (
              <Legend
                verticalAlign="top"
                wrapperStyle={{ paddingBottom: 10 }}
              />
            )}
            <Bar
              dataKey={barDataKey}
              name={barName}
              fill={`url(#${barGradientId})`}
              stroke="var(--data-solid-100)"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
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
            />
            
            {showArea ? (
              <Area
                type={curveType}
                dataKey={lineDataKey}
                name={lineName}
                stroke={finalLineColor}
                strokeDasharray={dashedLine ? "5 5" : "0"}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${lineGradientId})`}
                dot={{ r: 4, fill: finalLineColor }}
                activeDot={{ r: 6, fill: finalLineColor }}
              />
            ) : (
              <Line
                type="monotone"
                dataKey={lineDataKey}
                name={lineName}
                stroke={finalLineColor}
                strokeWidth={2}
                dot={{ r: 4, fill: finalLineColor }}
                activeDot={{ r: 6, fill: finalLineColor }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};

LineBarGraph.displayName = "LineBarGraph";

export { LineBarGraph };
export type { LineBarGraphProps };