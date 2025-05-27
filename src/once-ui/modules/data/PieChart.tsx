"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend
} from "recharts";
import { Column, Row, DateRange } from "../../components";
import { ChartProps, ChartStyles, ChartStatus, RadialGradient, Tooltip, Legend, ChartHeader } from ".";
import { getDistributedColor } from "./utils/colorDistribution";
import { styles } from "@/app/resources/data.config";
import { schemes } from "@/once-ui/types";

interface PieChartProps extends ChartProps {
  ring?: { inner: number; outer: number; };
  dataKey?: string;
  nameKey?: string;
  origo?: { x: number; y: number; };
}

export const PieChart: React.FC<PieChartProps> = ({
  title,
  description,
  data,
  series,
  date,
  emptyState,
  origo = { x: 50, y: 50 },
  loading = false,
  legend: legendProp = {},
  border = "neutral-medium",
  variant = styles.variant,
  ring = { inner: 0, outer: 80 },
  dataKey = "value",
  nameKey = "name",
  ...flex
}) => {
  const legend = {
    display: legendProp.display !== undefined ? legendProp.display : true,
    position: legendProp.position || "bottom-center",
    direction: legendProp.direction
  };
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(
    date?.start && date?.end ? {
      startDate: date.start,
      endDate: date.end
    } : undefined
  );

  useEffect(() => {
    if (date?.start && date?.end) {
      setSelectedDateRange({
        startDate: date.start,
        endDate: date.end
      });
    }
  }, [date?.start, date?.end]);

  const handleDateRangeChange = (newRange: DateRange) => {
    setSelectedDateRange(newRange);
    if (date?.onChange) {
      date.onChange(newRange);
    }
  };

  const colorPalette = React.useMemo(() => {
    if (!data || data.length === 0) return schemes.map((c) => `var(--data-${c})`);
    
    return Array.from({ length: data.length }, (_, index) => {
      const colorKey = getDistributedColor(index, data.length);
      return `var(--data-${colorKey})`;
    });
  }, [data]);
  
  const filteredData = React.useMemo(() => {
    if (!selectedDateRange || !data || data.length === 0) {
      return data;
    }

    return data.filter(item => {
      try {
        if (!item.date || !selectedDateRange.startDate || !selectedDateRange.endDate) {
          return true;
        }
        
        const itemDate = typeof item.date === 'string' ? new Date(item.date) : item.date;
        
        return itemDate >= selectedDateRange.startDate && 
               itemDate <= selectedDateRange.endDate;
      } catch (e) {
        return true;
      }
    });
  }, [data, selectedDateRange]);

  const getGradientId = React.useCallback((colorKey: string | number | Date): string => {
    return `pieGradient-${String(colorKey)}`;
  }, []);

  return (
    <Column
      fillWidth
      height={styles.height}
      data-viz={styles.mode}
      border={border}
      radius="l"
      {...flex}
    >
      <ChartHeader
        title={title}
        description={description}
        borderBottom={border}
        dateRange={selectedDateRange}
        date={date}
        onDateRangeChange={handleDateRangeChange}
        presets={date?.presets}
      />
      <Row fill>
        <ChartStatus 
          loading={loading}
          isEmpty={!filteredData || filteredData.length === 0}
          emptyState={emptyState}
        />
        {!loading && filteredData && filteredData.length > 0 && (
          <RechartsResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <defs>
                <pattern id="pieChartMasterPattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
                  <RadialGradient
                    id="pieChartMasterGradient"
                    color="var(--page-background)"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                    stops={[
                      { offset: "0%", opacity: 0 },
                      { offset: "100%", opacity: 1 }
                    ]}
                  />
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#pieChartMasterGradient)" />
                </pattern>
                
                {Array.from(new Set(filteredData.map((entry, index) => {
                  return entry.color || getDistributedColor(index, filteredData.length);
                }))).map((colorKey) => {
                  const baseColor = `var(--data-${colorKey})`;
                  const patternId = getGradientId(colorKey as string);
                  return (
                    <pattern 
                      id={patternId} 
                      key={`pattern-${colorKey}`}
                      patternUnits="userSpaceOnUse" 
                      width="100%" 
                      height="100%"
                    >
                      <rect x="0" y="0" width="100%" height="100%" fill={baseColor} />
                      <rect x="0" y="0" width="100%" height="100%" fill="url(#pieChartMasterPattern)" />
                    </pattern>
                  );
                })}
              </defs>
              {legend.display && (
                <RechartsLegend
                  content={(props) => (
                    <Legend
                      {...props}
                      variant={variant as ChartStyles}
                      position={legend.position}
                      direction={legend.direction}
                      labels="none"
                      colors={colorPalette}
                    />
                  )}
                  wrapperStyle={{
                    position: 'absolute',
                    top: (legend.position === "top-center" || legend.position === "top-left" || legend.position === "top-right") ? 0 : undefined,
                    bottom: (legend.position === "bottom-center" || legend.position === "bottom-left" || legend.position === "bottom-right") ? 0 : undefined,
                    right: 0,
                    left: 0,
                    margin: 0
                  }}
                />
              )}
              <RechartsPie
                data={filteredData}
                cx={origo.x + "%"}
                cy={origo.y + "%"}
                labelLine={false}
                innerRadius={ring.inner + "%"}
                outerRadius={ring.outer + "%"}
                dataKey={dataKey}
                nameKey={nameKey}
                stroke="none"
              >
                {filteredData.map((entry, index) => {
                  const colorKey = entry.color || getDistributedColor(index, filteredData.length);
                  const baseColor = `var(--data-${colorKey})`;
                  const gradientId = getGradientId(String(colorKey));
                  return (
                    <RechartsCell 
                      key={`cell-${index}`} 
                      fill={`url(#${gradientId})`} 
                      strokeWidth={1}
                      stroke={baseColor}
                    />
                  );
                })}
              </RechartsPie>
              <RechartsTooltip 
                content={(props) => {
                  if (props.payload && props.payload.length > 0) {
                    const entry = props.payload[0];
                    const index = filteredData.findIndex(item => item[nameKey] === entry.name);
                    const colorKey = filteredData[index]?.color || getDistributedColor(index, filteredData.length);
                    const color = `var(--data-${colorKey})`;
                    
                    props.payload[0].color = color;
                  }
                  return (
                    <Tooltip
                      {...props}
                      date={date}
                      variant={variant as ChartStyles}
                    />
                  );
                }}
              />
            </RechartsPieChart>
          </RechartsResponsiveContainer>
        )}
      </Row>
    </Column>
  );
};