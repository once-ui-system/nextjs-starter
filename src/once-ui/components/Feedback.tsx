"use client";

import React, { forwardRef, ReactNode } from "react";
import { IconButton, Button, Icon, Flex, Text, Column } from ".";

interface FeedbackProps extends Omit<React.ComponentProps<typeof Flex>, "title"> {
  variant?: "info" | "danger" | "warning" | "success";
  icon?: boolean;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const variantIconMap: {
  [key in "info" | "danger" | "warning" | "success"]: string;
} = {
  info: "info",
  danger: "danger",
  warning: "warning",
  success: "check",
};

const Feedback = forwardRef<HTMLDivElement, FeedbackProps>(
  (
    {
      variant = "info",
      icon = true,
      title,
      description,
      showCloseButton = false,
      onClose,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Flex
        fillWidth
        radius="l"
        ref={ref}
        border={`${variant}-medium`}
        background={`${variant}-medium`}
        vertical="start"
        role="alert"
        aria-live="assertive"
        className={className}
        style={style}
        {...rest}
      >
        {icon && (
          <Flex paddingY="16" paddingLeft="16">
            <Icon
              padding="4"
              radius="m"
              border={`${variant}-medium`}
              onBackground={`${variant}-medium`}
              name={variantIconMap[variant]}
              aria-hidden="true"
            />
          </Flex>
        )}
        <Column fillWidth padding="16" gap="24" vertical="center">
          {(title || description) && (
            <Column fillWidth gap="4">
              {title && (
                <Flex fillWidth gap="16">
                  <Flex fillWidth paddingY="4">
                    <Text
                      variant="heading-strong-m"
                      onBackground={`${variant}-medium`}
                      role="heading"
                      aria-level={2}
                    >
                      {title}
                    </Text>
                  </Flex>
                  {showCloseButton && (
                    <IconButton
                      onClick={onClose}
                      icon="close"
                      size="m"
                      tooltip="Hide"
                      tooltipPosition="top"
                      variant="ghost"
                      aria-label="Close alert"
                    />
                  )}
                </Flex>
              )}
              {description && (
                <Text variant="body-default-s" onBackground={`${variant}-strong`}>
                  {description}
                </Text>
              )}
            </Column>
          )}
          {children}
        </Column>
      </Flex>
    );
  },
);

Feedback.displayName = "Feedback";
export { Feedback };
