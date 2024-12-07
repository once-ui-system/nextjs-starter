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
  size?: "xs" | "s" | "m" | "l" | "xl";
  className?: string;
  style?: React.CSSProperties;
}

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({ id, value, onChange, minDate, maxDate, showTime = false, size = "m", className, style }, ref) => {
    const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
    const [selectedTime, setSelectedTime] = useState<{hours: number, minutes: number}>({
      hours: selectedDate.getHours(),
      minutes: selectedDate.getMinutes()
    });
    const [isPM, setIsPM] = useState(selectedDate.getHours() >= 12);
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const [view, setView] = useState<'date' | 'month' | 'year'>('date');

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
      return new Date(year, month, 1).getDay();
    };

    const handleDateSelect = (day: number) => {
      const newDate = new Date(currentYear, currentMonth, day);
      // Preserve existing time when selecting new date
      newDate.setHours(selectedTime.hours);
      newDate.setMinutes(selectedTime.minutes);
      setSelectedDate(newDate);
      onChange?.(newDate);
    };

    const convert24to12 = (hour24: number) => {
      if (hour24 === 0) return 12;
      if (hour24 > 12) return hour24 - 12;
      return hour24;
    };

    const handleTimeChange = (newHours: number, newMinutes: number, newIsPM?: boolean) => {
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
        minutes: newMinutes
      });
      setIsPM(pmState);

      // Create new date combining selected date and time
      const newDate = new Date(selectedDate);
      newDate.setHours(hour24);
      newDate.setMinutes(newMinutes);
      onChange?.(newDate);
    };

    const renderCalendarGrid = () => {
      const daysInMonth = getDaysInMonth(currentMonth, currentYear);
      const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const isSelected = 
          selectedDate.getDate() === day && 
          selectedDate.getMonth() === currentMonth && 
          selectedDate.getFullYear() === currentYear;

        days.push(
          <Button
            key={day}
            size="s"
            onClick={() => handleDateSelect(day)}
            className={styles.dayButton}
          >
            {day}
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
        <Text variant="label-default-m" onBackground="neutral-medium">:</Text>
        <input
          type="number"
          min={0}
          max={59}
          value={selectedTime.minutes.toString().padStart(2, '0')}
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
            { value: 'AM', label: 'AM' },
            { value: 'PM', label: 'PM' }
          ]}
          selected={isPM ? 'PM' : 'AM'}
          onToggle={(value) => handleTimeChange(selectedTime.hours, selectedTime.minutes, value === 'PM')}
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
        gap={size} // Using Once UI's responsive gap system
        padding={size} // Using Once UI's responsive padding system
        background="surface"
        border="neutral-medium"
        borderStyle="solid-1"
        radius="m"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <IconButton
           className={styles.monthButton}
            variant="ghost"
            size={size === "xl" ? "l" : size === "l" ? "m" : "s"}
            icon="chevronLeft"
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
          />
          <Text 
            variant={`label-default-${size}`}
            onBackground="neutral-strong"
          >
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <IconButton
          className={styles.monthButton}
            variant="ghost"
            size={size === "xl" ? "l" : size === "l" ? "m" : "s"}
            icon="chevronRight"
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
          />
        </Flex>

        <Grid columns="repeat(7, 1fr)" gap={size === "xl" ? "12" : size === "l" ? "8" : "4"}>
          {dayNames.map(day => (
            <Text
              key={day}
              variant={`label-default-${size === "xl" || size === "l" ? "m" : "s"}`}
              onBackground="neutral-weak"
              style={{ textAlign: 'center' }}
            >
              {day}
            </Text>
          ))}
          {renderCalendarGrid()}
        </Grid>

        {showTime && (
          <Flex direction="column" gap="4">
            <Text 
              variant={`label-default-${size}`} 
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
  }
);

Calendar.displayName = "Calendar";

export { Calendar };
export type { CalendarProps };