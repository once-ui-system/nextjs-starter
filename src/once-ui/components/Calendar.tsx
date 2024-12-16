"use client";

import React, { useState, forwardRef, useEffect } from "react";
import classNames from "classnames";
import { Flex, Text, Button, Grid, SegmentedControl, IconButton } from ".";
import styles from "./Calendar.module.scss";

interface CalendarProps {
  id: string;
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
  size?: "s" | "m" | "l";
  className?: string;
  style?: React.CSSProperties;
}

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    { value, onChange, showTime = false, size = "m", className, style },
    ref,
  ) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
    const [selectedTime, setSelectedTime] = useState<{
      hours: number;
      minutes: number;
    }>({
      hours: value?.getHours() ?? new Date().getHours(),
      minutes: value?.getMinutes() ?? new Date().getMinutes(),
    });
    const [isPM, setIsPM] = useState((value?.getHours() ?? new Date().getHours()) >= 12);
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? today.getMonth());
    const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? today.getFullYear());

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

    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
      return new Date(year, month, 1).getDay();
    };

    const handleDateSelect = (date: Date) => {
      const newDate = new Date(date);
      if (showTime && selectedDate) {
        newDate.setHours(selectedTime.hours);
        newDate.setMinutes(selectedTime.minutes);
      }
      setSelectedDate(newDate);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
      onChange?.(newDate);
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
      newHours: number,
      newMinutes: number,
      newIsPM?: boolean,
    ) => {
      const pmState = newIsPM ?? isPM;
      let hour24 = newHours;

      if (pmState && newHours < 12) {
        hour24 = newHours + 12;
      } else if (!pmState && newHours === 12) {
        hour24 = 0;
      } else if (!pmState && newHours > 12) {
        hour24 = newHours % 12;
      }

      // Update time state separately
      setSelectedTime({
        hours: hour24,
        minutes: newMinutes,
      });
      setIsPM(pmState);

      // Create new date combining selected date and time
      const newDate = new Date(selectedDate ?? new Date());
      newDate.setHours(hour24);
      newDate.setMinutes(newMinutes);
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

    const renderTimeSelector = () => (
      <Flex gap="8" alignItems="center" className={styles.timeSelector}>
        <input
          type="number"
          min={1}
          max={12}
          value={convert24to12(selectedTime.hours)}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 1 && value <= 12) {
              handleTimeChange(value, selectedTime.minutes);
            }
          }}
          onBlur={(e) => {
            const value = parseInt(e.target.value);
            if (isNaN(value) || value < 1) {
              handleTimeChange(1, selectedTime.minutes);
            } else if (value > 12) {
              handleTimeChange(12, selectedTime.minutes);
            }
          }}
          className={styles.timeInput}
          aria-label="Hours"
        />
        <Text variant="label-default-m" onBackground="neutral-medium">
          :
        </Text>
        <input
          type="number"
          min={0}
          max={59}
          value={selectedTime.minutes.toString().padStart(2, "0")}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 59) {
              handleTimeChange(selectedTime.hours, value);
            }
          }}
          onBlur={(e) => {
            const value = parseInt(e.target.value);
            if (isNaN(value) || value < 0) {
              handleTimeChange(selectedTime.hours, 0);
            } else if (value > 59) {
              handleTimeChange(selectedTime.hours, 59);
            }
          }}
          className={styles.timeInput}
          aria-label="Minutes"
        />
        <SegmentedControl
          buttons={[
            { value: "AM", label: "AM" },
            { value: "PM", label: "PM" },
          ]}
          selected={isPM ? "PM" : "AM"}
          onToggle={(value) =>
            handleTimeChange(
              selectedTime.hours,
              selectedTime.minutes,
              value === "PM",
            )
          }
          className={styles.ampmSelector}
        />
      </Flex>
    );

    return (
      <Flex
        ref={ref}
        direction="column"
        className={classNames(styles.calendar, styles[size], className)}
        style={style}
        gap={size}
      >
        <Flex justifyContent="space-between" alignItems="center" paddingBottom="16">
          <IconButton
            variant="tertiary"
            size={size === "l" ? "l" : "m"}
            icon="chevronLeft"
            onClick={() => handleMonthChange(-1)}
          />
          <Text variant={`label-default-${size}`} onBackground="neutral-strong">
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <IconButton
            variant="tertiary"
            size={size === "l" ? "l" : "m"}
            icon="chevronRight"
            onClick={() => handleMonthChange(1)}
          />
        </Flex>

        <Grid columns="repeat(7, 1fr)" gap={size === "l" ? "8" : "4"}>
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

        {showTime && (
          <Flex direction="column" gap="4">
            <Text
              variant="label-default-m"
              onBackground="neutral-weak"
              paddingLeft="2"
            >
              Time
            </Text>
            {renderTimeSelector()}
          </Flex>
        )}
      </Flex>
    );
  },
);

Calendar.displayName = "Calendar";

export { Calendar };
export type { CalendarProps };
