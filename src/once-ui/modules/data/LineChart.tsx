"use client";

import React, { useState, useEffect } from "react";
import moment from 'moment'
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
import { Flex, Column, Text, Row, DateRange, DateRangePicker, DropdownWrapper, IconButton } from "../../components";
import { Tooltip, Legend } from "../";

interface DataPoint {
  [key: string]: string | number | Date;
}

interface SeriesConfig {
  key: string;
  color?: string;
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
  isTimeSeries?: boolean;
  timeFormat?: string;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
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
  isTimeSeries = false,
  timeFormat,
  dateRange: initialDateRange,
  onDateRangeChange,
  ...flex
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(initialDateRange);
  const [showDateRangeSelectorUI, setShowDateRangeSelectorUI] = useState(false);

  useEffect(() => {
    setSelectedDateRange(initialDateRange);
  }, [initialDateRange]);

  // Auto-detect series from first data point if not provided
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
    if (isTimeSeries && selectedDateRange?.startDate && selectedDateRange?.endDate && xAxisKey) {
      return data.filter(item => {
        const itemDate = moment(item[xAxisKey] as string | Date);
        return itemDate.isBetween(selectedDateRange.startDate, selectedDateRange.endDate, undefined, '[]');
      });
    }
    return data;
  }, [data, selectedDateRange, isTimeSeries, xAxisKey]);

  const handleDateRangeChange = (newRange: DateRange) => {
    setSelectedDateRange(newRange);
    if (onDateRangeChange) {
      onDateRangeChange(newRange);
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
      {(title || description) && (
        <Column fillWidth borderBottom={border} paddingX="20" paddingY="12" gap="4">
          <Row fillWidth vertical="center">
            <Column fillWidth gap="4">
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
            {isTimeSeries && (
              <DropdownWrapper
                isOpen={showDateRangeSelectorUI}
                trigger={
                  <IconButton
                    icon="calendar"
                    onClick={() => setShowDateRangeSelectorUI(!showDateRangeSelectorUI)}
                    variant="secondary"
                    size="m"
                  />
                }
                dropdown={
                <Column padding="16" gap="8">
                  <DateRangePicker
                    id="line-chart-date-range"
                    value={selectedDateRange}
                    onChange={handleDateRangeChange} />
                </Column>
                }
              />
            )}
          </Row>
        </Column>
      )}
      <Row fill>
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={filteredData}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
          >
            <defs>
              {autoSeries.map(({ key, color }) => (
                <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`var(--data-${color})`} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={`var(--data-${color})`} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <RechartsCartesianGrid
              vertical
              horizontal
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <RechartsLegend
                content={
                  <Legend 
                    colors={colors} 
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
                tickLine={false}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 11,
                }}
                dataKey={xAxisKey}
                axisLine={{
                  stroke: "var(--neutral-alpha-weak)",
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
                  isTimeSeries={isTimeSeries}
                  timeFormat={timeFormat}
                  tooltip={tooltip}
                  {...props}
                />
              }
            />
            {autoSeries.map(({ key, color }) => (
              <RechartsArea
                key={key}
                type={curveType}
                dataKey={key}
                name={key}
                stroke={`var(--data-${color})`}
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
      </Row>
    </Column>
  );
};

LineChart.displayName = "LineChart";

export { LineChart };
export type { LineChartProps, DataPoint, SeriesConfig };
