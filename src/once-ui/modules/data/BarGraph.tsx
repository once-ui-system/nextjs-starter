import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { SpacingToken } from "../../types";
import { Text, Flex, Column } from "../../components";

interface DataPoint {
  name: string;
  value: number;
  startDate: string;
  endDate: string;
  color?: string;
}

type BarColor = "success" | "danger" | "purple";

interface BarGraphProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  xAxisKey?: string;
  yAxisKey?: string;
  barColor?: BarColor;
  barWidth?: SpacingToken | "fill" | number | string;
  blur?: boolean;
  title?: string;
  description?: string;
  tooltipTitle?: string;
  hideXAxisLabels?: boolean;
  hideYAxisLabels?: boolean;
  hideLabels?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
  hideXAxisTitle?: boolean;
  hideYAxisTitle?: boolean;
  hideAxisTitles?: boolean;
  xAxisHeight?: number;
}

const CustomTooltip = ({ active, payload, tooltipTitle, xAxisTitle }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Column
        minWidth={8}
        background="surface"
        radius="m"
        border="neutral-alpha-medium">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          paddingY="8"
          paddingX="12"
        >
          <Text
            variant="label-strong-s"
            onBackground="neutral-strong"
          >
            {xAxisTitle && `${xAxisTitle}: `}{data.endDate}
          </Text>
        </Flex>
        <Flex
          paddingY="8"
          paddingX="12">
          <Text onBackground="neutral-strong" variant="label-default-s">
            {tooltipTitle && `${tooltipTitle}: `}{data.value.toLocaleString()}
          </Text>
        </Flex>
      </Column>
    );
  }
  return null;
};

const BarGraph: React.FC<BarGraphProps> = ({
  data,
  xAxisKey = "name",
  yAxisKey = "value",
  barColor = "success",
  barWidth = "fill",
  blur = false,
  border = "neutral-alpha-weak",
  title,
  description,
  tooltipTitle,
  hideXAxisLabels = false,
  hideYAxisLabels = false,
  hideLabels = false,
  xAxisTitle,
  yAxisTitle,
  hideXAxisTitle = false,
  hideYAxisTitle = false,
  hideAxisTitles = false,
  xAxisHeight = 10,
  ...flex
}) => {
  return (
    <Column
      fillWidth
      height={24}
      border={border}
      radius="l"
      data-viz="categorical"
      {...flex} 
    >
      <Column
        borderBottom={border}
        fillWidth
        paddingX="20"
        paddingY="12"
        gap="4"
        vertical="center"
      >
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
      <Flex fill>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ left: 0, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              height={hideXAxisLabels || hideLabels ? 0 : 50}
              tick={hideXAxisLabels || hideLabels ? false : {
                fill: "var(--neutral-on-background-weak)",
                fontSize: 12,
              }}
              
              label={
                xAxisTitle && !hideXAxisTitle && !hideAxisTitles
                  ? { value: xAxisTitle, fontWeight: "500", position: 'bottom', offset: -23, fill: "var(--neutral-on-background-medium)" }
                  : undefined
              }
            />
            <YAxis
              allowDataOverflow
              axisLine={{
                stroke: "var(--neutral-alpha-medium)",
              }}
              tickLine={false}
              padding={{ top: 40 }}
              tick={{
                fill: "var(--neutral-on-background-weak)",
                fontSize: 12,
               }}
              width={yAxisTitle ? 64 : 0}
              label={
                yAxisTitle && !hideYAxisTitle && !hideAxisTitles
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
            <Tooltip
              content={<CustomTooltip tooltipTitle={tooltipTitle} xAxisTitle={xAxisTitle} />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                {[
                  { offset: "0%", opacity: 0.6 },
                  { offset: "100%", opacity: 0 },
                ].map(({ offset, opacity }) => (
                  <stop
                    key={offset}
                    offset={offset}
                    stopColor="var(--data-solid-100)"
                    stopOpacity={opacity}
                  />
                ))}
              </linearGradient>
            </defs>
            <Bar
              dataKey={yAxisKey}
              fill="url(#barGradient)"
              stroke="var(--data-solid-100)"
              strokeWidth={1}
              barSize={
              barWidth === "fill"
                ? "100%"
                : barWidth === "xs"
                ? 12
                : barWidth === "s"
                ? 16
                : barWidth === "m"
                ? 24
                : barWidth === "l"
                ? 40
                : barWidth === "xl"
                ? 64
                : barWidth
              }
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Flex>
    </Column>
  );
};

BarGraph.displayName = "BarGraph";

export { BarGraph };
export type { BarGraphProps };
