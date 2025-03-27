import React from "react";
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
import styles from "./LineBarGraph.module.scss";
import { Flex, Heading } from ".";

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
  size?: "xs" | "s" | "m" | "l" | "xl";
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
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Flex className={styles.tooltip} direction="column">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          horizontal="center"
          padding="8"
        >
          <p className={styles.label}>{label}</p>
        </Flex>
        <Flex padding="s" direction="column">
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className={styles.value}
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </Flex>
      </Flex>
    );
  }
  return null;
};

export const LineBarGraph: React.FC<LineBarGraphProps> = ({
  data,
  xAxisKey = "name",
  lineDataKey = "lineValue",
  barDataKey = "barValue",
  lineName = "Line",
  barName = "Bar",
  size = "m",
  blur = false,
  border,
  title,
  lineColorVariant = "info", // Options: "info", "success", "danger", "purple"
  barColor = "var(--success-solid-strong)",
  radius,
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
  showLegend = false,
  ...flexProps
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
      fillWidth
      radius={radius}
      border={border}
      align="center"
      direction="column"
      horizontal="center"
      background={background}
      className={blur ? styles.blur : undefined}
      {...flexProps}
    >
      {title && (
        <Flex
          borderBottom={border}
          fillWidth
          align="center"
          vertical="center"
          horizontal="center"
        >
          <Heading padding="s">{title}</Heading>
        </Flex>
      )}
      <Flex padding="m" fill>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
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
                    stopColor={barColor}
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
                fill: "var(--neutral-on-background-medium)",
                fontSize: 12,
              }}
              label={
                xAxisTitle && !hideXAxisTitle && !hideAxisTitles
                  ? { value: xAxisTitle, position: 'bottom', offset: 0, fill: "var(--neutral-on-background-medium)" }
                  : undefined
              }
              // Make sure to always show the grid even if labels are hidden
              hide={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={hideYAxisLabels || hideLabels ? 0 : 30}
              label={
                yAxisTitle && !hideYAxisTitle && !hideAxisTitles
                  ? { value: yAxisTitle, angle: -90, position: 'left', offset: -5, fill: "var(--neutral-on-background-medium)" }
                  : undefined
              }
              // Make sure to always show the grid even if labels are hidden
              hide={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              wrapperClassName={styles.tooltipWrapper}
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
              stroke={barColor}
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
              barSize={barSize}
            />
            
            {showArea ? (
              <Area
                type="monotone"
                dataKey={lineDataKey}
                name={lineName}
                stroke={finalLineColor}
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