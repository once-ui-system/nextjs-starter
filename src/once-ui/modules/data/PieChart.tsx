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
import { Tooltip, Legend } from "../";
import { ChartHeader } from "./ChartHeader";
import { RadialGradient } from "./Gradient";
import { schemes } from "@/once-ui/types";
import { styles } from "@/app/resources/data.config";
import { ChartStatus } from "./ChartStatus";
import { ChartProps, ChartStyles } from "./interfaces";

interface PieChartProps extends ChartProps {
  ring?: { inner: number; outer: number; };
  dataKey?: string;
  nameKey?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  title,
  description,
  data,
  series,
  date,
  emptyState,
  loading = false,
  legend = { display: true, position: "bottom-center" },
  border = "neutral-medium",
  variant = styles.variant,
  ring = { inner: 0, outer: 80 },
  dataKey = "value",
  nameKey = "name",
  ...flex
}) => {
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

  const colorPalette = schemes.map((c) => `var(--data-${c})`);
  
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

  const getGradientId = React.useCallback((index: number): string => {
    return `pieGradient-${index}`;
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
                {filteredData.map((entry, index) => {
                  const colorKey = entry.color || schemes[index % schemes.length];
                  const baseColor = `var(--data-${colorKey})`;
                  const gradientId = getGradientId(index);
                  return (
                    <RadialGradient
                      id={gradientId}
                      key={`gradient-${index}`}
                      color={baseColor}
                    />
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
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={ring.inner + "%"}
                outerRadius={ring.outer + "%"}
                dataKey={dataKey}
                nameKey={nameKey}
                stroke="none"
              >
                {filteredData.map((entry, index) => {
                  const colorKey = entry.color || schemes[index % schemes.length];
                  const baseColor = `var(--data-${colorKey})`;
                  const gradientId = getGradientId(index);
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
                content={props => <Tooltip showColors={false} variant={variant as ChartStyles} {...props} />}
              />
            </RechartsPieChart>
          </RechartsResponsiveContainer>
        )}
      </Row>
    </Column>
  );
};