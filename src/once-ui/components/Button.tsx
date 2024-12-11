"use client";

import React, { ReactNode, forwardRef } from "react";
import { ElementType } from './ElementType';
import classNames from 'classnames';

import { Spinner, Icon, Arrow, Flex } from ".";
import styles from "./Button.module.scss";

interface CommonProps {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "s" | "m" | "l";
  label?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  loading?: boolean;
  fillWidth?: boolean;
  children?: ReactNode;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  arrowIcon?: boolean;
}

export type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;
export type AnchorProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps | AnchorProps>(
  (
    {
      variant = "primary",
      size = "m",
      label,
      children,
      prefixIcon,
      suffixIcon,
      loading = false,
      fillWidth = false,
      href,
      id,
      arrowIcon = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const labelSize =
      size === "l" ? "font-l" : size === "m" ? "font-m" : "font-s";
    const iconSize = size === "l" ? "m" : size === "m" ? "s" : "xs";

    const content = (
      <>
        {prefixIcon && !loading && <Icon name={prefixIcon} size={iconSize} />}
        {loading && <Spinner size={size} />}
        <div className={`font-label font-strong ${styles.label} ${labelSize}`}>
          {label || children}
        </div>
        {suffixIcon && <Icon name={suffixIcon} size={iconSize} />}
      </>
    );

    return (
      <ElementType
        id={id}
        href={href}
        ref={ref}
        className={classNames(styles.button, styles[variant], styles[size], {
          [styles.fillWidth]: fillWidth,
          [styles.fitContent]: !fillWidth,
        }, className)}
        style={{ ...style, textDecoration: "none" }}
        {...props}
      >
        <Flex alignItems="center">
          {content}
          {arrowIcon && <Arrow trigger={'#' + id} />}
        </Flex>
      </ElementType>
    );
  },
);

Button.displayName = "Button";
export { Button };
