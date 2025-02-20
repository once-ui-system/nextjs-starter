"use client";

import React, { forwardRef } from "react";
import { Flex } from ".";
import styles from "./Card.module.scss";
import { ElementType } from "./ElementType";
import classNames from "classnames";

interface CardProps extends React.ComponentProps<typeof Flex> {
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, href, onClick, style, className, ...rest }, ref) => {
    return (
      <ElementType
        className={classNames("reset-button-styles", "fill-width", onClick && "focus-ring", onClick && "radius-l")}
        href={href}
        onClick={onClick}
        ref={ref}>
        <Flex
          background="surface"
          transition="macro-medium"
          border="neutral-medium"
          cursor="interactive"
          className={styles.card}
          onClick={onClick}
          {...rest}
        >
          {children}
        </Flex>
      </ElementType>
    );
  },
);

Card.displayName = "Card";
export { Card };