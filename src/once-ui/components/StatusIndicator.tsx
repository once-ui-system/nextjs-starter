"use client";

import React, { forwardRef } from "react";
import classNames from "classnames";
import styles from "./StatusIndicator.module.scss";
import { Flex } from "./Flex";

interface StatusIndicatorProps extends React.ComponentProps<typeof Flex> {
  size: "s" | "m" | "l";
  color: "green" | "yellow" | "red" | "gray";
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>(
  (
    { 
      size, 
      color, 
      ariaLabel = `${color} status indicator`,
      className, 
      style,
      ...rest
    }, ref ) => {
    return (
      <Flex
        ref={ref}
        style={style}
        className={classNames(
          styles.statusIndicator,
          styles[size],
          styles[color],
          className,
        )}
        aria-label={ariaLabel}
        radius="full"
        {...rest}
      />
    );
  },
);

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };
