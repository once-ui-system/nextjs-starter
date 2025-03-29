import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./PieChart.module.scss";
import { Flex, Heading } from ".";

interface DataPoint {
  name: string;
  value: number;
  color?: string; // Optional custom color for this slice
}

interface PieChartProps extends React.ComponentProps<typeof Flex> {
  data: DataPoint[];
  /**
   * Color variants for pie slices (will cycle through these)
   * @default ["info", "success", "danger", "purple"]
   */
  colorVariants?: ("info" | "success" | "danger" | "purple")[];
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
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Flex className={styles.tooltip} minWidth={8} background="surface" border="neutral-alpha-medium" direction="column">
        <Flex
          borderBottom="neutral-alpha-medium"
          fillWidth
          horizontal="center"
          padding="8"
        >
          <p className={styles.label}>{payload[0].name}</p>
        </Flex>
        <Flex padding="s" direction="column">
          <p
            className={styles.value}
            style={{ color: payload[0].fill }}
          >
            {`Value: ${payload[0].value}`}
          </p>
        </Flex>
      </Flex>
    );
  }
  return null;
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  colorVariants = ["info", "success", "danger", "purple"],
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
  const colorMap = {
    info: "var(--info-solid-strong)",
    success: "var(--success-solid-strong)",
    danger: "var(--danger-solid-strong)",
    purple: "#6c5ce7"
  };

  // Generate unique IDs for each gradient
  const gradientIds = data.map((_, index) => 
    `pieGradient-${Math.random().toString(36).substring(2, 9)}-${index}`
  );

  return (
    <Flex
      fill
      radius={radius}
      border={border}
      align="center"
      direction="column"
      vertical="center"
      background={background}
      className={blur ? styles.blur : undefined}
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
                const baseColor = entry.color || colorMap[colorVariants[index % colorVariants.length]];
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
                const baseColor = entry.color || colorMap[colorVariants[index % colorVariants.length]];
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
              wrapperClassName={styles.tooltipWrapper}
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