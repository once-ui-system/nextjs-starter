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
import { Column, Row, DateRange, Text } from "../../components";
import { ChartHeader, LinearGradient, ChartProps, Tooltip, Legend, ChartStyles } from ".";
import { styles } from "../../../app/resources/data.config";

interface BarChartProps extends ChartProps {
  xAxisKey?: string;
  yAxisKey?: string;
  barWidth?: TShirtSizes | "fill";
  emptyState?: React.ReactNode;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  variant = styles.variant,
  xAxisKey = "date",
  yAxisKey,
  barWidth = "fill",
  border = "neutral-medium",
  series,
  legend = false,
  title,
  description,
  labels = "both",
  date,
  emptyState,
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

  const seriesConfig = series ? (Array.isArray(series) ? series[0] : series) : { key: "Revenue", color: "blue" };
  const seriesKey = seriesConfig.key || "Revenue";
  const seriesColor = seriesConfig.color || "blue";
  const barColor = `var(--data-${seriesColor})`;
  
  const effectiveYAxisKey = seriesKey;

  const filteredData = React.useMemo(() => {
    if (!selectedDateRange || !data || data.length === 0 || !data[0]?.[xAxisKey]) {
      return data;
    }

    return data.filter(item => {
      try {
        if (!item[xAxisKey] || !selectedDateRange.startDate || !selectedDateRange.endDate) {
          return true;
        }
        const itemDate = new Date(item[xAxisKey] as string);
        return itemDate >= selectedDateRange.startDate && 
               itemDate <= selectedDateRange.endDate;
      } catch (e) {
        // If we can't parse the date, include the item
        return true;
      }
    });
  }, [data, selectedDateRange, xAxisKey]);

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
        {!filteredData || filteredData.length === 0 ? (
          <Column fill center>
            {emptyState ? emptyState : (
              <Text variant="label-default-s" onBackground="neutral-weak">
                No data available for the selected period
              </Text>
            )}
          </Column>
        ) : (
          <RechartsResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={filteredData}
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
                    color: barColor
                  }];
                  
                  return (
                    <Legend 
                      position="top" 
                      payload={customPayload}
                      labels={labels} 
                      variant={variant as ChartStyles}
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
                height={32}
                tickMargin={6}
                dataKey={xAxisKey}
                axisLine={{
                  stroke: styles.axisLine.stroke,
                }}
                tickLine={styles.tickLine}
                tick={{
                  fill: styles.tick.fill,
                  fontSize: styles.tick.fontSize,
                }}
                tickFormatter={(value) => {
                  const dataPoint = data.find(item => item[xAxisKey] === value);
                  return dataPoint?.label || value;
                }}
              />
            )}
            {(labels === "y" || labels === "both") && (
              <RechartsYAxis
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
                  isTimeSeries={selectedDateRange !== undefined}
                  timeFormat={date?.format}
                  showColors={false}
                  variant={variant as ChartStyles}
                  {...props}
                />
              }
            />
            <defs>
              <LinearGradient 
                key={`gradient-${seriesColor}`}
                id={`barGradient${seriesColor}`}
                variant={variant as "gradient" | "flat" | "outline"}
                color={barColor}
              />
            </defs>
            <RechartsBar
              dataKey={effectiveYAxisKey}
              fill={`url(#barGradient${seriesColor})`}
              stroke={barColor}
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
              radius={(barWidth === "fill" || barWidth === "xl") ? [10, 10, 10, 10] : [6, 6, 6, 6]}
            />
          </RechartsBarChart>
        </RechartsResponsiveContainer>
        )}
      </Row>
    </Column>
  );
};

BarChart.displayName = "BarChart";

export { BarChart };
export type { BarChartProps };
