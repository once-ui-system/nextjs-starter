"use client";

import React, { forwardRef } from "react";
import { Arrow, Flex, Icon, SmartLink } from ".";

import styles from "./Badge.module.scss";
import { IconName } from "../icons";
import classNames from "classnames";

interface BadgeProps extends React.ComponentProps<typeof Flex> {
  title?: string;
  icon?: IconName;
  arrow?: boolean;
  children?: React.ReactNode;
  href?: string;
  effect?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const Badge = forwardRef<HTMLDivElement | HTMLAnchorElement, BadgeProps>(
  (
    {
      title,
      icon,
      href,
      arrow = href ? true : false,
      children,
      effect = true,
      className,
      style,
      id,
      ...rest
    },
    ref,
  ) => {
    const content = (
      <Flex
        id={id || "badge"}
        paddingX="20"
        paddingY="12"
        fitWidth
        className={classNames(effect ? styles.animation : undefined, className)}
        style={style}
        vertical="center"
        radius="full"
        background="neutral-weak"
        onBackground="brand-strong"
        border="brand-alpha-medium"
        textVariant="label-strong-s"
        shadow="l"
        {...rest}
      >
        {icon && <Icon marginRight="8" size="s" name={icon} onBackground="brand-medium" />}
        {title}
        {children}
        {arrow && <Arrow trigger={`#${id || "badge"}`} />}
      </Flex>
    );

    if (href) {
      return (
        <SmartLink
          unstyled
          className={className}
          style={{
            borderRadius: "var(--radius-full)",
            ...style,
          }}
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </SmartLink>
      );
    }

    return React.cloneElement(content, {
      ref: ref as React.Ref<HTMLDivElement>,
    });
  },
);

Badge.displayName = "Badge";
export { Badge };
