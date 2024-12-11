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
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
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
      justifyContent = "center",
      href,
      id,
      arrowIcon = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const iconSize = size === "l" ? "m" : size === "m" ? "s" : "xs";

    const content = (
      <>
        {prefixIcon && !loading && <Icon name={prefixIcon} size={iconSize} />}
        {loading && <Spinner size={size} />}
        <Flex paddingX="4" paddingY="0" textWeight="strong" textSize={size} className="font-label">
          {label || children}
        </Flex>
        {arrowIcon && <Arrow style={{ marginLeft: "calc(-1 * var(--static-space-4))" }} trigger={'#' + id} scale={size === "s" ? 0.8 : size === "m" ? 0.9 : 1} />}
        {suffixIcon && <Icon name={suffixIcon} size={iconSize} />}
      </>
    );

    return (
      <ElementType
        id={id}
        href={href}
        ref={ref}
        className={classNames(styles.button, styles[variant], styles[size], 'text-decoration-none', 'button', {
          ['fill-width']: fillWidth,
          ['fit-width']: !fillWidth,
          ['justify-' + justifyContent]: justifyContent
        }, className)}
        style={{ ...style }}
        {...props}
      >
        {content}
      </ElementType>
    );
  },
);

Button.displayName = "Button";
export { Button };
