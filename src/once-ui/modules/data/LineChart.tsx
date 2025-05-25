"use client";

import React, { useState, useEffect } from "react";
import { isWithinInterval, parseISO } from 'date-fns';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend
} from "recharts";
import { Flex, Column, Row, DateRange, Text } from "../../components";
import { Tooltip, Legend } from "../";
import { ChartHeader } from "./ChartHeader";
import { LinearGradient } from "./Gradient";

interface DataPoint {
  [key: string]: string | number | Date | undefined;
  label?: string;
}

interface SeriesConfig {
  key: string;
  color?: string;
}

interface DateConfig {
  start?: Date;
  end?: Date;
  format?: string;
  onChange?: (range: DateRange) => void;
}

interface LineChartProps extends Omit<React.ComponentProps<typeof Flex>, 'title' | 'description'> {
  data: DataPoint[];
  series: SeriesConfig[];
  colors?: string[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  legend?: boolean;
  tooltip?: string;
  labels?: "x" | "y" | "both";
  curveType?: "linear" | "monotone" | "monotoneX" | "step" | "natural";
  date?: DateConfig;
  emptyState?: React.ReactNode;
}

const defaultColors = ['blue', 'green', 'aqua', 'violet', 'orange', 'red', 'purple', 'magenta', 'moss', 'emerald'];

const LineChart: React.FC<LineChartProps> = ({
  data,
  series,
  colors = defaultColors,
  border = "neutral-medium",
  title,
  description,
  legend = false,
  tooltip,
  labels = "both",
  curveType = "natural",
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

  const seriesKeys = series.map(s => s.key);
  const autoSeries = series || Object.keys(data[0] || {})
    .filter(key => !seriesKeys.includes(key))
    .map((key, index) => ({
      key,
      color: colors[index]
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
      {(title || description || selectedDateRange) && (
        <ChartHeader
          title={title}
          description={description}
          borderBottom={border}
          dateRange={selectedDateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      )}
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
                  color={color || colors[index % colors.length]}
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
                    color: `var(--data-${color || colors[index % colors.length]})`
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
                  left: 8,
                  margin: 0
                }}
              />
            )}
            {(labels === "x" || labels === "both") && (
              <RechartsXAxis
                height={32}
                tickMargin={6}
                tickLine={false}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 11,
                }}
                dataKey={xAxisKey}
                axisLine={{
                  stroke: "var(--neutral-alpha-weak)",
                }}
                tickFormatter={(value) => {
                  const dataPoint = data.find(item => item[xAxisKey] === value);
                  return dataPoint?.label || value;
                }}
              />
            )}
            {(labels === "y" || labels === "both") && (
              <RechartsYAxis
                allowDataOverflow
                axisLine={{
                  stroke: "var(--neutral-alpha-weak)",
                }}
                tickLine={false}
                padding={{ top: 40 }}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 11,
                }}
                width={64}
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
                  tooltip={tooltip}
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
                stroke={`var(--data-${color || colors[index % colors.length]})`}
                fill={`url(#color-${key})`}
                strokeWidth={1}
                fillOpacity={1}
                activeDot={{
                  stroke: "var(--static-transparent)"
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
export type { LineChartProps, DataPoint, SeriesConfig };
