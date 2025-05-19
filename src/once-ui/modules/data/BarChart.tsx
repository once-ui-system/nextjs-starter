import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { TShirtSizes } from "../../types";
import { Text, Flex, Column } from "../../components";

interface DataPoint {
  name: string;
  value: number;
  startDate: string;
  endDate: string;
  color?: string;
}

interface BarChartProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  xAxisKey?: string;
  yAxisKey?: string;
  barWidth?: TShirtSizes | "fill";
  title?: string;
  description?: string;
  legend?: boolean;
  tooltip?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  labels?: "x" | "y" | "both";
}

const CustomTooltip = ({ active, payload, tooltipTitle, xAxisTitle }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Column
        minWidth={8}
        gap="4"
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
            {xAxisTitle && `${xAxisTitle}: `}{data.endDate}
          </Text>
        </Flex>
        <Flex
          fillWidth
          horizontal="space-between"
          paddingBottom="8"
          paddingX="12"
          gap="8">
          <Text onBackground="neutral-weak" variant="label-default-s">
            {tooltipTitle && `${tooltipTitle} `}
          </Text>
          <Text onBackground="neutral-strong" variant="label-default-s">
            {data.value.toLocaleString()}
          </Text>
        </Flex>
      </Column>
    );
  }
  return null;
};

const CustomLegend = ({ payload, labels, color }: any) => {
  if (payload && payload.length) {
    return (
      <Flex 
        horizontal="start" 
        vertical="center" 
        position="absolute"
        left={(labels === "x" || labels === "both") ? "8" : "80"}
        top="12"
      >
        {payload.map((entry: any, index: number) => (
          <Flex key={index} vertical="center" gap="8">
            <Flex
              style={{
                backgroundClip: "padding-box",
                border: `1px solid var(--data-${color})`,
                background: `linear-gradient(to bottom, var(--data-${color}) 0%, transparent 100%)`
              }}
              minWidth="16"
              minHeight="16"
              border="neutral-alpha-medium"
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

const BarGraph: React.FC<BarChartProps> = ({
  data,
  xAxisKey = "name",
  yAxisKey = "value",
  yAxisTitle,
  barWidth = "fill",
  border = "neutral-medium",
  color = "blue",
  legend = false,
  title,
  description,
  tooltip,
  labels = "both",
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
            margin={{ left: 0, right: 0, bottom: 0 }}
          >
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="var(--neutral-alpha-weak)"
            />
            {legend && (
              <Legend
                content={<CustomLegend color={color} />}
                wrapperStyle={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  margin: 0
                }}
              />
            )}
            {labels === "x" || labels === "both" && (
              <XAxis
                dataKey={xAxisKey}
                axisLine={{
                  stroke: "var(--neutral-alpha-weak)",
                }}
                tickLine={false}
                height={32}
                tick={{
                  fill: "var(--neutral-on-background-weak)",
                  fontSize: 12,
                }}
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
              content={<CustomTooltip tooltipTitle={tooltip} />}
              cursor={{ fill: "var(--neutral-alpha-weak)" }}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                {[
                  { offset: "0%", opacity: 0.8 },
                  { offset: "100%", opacity: 0 },
                ].map(({ offset, opacity }) => (
                  <stop
                    key={offset}
                    offset={offset}
                    stopColor={`var(--data-${color})`}
                    stopOpacity={opacity}
                  />
                ))}
              </linearGradient>
            </defs>
            <Bar
              dataKey={yAxisKey}
              fill="url(#barGradient)"
              stroke={`var(--data-${color})`}
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
export type { BarChartProps };
