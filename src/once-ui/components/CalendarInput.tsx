// CalendarInput.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input, Calendar, DropdownWrapper, Flex } from ".";

interface CalendarInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  id: string;
  label: string;
  value?: Date;
  onChange?: (date: Date) => void;
  error?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showTime?: boolean;
}

const formatDate = (date: Date, showTime: boolean) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  };

  return date.toLocaleString('en-US', options);
};

export const CalendarInput: React.FC<CalendarInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  className,
  style,
  showTime = false,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    value ? formatDate(value, showTime) : ""
  );

  useEffect(() => {
    if (value) {
      setInputValue(formatDate(value, showTime));
    }
  }, [value, showTime]);

  const handleDateChange = useCallback((date: Date) => {
    setInputValue(formatDate(date, showTime));
    onChange?.(date);
    if (!showTime) {
      setIsOpen(false);
    }
  }, [onChange, showTime]);

  const handleInputClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  const trigger = (
    <Input
      className="cursor-pointer"
      style={{ textOverflow: "ellipsis" }}
      id={id}
      label={label}
      value={inputValue}
      error={error}
      readOnly
      onClick={handleInputClick}
      {...rest}
    />
  );

  const dropdown = (
    <Flex padding="20">
      <Calendar
        value={value}
        onChange={handleDateChange}
        showTime={showTime}
      />
    </Flex>
  );

  return (
    <DropdownWrapper
      trigger={trigger}
      dropdown={dropdown}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className={className}
      style={{...style}}
    />
  );
};
