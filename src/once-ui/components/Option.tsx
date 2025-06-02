import classNames from "classnames";
import { Flex, Text, ElementType } from ".";
import styles from "./Option.module.scss";
import React, { forwardRef, KeyboardEvent } from "react";

export interface OptionProps {
  label?: React.ReactNode;
  href?: string;
  value: string;
  hasPrefix?: React.ReactNode;
  hasSuffix?: React.ReactNode;
  description?: React.ReactNode;
  danger?: boolean;
  selected?: boolean;
  highlighted?: boolean;
  tabIndex?: number;
  children?: React.ReactNode;
  onClick?: (value: string) => void;
  onLinkClick?: () => void;
}

const Option = forwardRef<HTMLDivElement, OptionProps>(
  (
    {
      label,
      value,
      href,
      hasPrefix,
      hasSuffix,
      description,
      danger,
      selected,
      highlighted,
      tabIndex,
      onClick,
      onLinkClick,
      children,
      ...props
    },
    ref,
  ) => {
    if (href && onClick) {
      console.warn("Option should not have both `href` and `onClick` props.");
    }

    return (
      <ElementType
        tabIndex={tabIndex}
        ref={ref}
        href={href}
        className="reset-button-styles fill-width"
        onLinkClick={onLinkClick}
        onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(value);
          }
        }}
      >
        <Flex
          {...props}
          fillWidth
          vertical="center"
          paddingX="12"
          paddingY="8"
          gap="12"
          radius="m"
          role="option"
          aria-selected={selected}
          tabIndex={-1}
          borderWidth={1}
          borderStyle="solid"
          cursor="interactive"
          transition="micro-medium"
          onClick={() => onClick?.(value)}
          className={classNames(styles.option, {
            [styles.danger]: danger,
            [styles.selected]: selected,
            [styles.highlighted]: highlighted,
          })}
          data-value={value}
        >
          {hasPrefix && <Flex className={styles.prefix}>{hasPrefix}</Flex>}
          {children}
          <Flex
            horizontal="start"
            style={{
              whiteSpace: "nowrap",
            }}
            fillWidth
            direction="column"
          >
            <Text onBackground="neutral-strong" variant="label-default-s">
              {label}
            </Text>
            {description && (
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {description}
              </Text>
            )}
          </Flex>
          {hasSuffix && <Flex className={styles.suffix}>{hasSuffix}</Flex>}
        </Flex>
      </ElementType>
    );
  },
);

Option.displayName = "Option";
export { Option };
