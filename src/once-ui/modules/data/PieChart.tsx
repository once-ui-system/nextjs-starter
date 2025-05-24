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
  blur?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showLegend?: boolean;
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
  blur = false,
  border,
  title,
  description,
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
  const colorPalette = defaultColors.map((c) => `var(--data-${c})`);

  const gradientIds = data.map((_, index) => 
    `pieGradient-${Math.random().toString(36).substring(2, 9)}-${index}`
  );

  return (
    <Column
      fillWidth
      height={24}
      data-viz="categorical"
      radius={radius}
      border={border}
      background={background}
      {...flexProps}
    >
      <Column fillWidth>
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
      <Row padding={title ? "s" : "2"} fill>
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
                    <stop offset="25%" stopColor={baseColor} stopOpacity={0.5} />
                    <stop offset="40%" stopColor={baseColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={baseColor} stopOpacity={0.05} />
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
              content={props => <Tooltip {...props} showColors={true} />}
            />
            {showLegend && (
              <RechartsLegend
                verticalAlign="bottom"
                layout="horizontal"
                wrapperStyle={{ paddingTop: 16 }}
              />
            )}
          </RechartsPieChart>
        </RechartsResponsiveContainer>
      </Row>
    </Column>
  );
};