"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  useFloating,
  shift,
  offset,
  flip,
  size,
  autoUpdate,
} from "@floating-ui/react-dom";
import { Flex, Dropdown } from ".";
import styles from "./DropdownWrapper.module.scss";
import classNames from "classnames";

interface DropdownWrapperProps {
  trigger: ReactNode;
  dropdown: ReactNode;
  selectedOption?: string;
  style?: React.CSSProperties;
  className?: string;
  onSelect?: (value: string) => void;
}

const DropdownWrapper = forwardRef<HTMLDivElement, DropdownWrapperProps>(
  ({ trigger, dropdown, selectedOption, style, className, onSelect }, ref) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const { x, y, strategy, refs, update } = useFloating({
      placement: "bottom-start",
      middleware: [
        offset(4),
        flip(),
        shift(),
        size({
          apply({ availableWidth, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              maxWidth: `${availableWidth}px`,
              minHeight: `${availableHeight}px`,
              maxHeight: `${availableHeight}px`,
            });
          },
        }),
      ],
      whileElementsMounted: autoUpdate,
    });

    useImperativeHandle(ref, () => wrapperRef.current as HTMLDivElement);

    useEffect(() => {
      if (wrapperRef.current) {
        refs.setReference(wrapperRef.current);
      }
    }, [refs]);

    useEffect(() => {
      if (isDropdownOpen) {
        update();

        if (dropdownRef.current && selectedOption) {
          const selectedElement = dropdownRef.current.querySelector(
            `[data-value="${selectedOption}"]`,
          );
          if (selectedElement) {
            selectedElement.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });
          }
        }
      }
    }, [isDropdownOpen, update, selectedOption]);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.relatedTarget as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      wrapperRef.current?.addEventListener("focusout", handleFocusOut);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        wrapperRef.current?.removeEventListener("focusout", handleFocusOut);
      };
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          setDropdownOpen(false);
          break;
        case "Enter":
          if (dropdownRef.current) {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.getAttribute('role') === 'option') {
              const value = activeElement.getAttribute('data-value');
              if (value && onSelect) {
                event.preventDefault();
                onSelect(value);
                setDropdownOpen(false);
              }
            } else {
              setDropdownOpen((prev) => !prev);
            }
          }
          break;
        case "ArrowDown":
        case "ArrowUp":
          event.preventDefault();
          if (dropdownRef.current) {
            const items = Array.from(
              dropdownRef.current.querySelectorAll('[role="option"]'),
            );
            const currentIndex = items.findIndex((item) =>
              item === document.activeElement,
            );
            const nextIndex =
              event.key === "ArrowDown"
                ? (currentIndex + 1) % items.length
                : (currentIndex - 1 + items.length) % items.length;
            (items[nextIndex] as HTMLElement)?.focus();
          }
          break;
      }
    };

    return (
      <Flex
        style={{
          WebkitTapHighlightColor: "transparent",
          ...style,
        }}
        className={className}
        position="relative"
        ref={wrapperRef}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
      >
        {trigger}
        {isDropdownOpen && (
          <Flex
            zIndex={1}
            className={classNames(styles.dropdown, styles.fadeIn)}
            ref={dropdownRef}
            style={{
              minWidth: "100%",
              position: strategy,
              top: Math.round(y) + "px",
              left: Math.round(x) + "px",
            }}
            role="listbox"
          >
            <Dropdown
              ref={dropdownRef}
              selectedOption={selectedOption}
              onSelect={onSelect}
            >
              {dropdown}
            </Dropdown>
          </Flex>
        )}
      </Flex>
    );
  },
);

DropdownWrapper.displayName = "DropdownWrapper";
export { DropdownWrapper };