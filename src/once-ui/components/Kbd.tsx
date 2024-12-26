"use client";

import React, { ReactNode, forwardRef } from "react";

import { Flex, Text } from ".";
import classNames from "classnames";
import styles from "./Kbd.module.scss";

interface KbdProps extends React.ComponentProps<typeof Flex> {
  label?: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Kbd = forwardRef<HTMLDivElement, KbdProps>(
  ({ label, children, className, style, ...rest }, ref) => (
    <Flex
      as="kbd"
      ref={ref}
      className={classNames(styles.kbd, className)}
      style={style}
      {...rest}
    >
      <Text as="span" variant="label-default-s">
        {label || children}
      </Text>
    </Flex>
  ),
);

Kbd.displayName = "Kbd";

export { Kbd };
export type { KbdProps };
