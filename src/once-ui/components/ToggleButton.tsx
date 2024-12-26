"use client";

import React, { forwardRef, ReactNode } from "react";
import classNames from "classnames";
import { ElementType } from "./ElementType";
import { Flex, Icon } from ".";
import styles from "./ToggleButton.module.scss";

interface CommonProps {
  label?: string;
  selected: boolean;
  variant?: "ghost" | "outline";
  size?: "s" | "m" | "l";
  radius?:
    | "none"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  fillWidth?: boolean;
  weight?: "default" | "strong";
  truncate?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  href?: string;
}

export type ToggleButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const ToggleButton = forwardRef<HTMLElement, ToggleButtonProps>(
  (
    {
      label,
      selected,
      variant = "ghost",
      size = "m",
      radius,
      justifyContent = "center",
      fillWidth = false,
      weight = "default",
      truncate = false,
      prefixIcon,
      suffixIcon,
      className,
      style,
      children,
      href,
      ...props
    },
    ref,
  ) => {
    const radiusSize = size === "s" || size === "m" ? "m" : "l";

    return (
      <ElementType
        ref={ref}
        href={href}
        className={classNames(
          styles.button,
          selected && styles.selected,
          styles[size],
          styles[variant],
          radius === "none"
            ? "radius-none"
            : radius
              ? `radius-${radiusSize}-${radius}`
              : `radius-${radiusSize}`,
          "text-decoration-none",
          "button",
          {
            ["fill-width"]: fillWidth,
            ["fit-width"]: !fillWidth,
            ["justify-" + justifyContent]: justifyContent,
          },
          className,
        )}
        style={{ ...style }}
        {...props}
      >
        {prefixIcon && (
          <Icon
            name={prefixIcon}
            size={size === "l" ? "m" : "s"}
            className={styles.icon}
          />
        )}
        {(label || children) && (
          <Flex textWeight={weight} padding="4">
            {label || children}
          </Flex>
        )}
        {suffixIcon && (
          <Icon
            name={suffixIcon}
            size={size === "l" ? "m" : "s"}
            className={styles.icon}
          />
        )}
      </ElementType>
    );
  },
);

ToggleButton.displayName = "ToggleButton";

export { ToggleButton };
