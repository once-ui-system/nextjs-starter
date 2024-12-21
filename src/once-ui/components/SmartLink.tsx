"use client";

import React, { forwardRef, ReactNode } from "react";
import classNames from "classnames";
import { Icon } from ".";
import { ElementType } from "./ElementType";

interface CommonProps {
  prefixIcon?: string;
  suffixIcon?: string;
  iconSize?: "xs" | "s" | "m" | "l" | "xl";
  selected?: boolean;
  unstyled?: boolean;
  children: ReactNode;
  href?: string;
  style?: React.CSSProperties;
  className?: string;
}

export type SmartLinkProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(
  (
    {
      href,
      prefixIcon,
      suffixIcon,
      iconSize = "xs",
      style,
      className,
      selected,
      unstyled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {prefixIcon && <Icon name={prefixIcon} size={iconSize} />}
        {children}
        {suffixIcon && <Icon name={suffixIcon} size={iconSize} />}
      </>
    );

    const commonProps = {
      ref,
      className: classNames(className || "",
        "fit-width align-items-center display-inline-flex g-8 radius-s", {
        "px-4 mx-4": !unstyled,
      }),
      style: !unstyled
        ? {
            ...(selected && { textDecoration: "underline" }),
            ...style,
          }
        : {
            textDecoration: "none",
            ...style,
          },
      ...props,
    };

    return (
      <ElementType
        href={href}
        {...commonProps}
      >
        {content}
      </ElementType>
    );
  },
);

SmartLink.displayName = "SmartLink";

export { SmartLink };
