"use client";

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import classNames from "classnames";
import { DropdownWrapper, Input, InputProps, Option } from ".";
import inputStyles from "./Input.module.scss";

interface SelectOptionType {
  label: React.ReactNode;
  value: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  description?: React.ReactNode;
  danger?: boolean;
  onClick?: (value: string) => void;
}

interface SelectProps extends Omit<InputProps, "onSelect" | "value"> {
  options: SelectOptionType[];
  value?: string;
  style?: React.CSSProperties;
  onSelect?: (value: string) => void;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value = "", style, onSelect, ...inputProps }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!value);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(() => {
      if (!options?.length || !value) return null;
      return options.findIndex((option) => option.value === value);
    });
    const selectRef = useRef<HTMLDivElement | null>(null);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (event: FocusEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.relatedTarget as Node)
      ) {
        setIsFocused(false);
      }
    };

    const handleSelect = (value: string) => {
      if (onSelect) onSelect(value);
      setIsDropdownOpen(false);
      setIsFilled(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isFocused && event.key !== "Enter") return;

      switch (event.key) {
        case "ArrowDown":
          if (!isDropdownOpen) {
            setIsDropdownOpen(true);
            break;
          }
          event.preventDefault();
          setHighlightedIndex((prevIndex) => {
            const newIndex =
              prevIndex === null || prevIndex === options.length - 1
                ? 0
                : prevIndex + 1;
            return newIndex;
          });
          break;

        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prevIndex) => {
            const newIndex =
              prevIndex === null || prevIndex === 0
                ? options.length - 1
                : prevIndex - 1;
            return newIndex;
          });
          break;

        case "Enter":
          event.preventDefault();
          if (highlightedIndex !== null && isDropdownOpen) {
            handleSelect(options[highlightedIndex].value);
          } else {
            setIsDropdownOpen(true);
          }
          break;

        case "Escape":
          event.preventDefault();
          setIsDropdownOpen(false);
          break;

        default:
          break;
      }
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

      const handleFocusOut = (event: FocusEvent) => {
        handleBlur(event);
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("focusout", handleFocusOut);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("focusout", handleFocusOut);
      };
    }, []);

    return (
      <DropdownWrapper
        ref={(node) => {
          selectRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        trigger={
          <Input
            {...inputProps}
            style={{ cursor: "pointer", textOverflow: "ellipsis", ...style }}
            value={value}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            readOnly
            className={classNames("cursor-interactive", {
              [inputStyles.filled]: isFilled,
              [inputStyles.focused]: isFocused,
            })}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          />
        }
        dropdown={
          options.map((option, index) => (
            <Option
              key={option.value}
              value={option.value}
              label={option.label}
              hasPrefix={option.prefixIcon}
              hasSuffix={option.suffixIcon}
              description={option.description}
              danger={option.danger}
              onClick={() => {
                option.onClick?.(option.value);
                handleSelect(option.value);
              }}
              selected={option.value === value}
            />
          ))
        }
      />
    );
  }
);

Select.displayName = "Select";

export { Select };