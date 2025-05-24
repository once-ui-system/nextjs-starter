"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend
} from "recharts";
import { Column, Flex, Row, Text } from "../../components";
import { Tooltip, Legend } from "../";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps extends Omit<React.ComponentProps<typeof Flex>, 'title' | 'description'> {
  data: DataPoint[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  legend?: boolean;
  innerRadius?: number | string;
  outerRadius?: number | string;
  dataKey?: string;
  nameKey?: string;
  paddingAngle?: number;
  useGradients?: boolean;
  defaultColors?: string[];
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  defaultColors = ['blue', 'green', 'aqua', 'violet', 'orange', 'red', 'purple', 'magenta', 'moss', 'emerald'],
  border = "neutral-medium",
  title,
  description,
  legend = false,
  innerRadius = "0",
  outerRadius = "90%",
  dataKey = "value",
  nameKey = "name",
  paddingAngle = 0,
  useGradients = true,
  ...flex
}) => {
  const colorPalette = defaultColors.map((c) => `var(--data-${c})`);

  const gradientIds = data.map((_, index) => 
    `pieGradient-${Math.random().toString(36).substring(2, 9)}-${index}`
  );

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
        <Column
          borderBottom={border}
          fillWidth
          paddingX="20"
          paddingY="12"
          gap="4"
          vertical="center">
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
      <Row fill paddingBottom="48">
        <RechartsResponsiveContainer width="100%" height="100%">
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
                    <stop offset="0%" stopColor={baseColor} stopOpacity={1} />
                    <stop offset="100%" stopColor={baseColor} stopOpacity={0} />
                  </radialGradient>
                );
              })}
            </defs>
            <RechartsPie
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
                  <RechartsCell 
                    key={`cell-${index}`} 
                    fill={useGradients ? `url(#${gradientIds[index]})` : baseColor} 
                    strokeWidth={1}
                    stroke={baseColor}
                  />
                );
              })}
            </RechartsPie>
            <RechartsTooltip 
              content={props => <Tooltip {...props} />}
            />
            {legend && (
              <RechartsLegend
                content={(props) => (
                  <Legend
                    {...props}
                    labels="both"
                    colors={colorPalette}
                  />
                )}
                wrapperStyle={{
                  position: "absolute",
                  right: 0,
                  margin: 0
                }}
              />
            )}
          </RechartsPieChart>
        </RechartsResponsiveContainer>
      </Row>
    </Column>
  );
};