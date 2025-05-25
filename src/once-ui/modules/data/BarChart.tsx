"use client";

import React, { useState, useEffect } from "react";
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

import { TShirtSizes } from "../../types";
import { Column, Row, DateRange } from "../../components";
import { ChartHeader, LinearGradient, ChartProps, Tooltip, Legend } from ".";
import { styles } from "./config";

interface BarChartProps extends ChartProps {
  xAxisKey?: string;
  yAxisKey?: string;
  barWidth?: TShirtSizes | "fill";
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  variant = "gradient",
  xAxisKey = "name",
  yAxisKey = "value",
  barWidth = "fill",
  border = "neutral-medium",
  series,
  legend = false,
  title,
  description,
  labels = "both",
  date,
  ...flex
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(
    date?.start && date?.end ? {
      startDate: date.start,
      endDate: date.end
    } : undefined
  );

  useEffect(() => {
    if (date?.start && date?.end) {
      setSelectedDateRange({
        startDate: date.start,
        endDate: date.end
      });
    }
  }, [date?.start, date?.end]);

  const handleDateRangeChange = (newRange: DateRange) => {
    setSelectedDateRange(newRange);
    if (date?.onChange) {
      date.onChange(newRange);
    }
  };

  const seriesConfig = series ? (Array.isArray(series) ? series[0] : series) : { key: yAxisKey, color: "blue" };
  const seriesKey = seriesConfig.key || yAxisKey;
  const seriesColor = seriesConfig.color || "blue";
  return (
    <Column
      fillWidth
      height={24}
      border={border}
      radius="l"
      data-viz="categorical"
      {...flex}
    >
      <ChartHeader
        title={title}
        description={description}
        borderBottom={border}
        dateRange={selectedDateRange}
        date={date}
        onDateRangeChange={handleDateRangeChange}
        presets={date?.presets}
      />
      <Row fill>
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ left: 0, right: 0, bottom: 0 }}
          >
            <RechartsCartesianGrid
              horizontal={true}
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <RechartsLegend
                content={(props) => {
                  const customPayload = [{
                    value: seriesKey,
                    color: `var(--data-${seriesColor})`
                  }];
                  
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
                axisLine={{
                  stroke: "var(--neutral-alpha-weak)",
                }}
                tickLine={false}
                height={32}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 12,
                }}
              />
            )}
            {(labels === "y" || labels === "both") && (
              <RechartsYAxis
                dataKey={yAxisKey}
                width={64}
                padding={{ top: 40 }}
                allowDataOverflow
                tickLine={styles.tickLine}
                tick={{
                  fill: styles.tick.fill,
                  fontSize: styles.tick.fontSize,
                }}
                axisLine={{
                  stroke: styles.axisLine.stroke,
                }}
              />
            )}
            <RechartsTooltip
              cursor={{ fill: "var(--neutral-alpha-weak)" }}
              content={props => 
                <Tooltip
                  {...props}
                  tooltip={seriesKey}
                  showColors={false}
                />
              }
            />
            <defs>
              <LinearGradient 
                id="barGradient"
                variant={variant}
                color={seriesColor}
              />
            </defs>
            <RechartsBar
              dataKey={yAxisKey}
              fill="url(#barGradient)"
              stroke={`var(--data-${seriesColor})`}
              strokeWidth={1}
              barSize={
                typeof barWidth === "string" && barWidth === "fill"
                  ? "100%"
                  : typeof barWidth === "string" && barWidth === "xs"
                  ? 12
                  : typeof barWidth === "string" && barWidth === "s"
                  ? 16
                  : typeof barWidth === "string" && barWidth === "m"
                  ? 24
                  : typeof barWidth === "string" && barWidth === "l"
                  ? 40
                  : typeof barWidth === "string" && barWidth === "xl"
                  ? 64
                  : barWidth
              }
              radius={[4, 4, 4, 4]}
            />
          </RechartsBarChart>
        </RechartsResponsiveContainer>
      </Row>
    </Column>
  );
};

BarChart.displayName = "BarChart";

export { BarChart };
export type { BarChartProps };
