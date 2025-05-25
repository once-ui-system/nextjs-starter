"use client";

import React, { useState, useEffect } from "react";
import moment from 'moment';
import { Column, Text, Row, DateRange, DateRangePicker, DropdownWrapper, IconButton, Button, ToggleButton } from "../../components";
import { DateConfig } from "./interfaces";

interface ChartHeaderProps extends Omit<React.ComponentProps<typeof Column>, 'title' | 'description'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  dateRange?: DateRange;
  date?: DateConfig;
  onDateRangeChange?: (range: DateRange) => void;
  presets?: boolean;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title,
  description,
  dateRange,
  date,
  onDateRangeChange,
  presets = true,
  ...flex
}) => {
  if (!title && !description && !dateRange && !date) {
    return null;
  }
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  type DateRangePreset = {
    getRange: () => DateRange;
  };

  type PresetName = 'This year' | 'This month' | 'This week' | 'Last year' | 'Last month' | 'Last week';

  const dateRangePresets: Record<PresetName, DateRangePreset> = {
    'This year': {
      getRange: () => ({
        startDate: moment().startOf('year').toDate(),
        endDate: moment().endOf('year').toDate()
      })
    },
    'This month': {
      getRange: () => ({
        startDate: moment().startOf('month').toDate(),
        endDate: moment().endOf('month').toDate()
      })
    },
    'This week': {
      getRange: () => ({
        startDate: moment().startOf('week').toDate(),
        endDate: moment().endOf('week').toDate()
      })
    },
    'Last year': {
      getRange: () => ({
        startDate: moment().subtract(1, 'year').startOf('year').toDate(),
        endDate: moment().subtract(1, 'year').endOf('year').toDate()
      })
    },
    'Last month': {
      getRange: () => ({
        startDate: moment().subtract(1, 'month').startOf('month').toDate(),
        endDate: moment().subtract(1, 'month').endOf('month').toDate()
      })
    },
    'Last week': {
      getRange: () => ({
        startDate: moment().subtract(1, 'week').startOf('week').toDate(),
        endDate: moment().subtract(1, 'week').endOf('week').toDate()
      })
    }
  };

  useEffect(() => {
    if (dateRange) {
      const matchingPreset = Object.entries(dateRangePresets).find(([name, preset]) => {
        const presetRange = preset.getRange();
        return (
          moment(dateRange.startDate).isSame(moment(presetRange.startDate), 'day') &&
          moment(dateRange.endDate).isSame(moment(presetRange.endDate), 'day')
        );
      });
      
      setSelectedPreset(matchingPreset ? matchingPreset[0] : null);
    } else {
      setSelectedPreset(null);
    }
  }, [dateRange]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dateRangeOpen) {
        setDateRangeOpen(false);
      }
    };

    if (dateRangeOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [dateRangeOpen]);

  const handleDateRangeChange = (newRange: DateRange) => {
    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    }
  };

  const handlePresetClick = (presetName: PresetName) => {
    const newRange = dateRangePresets[presetName].getRange();
    setSelectedPreset(presetName);
    handleDateRangeChange(newRange);
  };

  return (
    <Column fillWidth paddingX="20" paddingY="12" gap="4" {...flex}>
      <Row fillWidth vertical="center">
        <Column fillWidth gap="4">
          {title && (
            <Text variant="heading-strong-xs">
              {title}
            </Text>
          )}
          {description && (
            <Text variant="label-default-s" onBackground="neutral-weak">
              {description}
            </Text>
          )}
        </Column>
        {dateRange && (
          <DropdownWrapper
            isOpen={dateRangeOpen}
            onOpenChange={(isOpen) => setDateRangeOpen(isOpen)}
            trigger={
              <IconButton
                icon="calendar"
                onClick={() => setDateRangeOpen(!dateRangeOpen)}
                variant="secondary"
                size="m"
              />
            }
            dropdown={
              <Row padding="4" mobileDirection="column">
                {presets && (
                  <Column mobileDirection="row" padding="4" gap="2" minWidth={8} border="neutral-alpha-weak" radius="m" overflowX="scroll">
                    {(Object.keys(dateRangePresets) as PresetName[]).map((presetName) => (
                      <ToggleButton 
                        key={presetName}
                        style={{ paddingLeft: "0.25rem" }} 
                        fillWidth 
                        horizontal="start"
                        selected={selectedPreset === presetName}
                        onClick={() => handlePresetClick(presetName)}
                      >
                        {presetName}
                      </ToggleButton>
                    ))}
                  </Column>
                )}
                <DateRangePicker
                  size="s"
                  padding="16"
                  gap="24"
                  id="chart-date-range"
                  maxDate={date?.max}
                  minDate={date?.min}
                  dual={date?.dual}
                  value={dateRange}
                  onChange={handleDateRangeChange}
                />
              </Row>
            }
          />
        )}
      </Row>
    </Column>
  );
};

export type { ChartHeaderProps };
