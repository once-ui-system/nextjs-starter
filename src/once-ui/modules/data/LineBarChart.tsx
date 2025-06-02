"use client";

import React, { useState, useEffect, useMemo } from "react";
import { isWithinInterval, parseISO } from "date-fns";
import { formatDate } from "./utils/formatDate";
import {
  ComposedChart as RechartsComposedChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend,
  Area as RechartsArea,
} from "recharts";
import { Column, Row, DateRange } from "../../components";
import {
  LinearGradient,
  ChartHeader,
  Tooltip,
  Legend,
  ChartStatus,
  ChartProps,
  SeriesConfig,
  ChartStyles,
  barWidth,
  curveType,
} from ".";
import { chart } from "@/app/resources/data.config";

interface LineBarChartProps extends ChartProps {
  barWidth?: barWidth;
  curve?: curveType;
}

const LineBarChart: React.FC<LineBarChartProps> = ({
  title,
  description,
  data,
  series,
  date,
  emptyState,
  loading = false,
  legend: legendProp = {},
  axis = "both",
  border = "neutral-medium",
  variant = chart.variant,
  barWidth = "fill",
  curve = "natural",
  ...flex
}) => {
  const legend = {
    display: legendProp.display !== undefined ? legendProp.display : true,
    position: legendProp.position || "top-left",
    direction: legendProp.direction,
  };
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(
    date?.start && date?.end
      ? {
          startDate: date.start,
          endDate: date.end,
        }
      : undefined,
  );

  useEffect(() => {
    if (date?.start && date?.end) {
      setSelectedDateRange({
        startDate: date.start,
        endDate: date.end,
      });
    }
  }, [date?.start, date?.end]);

  const allSeriesArray = Array.isArray(series) ? series : series ? [series] : [];
  const seriesKeys = allSeriesArray.map((s: SeriesConfig) => s.key);

  const xAxisKey = Object.keys(data[0] || {}).find((key) => !seriesKeys.includes(key)) || "name";

  const filteredData = React.useMemo(() => {
    if (selectedDateRange?.startDate && selectedDateRange?.endDate && xAxisKey) {
      const startDate = selectedDateRange.startDate;
      const endDate = selectedDateRange.endDate;

      if (startDate instanceof Date && endDate instanceof Date) {
        return data.filter((item) => {
          try {
            const itemDateValue = item[xAxisKey];
            if (!itemDateValue) return false;

            const itemDate =
              typeof itemDateValue === "string" ? parseISO(itemDateValue) : (itemDateValue as Date);

            return isWithinInterval(itemDate, {
              start: startDate,
              end: endDate,
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

  const chartSeriesArray = Array.isArray(series) ? series : series ? [series] : [];
  if (chartSeriesArray.length < 2) {
    console.warn("LineBarChart requires at least 2 series (one for line, one for bar)");
  }

  const lineSeries = chartSeriesArray[0] || { key: "value1", color: "blue" };
  const barSeries = chartSeriesArray[1] || { key: "value2", color: "green" };

  const lineColor = lineSeries.color || "blue";
  const barColor = barSeries.color || "green";

  const finalLineColor = `var(--data-${lineColor})`;
  const finalBarColor = `var(--data-${barColor})`;

  const chartId = React.useMemo(() => Math.random().toString(36).substring(2, 9), []);

  return (
    <Column fillWidth height={chart.height} border={border} radius="l" {...flex}>
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
                  id={`barGradient${chartId}`}
                  color={finalBarColor}
                  variant={variant as ChartStyles}
                />

                <LinearGradient
                  id={`lineGradient${chartId}`}
                  color={finalLineColor}
                  variant={variant as ChartStyles}
                />
              </defs>
              <RechartsCartesianGrid
                horizontal
                vertical={false}
                stroke="var(--neutral-alpha-weak)"
              />
              {legend.display && (
                <RechartsLegend
                  content={
                    <Legend
                      variant={variant as ChartStyles}
                      colors={[finalLineColor, finalBarColor]}
                      labels={axis}
                      position={legend.position}
                      direction={legend.direction}
                    />
                  }
                  wrapperStyle={{
                    position: "absolute",
                    top:
                      legend.position === "top-center" ||
                      legend.position === "top-left" ||
                      legend.position === "top-right"
                        ? 0
                        : undefined,
                    bottom:
                      legend.position === "bottom-center" ||
                      legend.position === "bottom-left" ||
                      legend.position === "bottom-right"
                        ? 0
                        : undefined,
                    paddingBottom:
                      legend.position === "bottom-center" ||
                      legend.position === "bottom-left" ||
                      legend.position === "bottom-right"
                        ? "var(--static-space-40)"
                        : undefined,
                    left:
                      (axis === "y" || axis === "both") &&
                      (legend.position === "top-center" || legend.position === "bottom-center")
                        ? "var(--static-space-64)"
                        : 0,
                    width:
                      (axis === "y" || axis === "both") &&
                      (legend.position === "top-center" || legend.position === "bottom-center")
                        ? "calc(100% - var(--static-space-64))"
                        : "100%",
                    right: 0,
                    margin: 0,
                  }}
                />
              )}
              <RechartsXAxis
                height={32}
                tickMargin={6}
                dataKey={xAxisKey}
                hide={!(axis === "x" || axis === "both")}
                axisLine={{
                  stroke: chart.axisLine.stroke,
                }}
                tickLine={chart.tickLine}
                tick={{
                  fill: chart.tick.fill,
                  fontSize: chart.tick.fontSize,
                }}
                tickFormatter={(value) => {
                  const dataPoint = data.find((item) => item[xAxisKey] === value);
                  return formatDate(value, date, dataPoint);
                }}
              />
              {(axis === "y" || axis === "both") && (
                <RechartsYAxis
                  width={64}
                  padding={{ top: 40 }}
                  allowDataOverflow
                  tickLine={chart.tickLine}
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
                cursor={{
                  stroke: "var(--neutral-border-strong)",
                  strokeWidth: 1,
                }}
                content={(props) => (
                  <Tooltip
                    {...props}
                    variant={variant as ChartStyles}
                    date={date}
                    dataKey={xAxisKey}
                  />
                )}
              />
              <RechartsArea
                type={curve}
                dataKey={lineSeries.key}
                name={lineSeries.key}
                stroke={finalLineColor}
                transform="translate(0, -1)"
                fill={`url(#lineGradient${chartId})`}
                activeDot={{
                  r: 4,
                  fill: finalLineColor,
                  stroke: "var(--background)",
                  strokeWidth: 0,
                }}
              />
              <RechartsBar
                dataKey={barSeries.key}
                name={barSeries.key}
                fill={`url(#barGradient${chartId})`}
                stroke={finalBarColor}
                strokeWidth={1}
                transform="translate(0, -1)"
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
