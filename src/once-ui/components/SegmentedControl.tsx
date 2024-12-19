"use client";

import { useState, useEffect } from "react";
import { Flex, ToggleButton, Scroller } from ".";

interface ButtonOption {
  label?: React.ReactNode;
  value: string;
  prefixIcon?: string;
  suffixIcon?: string;
  className?: string;
}

interface SegmentedControlProps {
  buttons: ButtonOption[];
  onToggle: (value: string, event?: React.MouseEvent<HTMLDivElement>) => void;
  defaultSelected?: string;
  fillWidth?: boolean;
  selected?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  buttons,
  onToggle,
  defaultSelected,
  fillWidth = true,
  selected,
  className,
  style,
  ...scrollerProps
}) => {
  const [internalSelected, setInternalSelected] = useState<string>(() => {
    if (selected !== undefined) return selected;
    if (defaultSelected !== undefined) return defaultSelected;
    return buttons[0]?.value || "";
  });

  useEffect(() => {
    if (selected !== undefined) {
      setInternalSelected(selected);
    }
  }, [selected]);

  const handleButtonClick = (clickedButton: ButtonOption) => {
    const newSelected = clickedButton.value;
    setInternalSelected(newSelected);
    onToggle(newSelected);
  };

  const selectedIndex = buttons.findIndex(
    (button) => button.value === internalSelected,
  );

  return (
    <Scroller direction="row" {...scrollerProps}
        fillWidth={fillWidth} fitWidth={!fillWidth} negativeGap="1">
        {buttons.map((button, index) => {
          let label: string | undefined;
          let children: React.ReactNode = undefined;

          if (typeof button.label === "string") {
            label = button.label;
          } else {
            children = button.label;
          }

          return (
            <ToggleButton
              variant="outline"
              radius={index === 0 ? "left" : index === buttons.length - 1 ? "right" : "none"}
              key={button.value}
              label={label}
              value={button.value}
              selected={index === selectedIndex}
              onClick={() => handleButtonClick(button)}
              prefixIcon={button.prefixIcon}
              suffixIcon={button.suffixIcon}
              fillWidth={fillWidth}
              aria-pressed={index === selectedIndex}
            >
              {children}
            </ToggleButton>
          );
        })}
    </Scroller>
  );
};

SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl };
export type { SegmentedControlProps, ButtonOption };
