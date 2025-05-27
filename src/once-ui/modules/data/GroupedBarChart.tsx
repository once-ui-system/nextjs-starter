"use client";

import React, { useState, useEffect, useMemo } from "react";
import { formatDate } from "./utils/formatDate";
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  ResponsiveContainer as RechartsResponsiveContainer,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";

import { Column, Row, DateRange } from "../../components";
import { getDistributedColor } from "./utils/colorDistribution";
import { ChartProps, LinearGradient, Tooltip, Legend, ChartStyles, ChartStatus, ChartHeader, barWidth } from ".";
import { chart } from "../../../app/resources/data.config";

interface GroupedBarChartProps extends ChartProps {
  xAxisKey?: string;
  barWidth?: barWidth;
  hover?: boolean;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  title,
  description,
  data,
  series,
  date,
  emptyState,
  loading = false,
  legend: legendProp = {},
  labels = "both",
  border = "neutral-medium",
  variant = chart.variant,
  xAxisKey = "name",
  barWidth = "l",
  hover = false,
  ...flex
}) => {
  const legend = {
    display: legendProp.display !== undefined ? legendProp.display : true,
    position: legendProp.position || "top-left",
    direction: legendProp.direction
  };
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

  const seriesArray = Array.isArray(series) ? series : (series ? [series] : []);

  // Generate a unique ID for this chart instance
  const chartId = React.useMemo(() => Math.random().toString(36).substring(2, 9), []);

  const coloredSeriesArray = seriesArray.map((s, index) => ({
    ...s,
    color: s.color || getDistributedColor(index, seriesArray.length)
  }));
  
  const autoKeys = Object.keys(data[0] || {}).filter(key => key !== xAxisKey);
  const autoSeries = seriesArray.length > 0 ? coloredSeriesArray : 
    autoKeys.map((key, index) => ({
      key,
      color: getDistributedColor(index, autoKeys.length)
    }));
  
  const barColors = autoSeries.map(s => `var(--data-${s.color})`);

  const filteredData = React.useMemo(() => {
    if (!selectedDateRange || !data || data.length === 0) {
      return data;
    }

    return data.filter(item => {
      try {
        if (!item[xAxisKey] || !selectedDateRange.startDate || !selectedDateRange.endDate) {
          return true;
        }
        
        const itemDate = typeof item[xAxisKey] === 'string' ? new Date(item[xAxisKey] as string) : item[xAxisKey] as Date;
        
        return itemDate >= selectedDateRange.startDate && 
               itemDate <= selectedDateRange.endDate;
      } catch (e) {
        return true;
      }
    });
  }, [data, selectedDateRange, xAxisKey]);
  
  return (
    <Column
      fillWidth
      height={chart.height}
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
            <RechartsBarChart
              data={filteredData}
              margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
              barGap={4}
            >
              <RechartsCartesianGrid
                horizontal
                vertical={false}
                stroke="var(--neutral-alpha-weak)"
              />
              {legend.display && (
                <RechartsLegend
                  content={props => {
                    const customPayload = autoSeries.map((series, index) => ({
                      value: series.key,
                      color: barColors[index]
                    }));
                    
                    return (
                      <Legend 
                        variant={variant as ChartStyles}
                        payload={customPayload}
                        labels={labels} 
                        position={legend.position} 
                        direction={legend.direction}
                      />
                    );
                  }}
                  wrapperStyle={{
                    position: 'absolute',
                    top: (legend.position === "top-center" || legend.position === "top-left" || legend.position === "top-right") ? 0 : undefined,
                    bottom: (legend.position === "bottom-center" || legend.position === "bottom-left" || legend.position === "bottom-right") ? 0 : undefined,
                    paddingBottom: (legend.position === "bottom-center" || legend.position === "bottom-left" || legend.position === "bottom-right") ? "var(--static-space-40)" : undefined,
                    left: (labels === "x" || labels === "both") && (legend.position === "top-center" || legend.position === "bottom-center") ? "var(--static-space-64)" : 0,
                    width: (labels === "x" || labels === "both") && (legend.position === "top-center" || legend.position === "bottom-center") ? "calc(100% - var(--static-space-64))" : "100%",
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
                    fill: chart.tick.fill,
                    fontSize: chart.tick.fontSize,
                  }}
                  tickFormatter={(value) => {
                    const dataPoint = data.find(item => item[xAxisKey] === value);
                    return formatDate(value, date, dataPoint);
                  }}
                />
              )}
              {(labels === "y" || labels === "both") && (
                <RechartsYAxis
                  allowDataOverflow
                  width={64}
                  padding={{ top: 40 }}
                  tickLine={false}
                  tick={{
                    fill: chart.tick.fill,
                    fontSize: chart.tick.fontSize,
                  }}
                  axisLine={{
                    stroke: chart.axisLine.stroke,
                  }}
                />
              )}
              <RechartsTooltip
                cursor={{ fill: hover ? "var(--neutral-alpha-weak)" : "var(--static-transparent)" }}
                content={props => 
                  <Tooltip
                    {...props}
                    date={date}
                    variant={variant as ChartStyles}
                  />
                }
              />
              <defs>
                {barColors.map((color, index) => (
                  <LinearGradient
                    key={`gradient-${chartId}-${index}`}
                    id={`barGradient${chartId}${index}`}
                    color={color}
                    variant={variant as ChartStyles}
                  />
                ))}
              </defs>
              {autoSeries.map((series, index) => (
                <RechartsBar
                  key={series.key}
                  dataKey={series.key}
                  name={series.key}
                  fill={`url(#barGradient${chartId}${index})`}
                  stroke={barColors[index]}
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
              ))}
            </RechartsBarChart>
          </RechartsResponsiveContainer>
        )}
      </Row>
    </Column>
  );
};

GroupedBarChart.displayName = "GroupedBarChart";

export { GroupedBarChart };
export type { GroupedBarChartProps };