"use client";

import React from "react";
import {
  ComposedChart as RechartsComposedChart,
  Line as RechartsLine,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend,
  Area as RechartsArea
} from "recharts";
import { Flex, Column, Text, Row } from "../../components";
import { SpacingToken } from "../../types";
import { Tooltip, Legend } from "../";

interface DataPoint {
  [key: string]: string | number | Date;
}

interface LineBarChartProps extends Omit<React.ComponentProps<typeof Flex>, 'title' | 'description'> {
  data: DataPoint[];
  xAxisKey?: string;
  lineDataKey?: string;
  barDataKey?: string;
  lineName?: string;
  barName?: string;
  lineColor?: string;
  barColor?: string;
  barWidth?: SpacingToken | "fill" | number;
  showArea?: boolean;
  labels?: "x" | "y" | "both" | "none";
  title?: React.ReactNode;
  description?: React.ReactNode;
  legend?: boolean;
  dashedLine?: boolean;
  curveType?: "linear" | "monotone" | "monotoneX" | "step" | "natural";
  isTimeSeries?: boolean;
  timeFormat?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

const defaultColors = {
  line: "blue",
  bar: "green"
};

const LineBarChart: React.FC<LineBarChartProps> = ({
  data,
  xAxisKey = "name",
  lineDataKey = "lineValue",
  barDataKey = "barValue",
  lineName = "Line",
  barName = "Bar",
  lineColor = defaultColors.line,
  barColor = defaultColors.bar,
  barWidth = "fill",
  showArea = true,
  dashedLine = false,
  labels = "both",
  border = "neutral-medium",
  title,
  description,
  legend = false,
  curveType = "monotone",
  isTimeSeries = false,
  timeFormat = "YYYY-MM-DD",
  xAxisTitle,
  yAxisTitle,
  ...flex
}) => {
  const lineGradientId = `colorLine-${React.useId()}`;
  const barGradientId = `barGradient-${React.useId()}`;

  const finalLineColor = `var(--data-${lineColor})`;
  const finalBarColor = `var(--data-${barColor})`;

  return (
    <Column
      fillWidth
      height={24}
      border={border}
      radius="l"
      data-viz="categorical"
      {...flex}
    >
      {(title || description) && (
        <Column fillWidth borderBottom={border} horizontal="start" paddingX="20" paddingY="12" gap="4">
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
      )}
      <Row fill>
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsComposedChart
            data={data}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
            barGap={4}
          >
            <defs>
              {/* Bar gradient */}
              <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={finalBarColor} stopOpacity={0.8} />
                <stop offset="70%" stopColor={finalBarColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={finalBarColor} stopOpacity={0} />
              </linearGradient>
              
              {/* Line gradient */}
              <linearGradient id={lineGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="25%" stopColor={finalLineColor} stopOpacity={0.5} />
                <stop offset="95%" stopColor={finalLineColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <RechartsCartesianGrid
              horizontal
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <RechartsLegend
                content={<Legend labels={labels} />}
                wrapperStyle={{ position: "absolute", top: 0, right: 0 }}
              />
            )}
            {(labels === "x" || labels === "both") && (
              <RechartsXAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                height={xAxisTitle ? 50 : 0}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 11,
                }}
                label={
                  xAxisTitle
                    ? { value: xAxisTitle, fontWeight: "500", position: 'bottom', offset: -23, fill: "var(--neutral-on-background-medium)" }
                    : undefined
                }
              />
            )}
            {(labels === "y" || labels === "both") && (
              <RechartsYAxis
                allowDataOverflow
                axisLine={{
                  stroke: "var(--neutral-alpha-medium)",
                }}
                tickLine={false}
                padding={{ top: 40 }}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 11,
                }}
                width={yAxisTitle ? 54 : 0}
                label={
                  yAxisTitle
                    ? { 
                      value: yAxisTitle,
                      position: 'insideTop',
                      offset: 10,
                      fontSize: 12,
                      fill: "var(--neutral-on-background-medium)" 
                    }
                    : undefined
                }
              />
            )}
            <RechartsTooltip
              content={props => <Tooltip {...props} isTimeSeries={isTimeSeries} timeFormat={timeFormat} xAxisKey={xAxisKey} showColors={true} />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <RechartsBar
              dataKey={barDataKey}
              name={barName}
              fill={`url(#${barGradientId})`}
              stroke={finalBarColor}
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
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
            
            {showArea ? (
              <RechartsArea
                type={curveType}
                dataKey={lineDataKey}
                name={lineName}
                stroke={finalLineColor}
                strokeDasharray={dashedLine ? "5 5" : "0"}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${lineGradientId})`}
                dot={{ r: 4, fill: finalLineColor }}
                activeDot={{ r: 6, fill: finalLineColor }}
              />
            ) : (
              <RechartsLine
                type={curveType}
                dataKey={lineDataKey}
                name={lineName}
                stroke={finalLineColor}
                strokeDasharray={dashedLine ? "5 5" : "0"}
                strokeWidth={2}
                dot={{ r: 4, fill: finalLineColor }}
                activeDot={{ r: 6, fill: finalLineColor }}
              />
            )}
          </RechartsComposedChart>
        </RechartsResponsiveContainer>
      </Row>
    </Column>
  );
};

LineBarChart.displayName = "LineBarChart";

export { LineBarChart };
export type { LineBarChartProps };