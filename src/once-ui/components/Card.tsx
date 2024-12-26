"use client";

import React, { forwardRef } from "react";
import { Flex } from ".";
import classNames from "classnames";
import styles from "./Card.module.scss";

interface CardProps extends React.ComponentProps<typeof Flex> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, style, className, ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="column"
        background="surface"
        transition="macro-medium"
        radius="xl"
        border="neutral-medium"
        style={style}
        className={classNames(className, styles.card)}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

Card.displayName = "Card";
export { Card };
