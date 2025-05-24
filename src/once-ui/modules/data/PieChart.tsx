"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Flex, Heading, Text, Column, Row } from "../../components";

interface DataPoint {
  name: string;
  value: number;
  color?: string; // Optional custom color for this slice
}

interface PieChartProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  /**
   * Apply blur effect
   * @default false
   */
  blur?: boolean;
  /**
   * Title for the pie chart
   */
  title?: string;
  /**
   * Show legend below the chart
   * @default false
   */
  showLegend?: boolean;
  /**
   * Inner radius for creating donut chart (percentage or pixel value)
   * Set to 0 for filled pie chart, or a value like "60%" for donut chart
   * @default "0"
   */
  innerRadius?: number | string;
  /**
   * Outer radius for the pie chart (percentage or pixel value)
   * @default "90%"
   */
  outerRadius?: number | string;
  /**
   * Data key for values
   * @default "value"
   */
  dataKey?: string;
  /**
   * Name key for labels
   * @default "name"
   */
  nameKey?: string;
  /**
   * Angle between slices
   * @default 0
   */
  paddingAngle?: number;
  /**
   * Use gradient fills for pie slices
   * @default true
   */
  useGradients?: boolean;

  defaultColors?: string[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Column
        minWidth={8}
        gap="8"
        paddingBottom="8"
        background="surface"
        radius="m"
        border="neutral-alpha-medium">
        <Column
          fillWidth
          paddingTop="8"
          paddingX="12"
        >
          <Text variant="label-default-s"
            onBackground="neutral-strong" paddingBottom="8">{payload[0].name}</Text>
        <Row horizontal="space-between" fillWidth>
          <Text
          onBackground="neutral-weak" variant="label-default-s"
            style={{ color: payload[0].fill }}
          >
            </Text>
            <Text
            onBackground="neutral-strong" variant="label-default-s">
            {`Value: ${payload[0].value}`}
          </Text>
        </Row>
      </Column>
      </Column>
    );
  }
  return null;
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  defaultColors = ['blue', 'green', 'aqua', 'violet', 'orange', 'red', 'purple', 'magenta', 'moss', 'emerald'],
  blur = false,
  border,
  title,
  radius,
  background,
  showLegend = false,
  innerRadius = "0",
  outerRadius = "90%",
  dataKey = "value",
  nameKey = "name",
  paddingAngle = 0,
  useGradients = true,
  ...flexProps
}) => {
  // Convert defaults into CSS var() references
  const colorPalette = defaultColors.map((c) => `var(--data-${c})`);

  // Generate unique IDs for each gradient
  const gradientIds = data.map((_, index) => 
    `pieGradient-${Math.random().toString(36).substring(2, 9)}-${index}`
  );

  return (
    <Flex
      fillWidth
      height={24}
      data-viz="categorical"
      radius={radius}
      border={border}
      align="center"
      direction="column"
      vertical="center"
      background={background}
      {...flexProps}
    >
      {title && (
        <Flex
          borderBottom={border}
          fillWidth
          align="center"
          vertical="center"
          horizontal="center"
        >
          <Heading padding="s">{title}</Heading>
        </Flex>
      )}
      <Flex padding={title ? "s" : "2"} fill>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <defs>
              {data.map((entry, index) => {
                const baseColor = entry.color || colorPalette[index % colorPalette.length];
                return (
                  <radialGradient
                    key={`gradient-${index}`}
                    id={gradientIds[index]}
                    cx="50%"
                    cy="50%"
                    r="100%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="25%" stopColor={baseColor} stopOpacity={0.5} />
                    <stop offset="40%" stopColor={baseColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={baseColor} stopOpacity={0.05} />
                  </radialGradient>
                );
              })}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              dataKey={dataKey}
              nameKey={nameKey}
              stroke="none"
            >
              {data.map((entry, index) => {
                const baseColor = entry.color || colorPalette[index % colorPalette.length];
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={useGradients ? `url(#${gradientIds[index]})` : baseColor} 
                    strokeWidth={1}
                    stroke={baseColor}
                  />
                );
              })}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
            />
            {showLegend && (
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                wrapperStyle={{ paddingTop: 16 }}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
};