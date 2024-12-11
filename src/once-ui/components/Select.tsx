"use client";

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import classNames from "classnames";
import { DropdownWrapper, Input, InputProps } from ".";
import inputStyles from "./Input.module.scss";

interface SelectProps extends Omit<InputProps, "onSelect" | "value"> {
  options: React.ReactNode;
  value: string;
  style?: React.CSSProperties;
  onSelect?: (value: string) => void;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, style, onSelect, ...inputProps }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!value);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement | null>(null);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setIsDropdownOpen(true);
      if (inputProps.onFocus) inputProps.onFocus(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setIsDropdownOpen(false);
      if (inputProps.onBlur) inputProps.onBlur(event);
    };

    const handleSelect = (value: string) => {
      if (onSelect) onSelect(value);
      setIsDropdownOpen(false);
      setIsFilled(true);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <DropdownWrapper
        ref={(node) => {
          selectRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        trigger={
          <Input
            {...inputProps}
            style={{ cursor: "pointer", textOverflow: "ellipsis", ...style }}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly
            className={classNames({
              [inputStyles.filled]: isFilled,
              [inputStyles.focused]: isFocused,
            })}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          />
        }
        dropdown={options}
      />
    );
  }
);

Select.displayName = "Select";

export { Select };