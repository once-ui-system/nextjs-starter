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
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const selectRef = useRef<HTMLDivElement | null>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const optionsArray = React.Children.toArray(options);

    const handleFocus = () => {
      setIsFocused(true);
      setIsDropdownOpen(true);
    };

    const handleBlur = (event: FocusEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.relatedTarget as Node)
      ) {
        setIsDropdownOpen(false);
      }
      setIsFocused(false);
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
              prevIndex === null || prevIndex === optionsArray.length - 1
                ? 0
                : prevIndex + 1;
            optionRefs.current[newIndex]?.focus();
            optionRefs.current[newIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
            return newIndex;
          });
          break;

        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prevIndex) => {
            const newIndex =
              prevIndex === null || prevIndex === 0
                ? optionsArray.length - 1
                : prevIndex - 1;
            optionRefs.current[newIndex]?.focus();
            optionRefs.current[newIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
            return newIndex;
          });
          break;

        case "Enter":
          event.preventDefault();
          if (highlightedIndex !== null && isDropdownOpen) {
            const selectedOption = optionsArray[highlightedIndex] as React.ReactElement;
            if (selectedOption?.props?.value) {
              handleSelect(selectedOption.props.value);
            }
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
        trigger={
          <Input
            {...inputProps}
            style={{ cursor: "pointer", textOverflow: "ellipsis", ...style }}
            value={value}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            readOnly
            className={classNames({
              [inputStyles.filled]: isFilled,
              [inputStyles.focused]: isFocused,
            })}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          />
        }
        dropdown={
          optionsArray.map((child, index) => {
            if (!React.isValidElement(child)) return null;

            return React.cloneElement(child as React.ReactElement, {
              ref: (el: HTMLDivElement | null) => (optionRefs.current[index] = el),
              tabIndex: highlightedIndex === index ? 0 : -1,
              role: "option",
              "aria-selected": highlightedIndex === index,
              style: {
                background: highlightedIndex === index ? "var(--neutral-alpha-weak)" : "transparent",
              },
              onClick: () => handleSelect(child.props.value),
              onMouseEnter: () => setHighlightedIndex(index),
            });
          })
        }
      />
    );
  }
);

Select.displayName = "Select";

export { Select };