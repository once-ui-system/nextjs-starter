import React from "react";
import moment from 'moment'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Flex, Column, Text, Row } from "../../components";

interface DataPoint {
  name: string | number | Date;
  [key: string]: any;
}

interface LineChartProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  xAxisKey?: string;
  yAxisKeys?: string[];
  colors?: string[];
  title?: string;
  description?: string;
  legend?: boolean;
  tooltip?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  labels?: "x" | "y" | "both";
  curveType?: "linear" | "monotone" | "monotoneX" | "step" | "natural";
  isTimeSeries?: boolean;
  timeFormat?: string;
}

const defaultColors = ['blue', 'green', 'aqua', 'violet', 'orange', 'red', 'purple', 'magenta', 'moss', 'emerald'];

const CustomTooltip = ({ active, payload, label, isTimeSeries, timeFormat = "MMM dd, yyyy" }: any) => {
  if (active && payload && payload.length) {
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
            {isTimeSeries ? moment(label).format(timeFormat) : label}
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
                    border: `1px solid ${entry.stroke}`,
                    background: `linear-gradient(to bottom, ${entry.stroke} 0%, transparent 100%)`
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
                {entry.value.toLocaleString()}
              </Text>
            </Row>
          ))}
        </Column>
      </Column>
    );
  }
  return null;
};

const CustomLegend = ({ payload, labels, colors = defaultColors }: any) => {
  if (payload && payload.length) {
    return (
      <Flex 
        horizontal="start" 
        vertical="center" 
        position="absolute"
        gap="16"
        left={(labels === "x" || labels === "both") ? "80" : "8"}
        top="12"
      >
        {payload.map((entry: any, index: number) => (
          <Flex key={index} vertical="center" gap="8">
            <Flex
              style={{
                backgroundClip: "padding-box",
                border: `1px solid var(--data-${colors[index]})`,
                background: `linear-gradient(to bottom, var(--data-${colors[index]}) 0%, transparent 100%)`
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

const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisKey = "name",
  xAxisTitle = "",
  yAxisTitle = "",
  yAxisKeys = ["value"],
  colors = defaultColors,
  border = "neutral-medium",
  legend = false,
  title,
  description,
  tooltip,
  labels = "both",
  curveType = "natural",
  isTimeSeries = false,
  timeFormat = "MMM dd, yyyy",
  ...flex
}) => {
  return (
    <Flex
      fill
      radius="l"
      border={border}
      align="center"
      data-viz="categorical"
      horizontal="center"
      direction="column"
      vertical="center"
      {...flex}
    >
      {title && (
        <Column fillWidth borderBottom={border} horizontal="start" paddingX="20" paddingY="12" gap="4">
          <Text variant="heading-strong-s">
            {title}
          </Text>
          {description && (
            <Text variant="label-default-s" onBackground="neutral-weak">
              {description}
            </Text>
          )}
        </Column>
      )}
      <Flex fill>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ left: 0, bottom: 0, top: 0, right: 0 }}
          >
            <defs>
              {yAxisKeys.map((key, index) => (
                <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`var(--data-${colors[index]})`} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={`var(--data-${colors[index]})`} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              vertical={true}
              stroke="var(--neutral-alpha-weak)"
              horizontal={true}
            />
            {legend && (
              <Legend
                content={<CustomLegend colors={colors} labels={labels} />}
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
                tickMargin={6}
                dataKey={xAxisKey}
                axisLine={{
                  stroke: "var(--neutral-alpha-weak)",
                }}
                tickLine={false}
                height={32}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 11,
                }}
              />
            )}
            {(labels === "y" || labels === "both") && (
              <YAxis
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
            <Tooltip
              cursor={{
                stroke: "var(--neutral-border-strong)",
                strokeWidth: 1,
              }}
              content={
                <CustomTooltip
                  tooltip={tooltip}
                  isTimeSeries={isTimeSeries}
                  timeFormat={timeFormat}
                />
              }
            />
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type={curveType}
                dataKey={key}
                name={key}
                stroke={`var(--data-${colors[index]})`}
                strokeWidth={1}
                fillOpacity={1}
                fill={`url(#color${key})`}
                activeDot={{
                  stroke: "var(--static-transparent)"
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};

LineChart.displayName = "LineChart";

export { LineChart };
export type { LineChartProps };
