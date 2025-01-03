"use client";

import React, { ReactNode, forwardRef, SyntheticEvent } from "react";
import { Flex } from ".";

interface DropdownProps extends Omit<React.ComponentProps<typeof Flex>, "onSelect"> {
  selectedOption?: string;
  children?: ReactNode;
  onEscape?: () => void;
  onSelect?: (event: string) => void;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ selectedOption, className, children, onEscape, onSelect, ...rest }, ref) => {
    const handleSelect = (event: SyntheticEvent<HTMLDivElement>) => {
      const value = event.currentTarget.getAttribute("data-value");
      if (onSelect && value) {
        onSelect(value);
      }
    };

    return (
      <Flex
        flex={1}
        overflowY="auto"
        direction="column"
        border="neutral-medium"
        background="surface"
        gap="2"
        ref={ref}
        role="listbox"
        onClick={handleSelect}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
export type { DropdownProps };
