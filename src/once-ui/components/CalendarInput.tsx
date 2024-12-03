// CalendarInput.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input, Calendar, IconButton, Flex } from '.';
import styles from './CalendarInput.module.scss';

interface CalendarInputProps {
  id: string;
  label: string;
  value?: Date;
  onChange?: (date: Date) => void;
  error?: React.ReactNode;
  className?: string;
  showTime?: boolean;
}

const formatDate = (date: Date, showTime: boolean) => {
  const dateStr = date.toLocaleDateString();
  if (!showTime) return dateStr;
  return `${dateStr} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const CalendarInput: React.FC<CalendarInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  className,
  showTime = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? formatDate(value, showTime) : '');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (date: Date) => {
    setInputValue(formatDate(date, showTime));
    onChange?.(date);
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Input
        id={id}
        label={label}
        value={inputValue}
        error={error}
        className={className}
        onFocus={() => setIsOpen(true)}
        hasSuffix={
          <IconButton
            icon="calendar"
            variant="ghost"
            size="s"
            onClick={() => setIsOpen(!isOpen)}
          />
        }
      />
      {isOpen && (
        <div className={styles.dropdown}>
          <Calendar
            id={`${id}-calendar`}
            value={value}
            onChange={handleDateChange}
            showTime={showTime}
          />
        </div>
      )}
    </div>
  );
};