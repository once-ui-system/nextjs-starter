"use client";

import React, { forwardRef, useState, useEffect, ReactNode } from "react";
import { ElementType } from './ElementType';
import { Flex, Icon, Tooltip } from ".";
import buttonStyles from "./Button.module.scss";
import iconStyles from "./IconButton.module.scss";
import classNames from "classnames";

interface CommonProps {
  icon?: string;
  size?: "s" | "m" | "l";
  tooltip?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost";
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  children?: ReactNode;
}

export type IconButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;
export type AnchorProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps | AnchorProps>(
  (
    {
      icon = "refresh",
      size = "m",
      tooltip,
      tooltipPosition = "top",
      variant = "primary",
      className,
      style,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isHover) {
        timer = setTimeout(() => {
          setTooltipVisible(true);
        }, 400);
      } else {
        setTooltipVisible(false);
      }

      return () => clearTimeout(timer);
    }, [isHover]);

    const buttonClasses = classNames(
      buttonStyles.button,
      buttonStyles[variant],
      iconStyles[size],
      className
    );

    const content = (
      <>
        {children ? children : <Icon name={icon} size="s" />}
        {tooltip && isTooltipVisible && (
          <div
            style={{
              position: "absolute",
              zIndex: "1",
            }}
            className={iconStyles[tooltipPosition]}
          >
            <Tooltip label={tooltip} />
          </div>
        )}
      </>
    );

    const commonProps = {
      className: buttonClasses,
      style,
      onMouseEnter: () => setIsHover(true),
      onMouseLeave: () => setIsHover(false),
      "aria-label": tooltip || icon,
      ...props
    };

    return (
      <ElementType href={href} {...commonProps} ref={ref}>
        <Flex fill justifyContent="center" alignItems="center">{content}</Flex>
      </ElementType>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
