import classNames from "classnames";
import { Flex, Text } from ".";
import styles from "./option.module.scss";
import { ElementType } from "./ElementType";
import React, { forwardRef } from "react";

interface OptionProps {
  label: React.ReactNode;
  href?: string;
  value: string;
  hasPrefix?: React.ReactNode;
  hasSuffix?: React.ReactNode;
  description?: React.ReactNode;
  danger?: boolean;
  selected?: boolean;
  onClick?: (value: string) => void;
}

const Option = forwardRef<HTMLDivElement, OptionProps>(({
  label,
  value,
  href,
  hasPrefix,
  hasSuffix,
  description,
  danger,
  selected,
  onClick,
  ...props
}, ref) => {
  if (href && onClick) {
    console.warn("Option should not have both `href` and `onClick` props.");
  }
  
  return (
    <ElementType href={href} className="reset-button-styles" onClick={onClick}>
      <Flex
        {...props}
        ref={ref}
        fillWidth
        alignItems="center"
        paddingX="12"
        paddingY="8"
        gap="12"
        radius="m"
        role="option"
        aria-selected={selected}
        tabIndex={-1}
        onClick={() => onClick?.(value)}
        className={classNames(styles.option, {
          [styles.danger]: danger,
          [styles.selected]: selected,
        })}
        data-value={value}
      >
        {hasPrefix && <Flex className={styles.prefix}>{hasPrefix}</Flex>}
        <Flex
          alignItems="flex-start"
          style={{ whiteSpace: "nowrap" }}
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
        {hasSuffix && (
          <Flex className={styles.suffix}>{hasSuffix}</Flex>
        )}
      </Flex>
    </ElementType>
  );
});

Option.displayName = "Option";
export { Option };