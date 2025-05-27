"use client";

import React, { useState, useEffect } from "react";
import { formatDate } from "./utils/formatDate";
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

import { Column, Row, DateRange } from "../../components";
import { ChartHeader, LinearGradient, ChartProps, Tooltip, Legend, ChartStyles, barWidth, ChartStatus } from ".";
import { styles } from "@/app/resources/data.config";

interface BarChartProps extends ChartProps {
  xAxisKey?: string;
  yAxisKey?: string;
  barWidth?: barWidth;
}

const BarChart: React.FC<BarChartProps> = ({
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
  xAxisKey = "date",
  yAxisKey,
  barWidth = "fill",
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
        return true;
      }
    });
  }, [data, selectedDateRange, xAxisKey]);

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
            <RechartsBarChart
              data={filteredData}
              margin={{ left: 0, right: 0, bottom: 0 }}
            >
            <RechartsCartesianGrid
              horizontal
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend.display && (
              <RechartsLegend
                content={(props) => {
                  const customPayload = [{
                    value: seriesKey,
                    color: barColor
                  }];
                  
                  return (
                    <Legend 
                      position={legend.position} 
                      payload={customPayload}
                      labels={labels} 
                      variant={variant as ChartStyles}
                      direction={legend.direction}
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
                  return formatDate(value, date, dataPoint);
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
                  {...props}
                  date={date}
                  colors={false}
                  variant={variant as ChartStyles}
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
