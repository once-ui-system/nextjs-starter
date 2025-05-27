"use client";

import React, { useState, useEffect } from "react";
import { isWithinInterval, parseISO } from 'date-fns';
import { styles } from "../../../app/resources/data.config";
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
import { Column, Row, DateRange } from "../../components";
import { LinearGradient, ChartHeader, Tooltip, Legend, SeriesConfig, ChartProps, ChartStatus, ChartStyles, curveType } from ".";
import { schemes } from "../../types";
import { getDistributedColor } from "./utils/colorDistribution";

interface LineChartProps extends ChartProps {
  curveType?: curveType;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  description,
  data,
  series,
  date,
  emptyState,
  loading = false,
  legend = { display: true, position: "top-left" },
  labels = "both",
  border = "neutral-medium",
  variant = styles.variant,
  curveType = "natural",
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

  const seriesArray = Array.isArray(series) ? series : (series ? [series] : []);
  const seriesKeys = seriesArray.map((s: SeriesConfig) => s.key);
  
  const coloredSeriesArray = seriesArray.map((s, index) => ({
    ...s,
    color: s.color || getDistributedColor(index, seriesArray.length)
  }));
  
  const autoKeys = Object.keys(data[0] || {}).filter(key => !seriesKeys.includes(key));
  const autoSeries = seriesArray.length > 0 ? coloredSeriesArray : 
    autoKeys.map((key, index) => ({
      key,
      color: getDistributedColor(index, autoKeys.length)
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
      height={styles.height}
      data-viz={styles.mode}
      border={border}
      radius="l"
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
            <RechartsAreaChart
              data={filteredData}
              margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            >
            <defs>
              {autoSeries.map(({ key, color }, index) => {
                const colorValue = color || schemes[index % schemes.length];
                const lineColor = `var(--data-${colorValue})`;
                return (
                  <LinearGradient
                    key={key}
                    id={`color-${key}`}
                    variant={variant as ChartStyles}
                    color={lineColor}
                  />
                );
              })}
            </defs>
            <RechartsCartesianGrid
              vertical
              horizontal
              stroke="var(--neutral-alpha-weak)"
            />
            {legend.display && (
              <RechartsLegend
                content={(props) => {
                  const customPayload = autoSeries.map(({ key, color }, index) => ({
                    value: key,
                    color: `var(--data-${color || schemes[index % schemes.length]})`
                  }));
                  
                  return (
                    <Legend 
                      payload={customPayload}
                      labels={labels} 
                      position={legend.position}
                      direction={legend.direction}
                      variant={variant as ChartStyles}
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
                  variant={variant as ChartStyles}
                  date={date}
                  {...props}
                />
              }
            />
            {autoSeries.map(({ key, color }, index) => {
              const colorValue = color || schemes[index % schemes.length];
              const lineColor = `var(--data-${colorValue})`;
              return (
                <RechartsArea
                  key={key}
                  type={curveType}
                  dataKey={key}
                  name={key}
                  stroke={lineColor}
                  fill={`url(#color-${key})`}
                  activeDot={{
                    r: 4,
                    fill: lineColor,
                    stroke: "var(--background)",
                    strokeWidth: 0,
                  }}
                />
              );
            })}
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
