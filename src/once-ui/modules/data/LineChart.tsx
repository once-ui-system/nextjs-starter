"use client";

import React, { useState, useEffect } from "react";
import { isWithinInterval, parseISO } from 'date-fns';
import { styles } from "./config";
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  YAxis as RechartsYAxis,
  XAxis as RechartsXAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend
} from "recharts";
import { Column, Row, DateRange, Text } from "../../components";
import { LinearGradient, ChartHeader, Tooltip, Legend, SeriesConfig, ChartProps } from ".";

interface LineChartProps extends ChartProps {
  curveType?: "linear" | "monotone" | "monotoneX" | "step" | "natural";
}

const defaultColors = ['blue', 'green', 'aqua', 'violet', 'orange', 'red', 'purple', 'magenta', 'moss', 'emerald'];

const LineChart: React.FC<LineChartProps> = ({
  data,
  series,
  border = "neutral-medium",
  title,
  description,
  legend = false,
  labels = "both",
  curveType = "natural",
  date,
  emptyState,
  variant = "gradient",
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

  // Convert series to array if it's a single object
  const seriesArray = Array.isArray(series) ? series : [series];
  const seriesKeys = seriesArray.map((s: SeriesConfig) => s.key);
  const autoSeries = seriesArray.length > 0 ? seriesArray : Object.keys(data[0] || {})
    .filter(key => !seriesKeys.includes(key))
    .map((key, index) => ({
      key,
      color: defaultColors[index]
    }));

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
            <RechartsAreaChart
              data={filteredData}
              margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            >
            <defs>
              {autoSeries.map(({ key, color }, index) => (
                <LinearGradient
                  key={key}
                  id={`color-${key}`}
                  variant={variant}
                  color={color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </defs>
            <RechartsCartesianGrid
              vertical
              horizontal
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <RechartsLegend
                content={(props) => {
                  const customPayload = autoSeries.map(({ key, color }, index) => ({
                    value: key,
                    color: `var(--data-${color || defaultColors[index % defaultColors.length]})`
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
                  left: 0,
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
                  isTimeSeries={selectedDateRange !== undefined}
                  timeFormat={date?.format}
                  {...props}
                />
              }
            />
            {autoSeries.map(({ key, color }, index) => (
              <RechartsArea
                key={key}
                type={curveType}
                dataKey={key}
                name={key}
                stroke={`var(--data-${color || defaultColors[index % defaultColors.length]})`}
                fill={`url(#color-${key})`}
                activeDot={{
                  r: 4,
                  fill: `var(--data-${color || defaultColors[index % defaultColors.length]})`,
                  stroke: "var(--background)",
                  strokeWidth: 0,
                }}
              />
            ))}
            </RechartsAreaChart>
          </RechartsResponsiveContainer>
        )}
      </Row>
    </Column>
  );
};

LineChart.displayName = "LineChart";

export { LineChart };
export type { LineChartProps };
