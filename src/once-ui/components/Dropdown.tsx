"use client";

import React, {
  ReactNode,
  forwardRef,
  HTMLAttributes,
  SyntheticEvent,
} from "react";
import classNames from "classnames";
import { Flex } from ".";
import styles from "./Dropdown.module.scss";

interface DropdownProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  selectedOption?: string;
  className?: string;
  children?: ReactNode;
  onEscape?: () => void;
  onSelect?: (event: string) => void;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      selectedOption,
      className,
      children,
      onEscape,
      onSelect,
      ...props
    }, ref) => {

    const handleSelect = (event: SyntheticEvent<HTMLDivElement>) => {
      const value = event.currentTarget.getAttribute('data-value'); 
      if (onSelect && value) {
        onSelect(value);
      }
    };

    return (
      <Flex
        flex={1}
        overflowY="auto"
        direction="column"
        padding="4"
        border="neutral-medium"
        borderStyle="solid-1"
        radius="m-4"
        background="surface"
        gap="2"
        minWidth={12}
        className={classNames(styles.dropdown, className || "")}
        tabIndex={0}
        ref={ref}
        role="listbox"
        onClick={handleSelect}
        {...props}
      >
        {children}
      </Flex>
    );
  },
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
export type { DropdownProps };
