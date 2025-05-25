"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  ResponsiveContainer as RechartsResponsiveContainer,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from "recharts";

import { schemes, SpacingToken } from "../../types";
import { Text, Column, Row } from "../../components";
import { ChartProps, SeriesConfig, LinearGradient, Tooltip, Legend } from ".";
import { styles } from "./config";

interface MultiBarDataPoint {
  name: string;
  value1?: number;
  value2?: number;
  value3?: number;
  startDate?: string;
  endDate?: string;
}

interface BarProps {
  width?: SpacingToken | "fill" | number;
}

interface TimeProps {
  series?: boolean;
  format?: string;
}

interface GroupedBarChartProps extends ChartProps {
  xAxisKey?: string;
  bar?: BarProps;
  time?: TimeProps;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  data,
  labels = "both",
  xAxisKey = "name",
  series,
  bar = { width: "l" },
  time = { series: false, format: "" },
  title,
  description,
  legend = false,
  variant = "gradient",
  border = "neutral-medium",
  ...flex
}) => {
  const seriesArray = Array.isArray(series) ? series : (series ? [series] : []);

  const coloredSeriesArray = seriesArray.map((s, index) => ({
    ...s,
    color: s.color || schemes[index % schemes.length]
  }));
  
  const autoSeries = seriesArray.length > 0 ? coloredSeriesArray : 
    Object.keys(data[0] || {})
      .filter(key => key !== xAxisKey)
      .map((key, index) => ({
        key,
        color: schemes[index % schemes.length]
      }));
  
  const barColors = autoSeries.map(s => `var(--data-${s.color})`);

  return (
    <Column
      fillWidth
      height={24}
      border={border}
      radius="l"
      data-viz="categorical"
      {...flex}
    >
      {(title || description) && (
        <Column
          fillWidth
          borderBottom={border}
          paddingX="20"
          paddingY="12"
          gap="4"
        >
          {title && (
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
      <Row fill>
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            barGap={4}
          >
            <RechartsCartesianGrid
              horizontal
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <RechartsLegend
                content={props => {
                  const customPayload = autoSeries.map((series, index) => ({
                    value: series.key,
                    color: barColors[index]
                  }));
                  
                  return (
                    <Legend 
                      payload={customPayload}
                      labels={labels} 
                      position="top" 
                    />
                  );
                }}
                wrapperStyle={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  margin: 0
                }}
              />
            )}
            {(labels === "x" || labels === "both") && (
              <RechartsXAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: styles.tick.fill,
                  fontSize: styles.tick.fontSize,
                }}
              />
            )}
            {(labels === "y" || labels === "both") && (
              <RechartsYAxis
                allowDataOverflow
                axisLine={{
                  stroke: styles.axisLine.stroke,
                }}
                tickLine={false}
                padding={{ top: 40 }}
                tick={{
                  fill: styles.tick.fill,
                  fontSize: styles.tick.fontSize,
                }}
                width={64}
              />
            )}
            <RechartsTooltip
              cursor={{ fill: "var(--neutral-alpha-weak)" }}
              content={props => 
                <Tooltip
                  showColors
                  isTimeSeries={time.series}
                  timeFormat={time.format}
                  {...props}
                />
              }
            />
            <defs>
              {barColors.map((color, index) => (
                <LinearGradient
                  key={`gradient-${index}`}
                  id={`barGradient${index}`}
                  color={color}
                  variant={variant}
                />
              ))}
            </defs>
            {autoSeries.map((series, index) => (
              <RechartsBar
                key={series.key}
                dataKey={series.key}
                name={series.key}
                fill={`url(#barGradient${index})`}
                stroke={barColors[index]}
                strokeWidth={1}
                barSize={
                  typeof bar.width === "string" && bar.width === "fill"
                    ? "100%"
                    : typeof bar.width === "string" && bar.width === "xs"
                    ? 12
                    : typeof bar.width === "string" && bar.width === "s"
                    ? 16
                    : typeof bar.width === "string" && bar.width === "m"
                    ? 24
                    : typeof bar.width === "string" && bar.width === "l"
                    ? 40
                    : typeof bar.width === "string" && bar.width === "xl"
                    ? 64
                    : bar.width
                }
                radius={(bar.width === "fill" || bar.width === "xl") ? [10, 10, 10, 10] : [6, 6, 6, 6]}
              />
            ))}
          </RechartsBarChart>
        </RechartsResponsiveContainer>
      </Row>
    </Column>
  );
};

GroupedBarChart.displayName = "GroupedBarChart";

export { GroupedBarChart };
export type { GroupedBarChartProps };