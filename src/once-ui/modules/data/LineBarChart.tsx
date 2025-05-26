"use client";

import React, { useState, useEffect } from "react";
import { isWithinInterval, parseISO } from 'date-fns';
import {
  ComposedChart as RechartsComposedChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend,
  Area as RechartsArea
} from "recharts";
import { Column, Row, DateRange } from "../../components";
import { TShirtSizes } from "../../types";
import { LinearGradient, ChartHeader, Tooltip, Legend, ChartStatus, ChartProps, SeriesConfig, ChartStyles } from ".";
import { styles } from "@/app/resources/data.config";

interface LineBarChartProps extends ChartProps {
  barWidth?: TShirtSizes | "fill" | number;
  curveType?: "linear" | "monotone" | "monotoneX" | "step" | "natural";
}

const LineBarChart: React.FC<LineBarChartProps> = ({
  data,
  series,
  border = "neutral-medium",
  title,
  description,
  legend = false,
  labels = "both",
  date,
  emptyState,
  variant = styles.variant,
  loading = false,
  barWidth = "fill",
  curveType = "monotone",
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

  const allSeriesArray = Array.isArray(series) ? series : (series ? [series] : []);
  const seriesKeys = allSeriesArray.map((s: SeriesConfig) => s.key);
  
  const xAxisKey = Object.keys(data[0] || {}).find(key => 
    !seriesKeys.includes(key)
  ) || 'name';

  const filteredData = React.useMemo(() => {
    if (selectedDateRange?.startDate && selectedDateRange?.endDate && xAxisKey) {
      const startDate = selectedDateRange.startDate;
      const endDate = selectedDateRange.endDate;
      
      if (startDate instanceof Date && endDate instanceof Date) {
        return data.filter(item => {
          try {
            const itemDateValue = item[xAxisKey];
            if (!itemDateValue) return false;
            
            const itemDate = typeof itemDateValue === 'string' 
              ? parseISO(itemDateValue) 
              : itemDateValue as Date;
            
            return isWithinInterval(itemDate, {
              start: startDate,
              end: endDate
            });
          } catch (error) {
            return false;
          }
        });
      }
    }
    return data;
  }, [data, selectedDateRange, xAxisKey]);

  const handleDateRangeChange = (newRange: DateRange) => {
    setSelectedDateRange(newRange);
    if (date?.onChange) {
      date.onChange(newRange);
    }
  };

  // Configure line and bar series
  const chartSeriesArray = Array.isArray(series) ? series : (series ? [series] : []);
  if (chartSeriesArray.length < 2) {
    console.warn('LineBarChart requires at least 2 series (one for line, one for bar)');
  }
  
  // First series is for the line, second is for the bar
  const lineSeries = chartSeriesArray[0] || { key: 'value1', color: 'blue' };
  const barSeries = chartSeriesArray[1] || { key: 'value2', color: 'green' };
  
  // Get colors from series config
  const lineColor = lineSeries.color || 'blue';
  const barColor = barSeries.color || 'green';
  
  // Format colors for CSS variables
  const finalLineColor = `var(--data-${lineColor})`;
  const finalBarColor = `var(--data-${barColor})`;
  
  // Create gradient IDs using consistent naming convention with other chart components
  const lineGradientId = `color-${lineSeries.key}`;
  const barGradientId = `barGradient${barSeries.key}`;

  return (
    <Column
      fillWidth
      radius="l"
      border={border}
      data-viz="categorical"
      height={24}
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
        <ChartStatus 
          loading={loading}
          isEmpty={!filteredData || filteredData.length === 0}
          emptyState={emptyState}
        />
        {!loading && filteredData && filteredData.length > 0 && (
          <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsComposedChart
            data={filteredData}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            barGap={4}
          >
            <defs>
              <LinearGradient
                id={barGradientId}
                color={finalBarColor}
                variant={variant as ChartStyles}
              />
              
              <LinearGradient
                id={lineGradientId}
                color={finalLineColor}
                variant={variant as ChartStyles}
              />
            </defs>
            <RechartsCartesianGrid
              horizontal
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <RechartsLegend
                content={
                  <Legend 
                    variant={variant as ChartStyles}
                    colors={[finalBarColor, finalLineColor]}
                    labels={labels}
                    position="top" 
                  />
                }
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
              cursor={{
                stroke: "var(--neutral-border-strong)",
                strokeWidth: 1,
              }}
              content={props =>
                <Tooltip
                  variant={variant as ChartStyles}
                  isTimeSeries={selectedDateRange !== undefined}
                  timeFormat={date?.format}
                  dataKey={xAxisKey}
                  {...props}
                />
              }
            />
            <RechartsArea
              type={curveType}
              dataKey={lineSeries.key}
              name={lineSeries.key}
              stroke={finalLineColor}
              fill={`url(#color-${lineSeries.key})`}
              activeDot={{
                r: 4,
                fill: finalLineColor,
                stroke: "var(--background)",
                strokeWidth: 0
              }}
            />
            <RechartsBar
              dataKey={barSeries.key}
              name={barSeries.key}
              fill={`url(#${barGradientId})`}
              stroke={finalBarColor}
              strokeWidth={1}
              radius={[4, 4, 4, 4]}
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
          </RechartsComposedChart>
        </RechartsResponsiveContainer>
        )}
      </Row>
    </Column>
  );
};

LineBarChart.displayName = "LineBarChart";

export { LineBarChart };
export type { LineBarChartProps };