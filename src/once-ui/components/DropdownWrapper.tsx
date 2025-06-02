"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useCallback,
  KeyboardEvent,
} from "react";
import {
  useFloating,
  shift,
  offset,
  flip,
  size,
  autoUpdate,
  Placement,
} from "@floating-ui/react-dom";
import { Flex, Dropdown } from ".";
import styles from "./DropdownWrapper.module.scss";

export interface DropdownWrapperProps {
  fillWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  placement?: Placement;
  trigger: ReactNode;
  dropdown: ReactNode;
  selectedOption?: string;
  style?: React.CSSProperties;
  className?: string;
  onSelect?: (value: string) => void;
  closeAfterClick?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const DropdownWrapper = forwardRef<HTMLDivElement, DropdownWrapperProps>(
  (
    {
      trigger,
      dropdown,
      selectedOption,
      minHeight,
      onSelect,
      closeAfterClick = true,
      isOpen: controlledIsOpen,
      onOpenChange,
      minWidth,
      maxWidth,
      fillWidth = false,
      placement = "bottom-start",
      className,
      style,
    },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    const handleOpenChange = useCallback(
      (newIsOpen: boolean) => {
        if (!isControlled) {
          setInternalIsOpen(newIsOpen);
        }
        onOpenChange?.(newIsOpen);
      },
      [onOpenChange, isControlled],
    );

    const { x, y, strategy, refs, update } = useFloating({
      placement: placement,
      open: isOpen,
      middleware: [
        offset(4),
        minHeight ? undefined : flip(),
        shift(),
        size({
          apply({ availableWidth, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              width: fillWidth ? "100%" : "auto",
              minWidth: minWidth ? `${minWidth}rem` : undefined,
              maxWidth: maxWidth ? `${maxWidth}rem` : `${availableWidth}px`,
              minHeight: `${Math.min(minHeight || 0)}px`,
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
    }, [refs, mounted]);

    useEffect(() => {
      if (!mounted) {
        setMounted(true);
      }
    }, [mounted]);

    useEffect(() => {
      if (isOpen && mounted) {
        requestAnimationFrame(() => {
          if (dropdownRef.current) {
            refs.setFloating(dropdownRef.current);
            update();
            // Reset focus index when opening
            setFocusedIndex(-1);

            // Set up initial keyboard navigation
            const optionElements = dropdownRef.current
              ? Array.from(
                  dropdownRef.current.querySelectorAll('.option, [role="option"], [data-value]'),
                )
              : [];

            // If we have options, highlight the first one
            if (optionElements.length > 0) {
              setFocusedIndex(0);
              optionElements.forEach((el, i) => {
                if (i === 0) {
                  (el as HTMLElement).classList.add("highlighted");
                } else {
                  (el as HTMLElement).classList.remove("highlighted");
                }
              });
            }
          }
        });
      }
    }, [isOpen, mounted, refs, update]);

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          handleOpenChange(false);
          setFocusedIndex(-1);
        }
      },
      [handleOpenChange, wrapperRef],
    );

    const handleFocusOut = useCallback(
      (event: FocusEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.relatedTarget as Node)) {
          handleOpenChange(false);
          setFocusedIndex(-1);
        }
      },
      [handleOpenChange, wrapperRef],
    );

    useEffect(() => {
      const currentWrapperRef = wrapperRef.current;

      document.addEventListener("mousedown", handleClickOutside);
      currentWrapperRef?.addEventListener("focusout", handleFocusOut);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        currentWrapperRef?.removeEventListener("focusout", handleFocusOut);
      };
    }, [handleClickOutside, handleFocusOut]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (!isOpen) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenChange(true);
          }
          return;
        }

        if (e.key === "Escape") {
          e.preventDefault();
          handleOpenChange(false);
          setFocusedIndex(-1);
          return;
        }

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();

          // Find all Option components in the dropdown
          // We need to look for the actual clickable elements inside the dropdown
          const optionElements = dropdownRef.current
            ? Array.from(
                dropdownRef.current.querySelectorAll('.option, [role="option"], [data-value]'),
              )
            : [];

          if (optionElements.length === 0) return;

          let newIndex = focusedIndex;

          if (e.key === "ArrowDown") {
            newIndex = focusedIndex < optionElements.length - 1 ? focusedIndex + 1 : 0;
          } else {
            newIndex = focusedIndex > 0 ? focusedIndex - 1 : optionElements.length - 1;
          }

          setFocusedIndex(newIndex);

          // Highlight the element visually
          optionElements.forEach((el, i) => {
            if (i === newIndex) {
              (el as HTMLElement).classList.add("highlighted");
              // Scroll into view if needed
              (el as HTMLElement).scrollIntoView({ block: "nearest" });
            } else {
              (el as HTMLElement).classList.remove("highlighted");
            }
          });
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          // Find all Option components
          const optionElements = dropdownRef.current
            ? Array.from(
                dropdownRef.current.querySelectorAll('.option, [role="option"], [data-value]'),
              )
            : [];

          // Click the focused option
          if (focusedIndex >= 0 && focusedIndex < optionElements.length) {
            (optionElements[focusedIndex] as HTMLElement).click();

            if (closeAfterClick) {
              handleOpenChange(false);
              setFocusedIndex(-1);
            }
          }
        }
      },
      [isOpen, focusedIndex, handleOpenChange, closeAfterClick],
    );

    return (
      <Flex
        fillWidth={fillWidth}
        direction="column"
        transition="macro-medium"
        style={{
          ...(minHeight && isOpen
            ? {
                marginBottom: `${minHeight + 8}px`,
              }
            : {}),
          ...style,
        }}
        className={className}
        ref={wrapperRef}
        onClick={(e) => {
          if (!isOpen) {
            handleOpenChange(true);
            return;
          }

          if (
            closeAfterClick &&
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target as Node)
          ) {
            handleOpenChange(false);
            setFocusedIndex(-1);
          }
        }}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {trigger}
        {isOpen && dropdown && (
          <Flex
            zIndex={1}
            className={styles.fadeIn}
            minWidth={minWidth}
            ref={dropdownRef}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            role="listbox"
          >
            <Dropdown
              minWidth={minWidth}
              radius="l"
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
