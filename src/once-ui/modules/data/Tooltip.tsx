"use client";

import React, { useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Column, Text, Row, LetterFx } from "../../components";

const ValueWithAnimation: React.FC<{ value: number }> = ({ value }) => {
  const prevValueRef = useRef<number | null>(null);
  const triggerRef = useRef<(() => void) | null>(null);
  const initialRenderRef = useRef<boolean>(true);
  
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      prevValueRef.current = value;
      return;
    }
    
    if (prevValueRef.current !== value && triggerRef.current) {
      triggerRef.current();
    }
    
    prevValueRef.current = value;
  }, [value]);
  
  return (
    <LetterFx 
      trigger="custom"
      charset={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
      onTrigger={(triggerFn) => {
        triggerRef.current = triggerFn;
      }}
    >
      {value.toLocaleString()}
    </LetterFx>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  dataKey?: string;
  tooltip?: React.ReactNode;
  isTimeSeries?: boolean;
  timeFormat?: string;
  showColors?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  dataKey = "name",
  tooltip,
  isTimeSeries = false,
  timeFormat = "MMM d",
  showColors = true
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const dataPoint = payload[0].payload;
  const displayLabel = dataPoint?.[dataKey] || label;
  
  const formattedLabel = isTimeSeries && displayLabel 
    ? formatDate(displayLabel, timeFormat) 
    : dataPoint?.label || dataPoint?.endDate || displayLabel;
    
  function formatDate(dateValue: string | Date, formatString: string) {
    try {
      const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;
      return format(date, formatString || 'MMM d');
    } catch (error) {
      return dateValue;
    }
  }

  return (
    <Column
      minWidth={8}
      gap="8"
      background="surface"
      radius="m"
      border="neutral-alpha-medium">
      <Row
        fillWidth
        paddingTop="8"
        paddingX="12"
      >
        <Text
          variant="label-default-s"
          onBackground="neutral-strong"
        >
          {formattedLabel}
        </Text>
      </Row>
      <Column
        fillWidth
        horizontal="space-between"
        paddingBottom="8"
        paddingX="12"
        gap="4">
        {payload.map((entry: any, index: number) => (
          <Row key={index} horizontal="space-between" fillWidth gap="16">
            <Row vertical="center" gap="8">
              {showColors && (
                <Row
                  style={{
                    backgroundClip: "padding-box",
                    border: `1px solid ${entry.stroke || entry.color}`,
                    background: `linear-gradient(to bottom, ${entry.stroke || entry.color} 0%, transparent 100%)`
                  }}
                  minWidth="12"
                  minHeight="12"
                  radius="xs"
                />
              )}
              <Text onBackground="neutral-weak" variant="label-default-s">
                {tooltip && index === 0 ? tooltip : entry.name}
              </Text>
            </Row>
            <Text onBackground="neutral-strong" variant="label-default-s">
              {typeof entry.value === 'number' 
                ? <ValueWithAnimation value={entry.value} /> 
                : entry.value}
            </Text>
          </Row>
        ))}
      </Column>
    </Column>
  );
};

export { Tooltip };
export type { TooltipProps };
