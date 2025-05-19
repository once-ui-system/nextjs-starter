import React from "react";
import moment from "moment";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from "recharts";
import { Flex, Column, Text, Row } from "../../components";
import { SpacingToken } from "../../types";

interface DataPoint {
  [key: string]: string | number | Date;
}

interface LineBarGraphProps extends React.ComponentProps<typeof Flex> {
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
  title?: string;
  description?: string;
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

const CustomTooltip = ({ active, payload, label, isTimeSeries, timeFormat = "MMM DD, YYYY", xAxisKey }: any) => {
  if (active && payload && payload.length) {
    // Get the proper label from the payload data instead of using the default label
    const displayLabel = payload[0]?.payload?.[xAxisKey] || label;
    
    return (
      <Column
        minWidth={8}
        gap="8"
        background="surface"
        radius="m"
        border="neutral-alpha-medium">
        <Flex
          fillWidth
          paddingTop="8"
          paddingX="12"
        >
          <Text
            variant="label-default-s"
            onBackground="neutral-strong"
          >
            {isTimeSeries ? moment(displayLabel).format(timeFormat) : displayLabel}
          </Text>
        </Flex>
        <Column
          fillWidth
          horizontal="space-between"
          paddingBottom="8"
          paddingX="12"
          gap="4">
          {payload.map((entry: any, index: number) => (
            <Row key={index} horizontal="space-between" fillWidth gap="16">
              <Row vertical="center" gap="8">
                <Flex
                  style={{
                    backgroundClip: "padding-box",
                    border: `1px solid ${entry.stroke || entry.color}`,
                    background: `linear-gradient(to bottom, ${entry.stroke || entry.color} 0%, transparent 100%)`
                  }}
                  minWidth="12"
                  minHeight="12"
                  radius="xs"
                />
                <Text onBackground="neutral-weak" variant="label-default-s">
                  {entry.name}
                </Text>
              </Row>
              <Text onBackground="neutral-strong" variant="label-default-s">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </Text>
            </Row>
          ))}
        </Column>
      </Column>
    );
  }
  return null;
};

const CustomLegend = ({ payload, labels }: any) => {
  if (payload && payload.length) {
    return (
      <Flex 
      horizontal="start" 
      vertical="center" 
      position="absolute"
      gap="16"
      left={(labels === "y" || labels === "both") ? "80" : "12"}
      top="12"
      >
        {payload.map((entry: any, index: number) => (
          <Flex key={index} vertical="center" gap="8">
            <Flex
              style={{
                backgroundClip: "padding-box",
                border: `1px solid ${entry.stroke || entry.color}`,
                background: `linear-gradient(to bottom, ${entry.stroke || entry.color} 0%, transparent 100%)`
              }}
              minWidth="16"
              minHeight="16"
              radius="s"
            />
            <Text variant="label-default-s">
              {entry.value}
            </Text>
          </Flex>
        ))}
      </Flex>
    );
  }
  return null;
};

const LineBarGraph: React.FC<LineBarGraphProps> = ({
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
  ...flexProps
}) => {
  // Generate unique IDs for gradients
  const lineGradientId = `colorLine-${React.useId()}`;
  const barGradientId = `barGradient-${React.useId()}`;

  // Get the final colors with CSS variables
  const finalLineColor = `var(--data-${lineColor})`;
  const finalBarColor = `var(--data-${barColor})`;

  return (
    <Flex
      direction="column"
      fillHeight
      fillWidth
      height={24}
      border={border}
      radius="l"
      data-viz="categorical"
      {...flexProps}
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
      <Flex fill>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
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
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <Legend
                content={<CustomLegend labels={labels} />}
                wrapperStyle={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  margin: 0
                }}
              />
            )}
            {(labels === "x" || labels === "both") && (
              <XAxis
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
              <YAxis
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
            <Tooltip
              content={<CustomTooltip isTimeSeries={isTimeSeries} timeFormat={timeFormat} xAxisKey={xAxisKey} />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar
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
              <Area
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
              <Line
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
          </ComposedChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};

LineBarGraph.displayName = "LineBarGraph";

export { LineBarGraph };
export type { LineBarGraphProps };