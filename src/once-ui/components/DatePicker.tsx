"use client";

import React, { useState, forwardRef, useEffect } from "react";
import classNames from "classnames";
import { Flex, Text, Button, Grid, SegmentedControl, IconButton, RevealFx, NumberInput } from ".";
import styles from "./DatePicker.module.scss";

export interface DatePickerProps extends Omit<React.ComponentProps<typeof Flex>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  timePicker?: boolean;
  defaultDate?: Date;
  defaultTime?: {
    hours: number;
    minutes: number;
  };
  size?: "s" | "m" | "l";
  className?: string;
  style?: React.CSSProperties;
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ 
    value, 
    onChange, 
    timePicker = false, 
    defaultDate,
    defaultTime, 
    size = "m", 
    className, 
    style, 
    ...rest 
  }, ref) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
    const [selectedTime, setSelectedTime] = useState<{
      hours: number;
      minutes: number;
    } | undefined>(defaultTime);
    const [isPM, setIsPM] = useState(defaultTime?.hours ? defaultTime.hours >= 12 : false);
    const [isTimeSelector, setIsTimeSelector] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
      setSelectedDate(value);
      if (value) {
        setCurrentMonth(value.getMonth());
        setCurrentYear(value.getFullYear());
        setSelectedTime({
          hours: value.getHours(),
          minutes: value.getMinutes(),
        });
        setIsPM(value.getHours() >= 12);
      }
    }, [value]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? today.getMonth());
    const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? today.getFullYear());

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const handleTimeToggle = (show: boolean) => {
      setIsTransitioning(false);
      setTimeout(() => {
        setTimeout(() => {
          setIsTimeSelector(show);
          setIsTransitioning(true);
        }, 400);
      }, 400);
    };

    const handleDateSelect = (date: Date) => {
      const newDate = new Date(date);
      if (timePicker && selectedDate && selectedTime) {
        newDate.setHours(selectedTime.hours);
        newDate.setMinutes(selectedTime.minutes);
      }
      setSelectedDate(newDate);
      if (timePicker) {
        handleTimeToggle(true);
      } else {
        onChange?.(newDate);
      }
    };

    const handleMonthChange = (increment: number) => {
      const newDate = new Date(currentYear, currentMonth + increment, 1);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    };

    const convert24to12 = (hour24: number) => {
      if (hour24 === 0) return 12;
      if (hour24 > 12) return hour24 - 12;
      return hour24;
    };

    const handleTimeChange = (
      hours: number,
      minutes: number,
      pm: boolean = isPM,
    ) => {
      if (!selectedDate) return;

      const newTime = {
        hours: pm ? (hours === 12 ? 12 : hours + 12) : (hours === 12 ? 0 : hours),
        minutes
      };
      setSelectedTime(newTime);
      setIsPM(pm);

      const newDate = new Date(selectedDate);
      newDate.setHours(newTime.hours);
      newDate.setMinutes(minutes);
      onChange?.(newDate);
    };

    const renderCalendarGrid = () => {
      const firstDay = new Date(
        currentYear,
        currentMonth,
        1
      ).getDay();

      const daysInMonth = new Date(
        currentYear,
        currentMonth + 1,
        0
      ).getDate();

      const daysInPrevMonth = new Date(
        currentYear,
        currentMonth,
        0
      ).getDate();

      // Calculate total number of weeks needed
      const totalDaysShown = firstDay + daysInMonth;
      const numberOfWeeks = Math.ceil(totalDaysShown / 7);
      const totalGridSpots = numberOfWeeks * 7;

      const days = [];

      // Previous month's days
      for (let i = 0; i < firstDay; i++) {
        const prevMonthDay = daysInPrevMonth - firstDay + i + 1;
        days.push(
          <Button
            style={{ 
              width: "var(--static-space-40)"
            }}
            weight="default"
            variant="tertiary"
            key={`prev-${prevMonthDay}`}
            size="m"
            disabled
          >
            {prevMonthDay}
          </Button>
        );
      }

      // Current month's days
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        const isSelected = 
          selectedDate?.getDate() === day && 
          selectedDate?.getMonth() === currentMonth && 
          selectedDate?.getFullYear() === currentYear;

        days.push(
          <Button
            style={{ 
              width: "var(--static-space-40)",
              transition: "none"
            }}
            weight={isSelected ? "strong" : "default"}
            variant={isSelected ? "primary" : "tertiary"}
            key={`current-${day}`}
            size="m"
            onClick={() => handleDateSelect(currentDate)}
          >
            {day}
          </Button>
        );
      }

      // Next month's days
      const remainingDays = totalGridSpots - days.length;

      for (let i = 1; i <= remainingDays; i++) {
        days.push(
          <Button
            style={{ 
              width: "var(--static-space-40)"
            }}
            weight="default"
            variant="tertiary"
            key={`next-${i}`}
            size="m"
            disabled
          >
            {i}
          </Button>
        );
      }

      return days;
    };

    return (
      <Flex
        ref={ref}
        className={classNames(styles.calendar, className)}
        style={style}
        direction="column"
        fillWidth
        alignItems="center"
        gap={size}
        {...rest}
      >
        <Flex fillWidth justifyContent="space-between" alignItems="center" paddingBottom="16">
          {isTimeSelector ? (
            <Flex alignItems="center" fillWidth direction="column" gap="8">
              <Text variant={`label-default-${size}`} onBackground="neutral-strong">
                {monthNames[currentMonth]} {currentYear}
              </Text>
              <Text className="cursor-interactive" variant="label-default-s" onBackground="brand-weak"
                onClick={() => handleTimeToggle(false)}
              >
                Back to calendar
              </Text>
            </Flex>
          ) : (
            <>
              <IconButton
                variant="tertiary"
                size={size === "l" ? "l" : "m"}
                icon="chevronLeft"
                onClick={() => handleMonthChange(-1)}
              />
              <Flex fillWidth direction="column" alignItems="center" gap="8">
                <Text variant={`label-default-${size}`} onBackground="neutral-strong">
                  {monthNames[currentMonth]} {currentYear}
                </Text>
                <Text variant="label-default-s" onBackground="neutral-weak">
                  {selectedTime && `${selectedTime.hours.toString().padStart(2, '0')}:${selectedTime.minutes.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`}
                </Text>
              </Flex>
              <IconButton
                variant="tertiary"
                size={size === "l" ? "l" : "m"}
                icon="chevronRight"
                onClick={() => handleMonthChange(1)}
              />
            </>
          )}
        </Flex>

        <RevealFx
          fillWidth justifyContent="center" alignItems="center"
          key={isTimeSelector ? "time" : "date"}
          trigger={isTransitioning}
          speed="fast"
        >
          {isTimeSelector ? (
            <Flex fillWidth maxWidth={24} justifyContent="center" alignItems="center" direction="column" padding="32" gap="32">
              <SegmentedControl
                buttons={[
                  { value: "AM", label: "AM" },
                  { value: "PM", label: "PM" },
                ]}
                selected={isPM ? "PM" : "AM"}
                onToggle={(value) =>
                  handleTimeChange(
                    selectedTime?.hours ?? 0,
                    selectedTime?.minutes ?? 0,
                    value === "PM",
                  )
                }
              />
              <Flex fillWidth gap="16" alignItems="center" data-scaling="110">
              <NumberInput
                id="hours"
                label="Hours"
                labelAsPlaceholder
                min={1}
                max={12}
                value={selectedTime?.hours ? convert24to12(selectedTime.hours) : 12}
                onChange={(value) => {
                  if (value >= 1 && value <= 12) {
                    handleTimeChange(value, selectedTime?.minutes ?? 0);
                  }
                }}
                aria-label="Hours"
              />
              :
              <NumberInput
                id="minutes"
                label="Minutes"
                labelAsPlaceholder
                min={0}
                max={59}
                padStart={2}
                value={selectedTime?.minutes ?? 0}
                onChange={(value) => {
                  if (value >= 0 && value <= 59) {
                    handleTimeChange(selectedTime?.hours ?? 0, value);
                  }
                }}
                aria-label="Minutes"
              />
              </Flex>
            </Flex>
          ) : (
            <Grid className="fit-width" columns="repeat(7, 1fr)" gap={size === "l" ? "8" : "4"}>
              {dayNames.map((day) => (
                <Text
                  marginBottom="16"
                  key={day}
                  variant="label-default-m"
                  onBackground="neutral-medium"
                  align="center"
                >
                  {day}
                </Text>
              ))}
              {renderCalendarGrid()}
            </Grid>
          )}
        </RevealFx>
      </Flex>
    );
  },
);

DatePicker.displayName = "DatePicker";
export { DatePicker };
