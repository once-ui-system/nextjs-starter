"use client";

import React, { forwardRef, ReactNode } from "react";
import styles from "./InlineCode.module.scss";
import { Flex } from ".";
import classNames from "classnames";

interface InlineCodeProps extends React.ComponentProps<typeof Flex> {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const InlineCode = forwardRef<HTMLDivElement, InlineCodeProps>(
  ({ children, className, style, ...rest }, ref) => {
    return (
      <Flex
        as="span"
        inline
        fit
        ref={ref}
        radius="s"
        vertical="center"
        paddingX="4"
        paddingY="1"
        textType="code"
        background="neutral-alpha-weak"
        border="neutral-alpha-medium"
        className={classNames(styles.inlineCode, className)}
        style={style}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

InlineCode.displayName = "InlineCode";

export { InlineCode };
