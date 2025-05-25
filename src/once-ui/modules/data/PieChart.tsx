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
import { Column, Flex, Row } from "../../components";
import { Tooltip, Legend } from "../";
import { ChartHeader } from "./ChartHeader";
import { RadialGradient } from "./Gradient";

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
        <ChartHeader
          title={title}
          description={description}
          border={border}
        />
      )}
      <Row fill>
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <defs>
              {data.map((entry, index) => {
                const baseColor = entry.color || colorPalette[index % colorPalette.length];
                return (
                  <RadialGradient
                    id={gradientIds[index]}
                    key={`gradient-${index}`}
                    color={baseColor}
                  />
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
              content={props => <Tooltip showColors={false} {...props} />}
            />
            {legend && (
              <RechartsLegend
                content={(props) => (
                  <Legend
                    {...props}
                    labels="both"
                    position="bottom"
                    colors={colorPalette}
                  />
                )}
                wrapperStyle={{
                  position: "relative",
                  bottom: "12px",
                }}
              />
            )}
          </RechartsPieChart>
        </RechartsResponsiveContainer>
      </Row>
    </Column>
  );
};