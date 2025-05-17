"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  ReactNode,
} from "react";
import classNames from "classnames";
import { Column, Flex, Text } from ".";
import styles from "./Input.module.scss";
import useDebounce from "../hooks/useDebounce";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  placeholder?: string;
  height?: "s" | "m";
  error?: boolean;
  errorMessage?: ReactNode;
  description?: ReactNode;
  radius?:
    | "none"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left";
  className?: string;
  style?: React.CSSProperties;
  hasPrefix?: ReactNode;
  hasSuffix?: ReactNode;
  cursor?: undefined | "interactive";
  validate?: (value: ReactNode) => ReactNode | null;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      placeholder,
      height = "m",
      error = false,
      errorMessage,
      description,
      radius,
      className,
      style,
      hasPrefix,
      hasSuffix,
      children,
      onFocus,
      onBlur,
      validate,
      cursor,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!props.value);
    const [validationError, setValidationError] = useState<ReactNode | null>(null);
    const debouncedValue = useDebounce(props.value, 1000);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (event.target.value) {
        setIsFilled(true);
      } else {
        setIsFilled(false);
      }
      if (onBlur) onBlur(event);
    };

    useEffect(() => {
      setIsFilled(!!props.value);
    }, [props.value]);

    const validateInput = useCallback(() => {
      if (!debouncedValue) {
        setValidationError(null);
        return;
      }

      if (validate) {
        const error = validate(debouncedValue);
        if (error) {
          setValidationError(error);
        } else {
          setValidationError(errorMessage || null);
        }
      } else {
        setValidationError(null);
      }
    }, [debouncedValue, validate, errorMessage]);

    useEffect(() => {
      validateInput();
    }, [debouncedValue, validateInput]);

    const displayError = validationError || errorMessage;

    const inputClassNames = classNames(
      styles.input,
      "font-body",
      "font-default",
      "font-m",
      cursor === "interactive" ? "cursor-interactive" : undefined,
      {
        [styles.filled]: isFilled,
        [styles.focused]: isFocused,
        [styles.withPrefix]: hasPrefix,
        [styles.withSuffix]: hasSuffix,
        [styles.placeholder]: placeholder,
        [styles.hasChildren]: children,
        [styles.error]: displayError && debouncedValue !== "",
      },
    );

    return (
      <Column
        gap="8"
        style={style}
        fillWidth
        fitHeight
        className={classNames(className, {
          [styles.error]: (error || (displayError && debouncedValue !== "")) && props.value !== "",
        })}
      >
        <Flex
          transition="micro-medium"
          border="neutral-medium"
          background="neutral-alpha-weak"
          overflow="hidden"
          vertical="stretch"
          className={classNames(
            styles.base,
            {
              [styles.s]: height === "s",
            },
            {
              [styles.m]: height === "m",
            },
            radius === "none" ? "radius-none" : radius ? `radius-l-${radius}` : "radius-l",
          )}
        >
          {hasPrefix && (
            <Flex paddingLeft="12" className={styles.prefix} position="static">
              {hasPrefix}
            </Flex>
          )}
          <Column fillWidth>
            <input
              {...props}
              ref={ref}
              id={id}
              placeholder={placeholder}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={inputClassNames}
              aria-describedby={displayError ? `${id}-error` : undefined}
              aria-invalid={!!displayError}
            />
            {label && (
              <Text
                as="label"
                variant="label-default-m"
                htmlFor={id}
                className={classNames(styles.label, styles.inputLabel, {
                  [styles.floating]: isFocused || isFilled || placeholder,
                })}
              >
                {label}
              </Text>
            )}
            {children}
          </Column>
          {hasSuffix && (
            <Flex paddingRight="12" className={styles.suffix} position="static">
              {hasSuffix}
            </Flex>
          )}
        </Flex>
        {displayError && errorMessage !== false && (
          <Flex paddingX="16">
            <Text as="span" id={`${id}-error`} variant="body-default-s" onBackground="danger-weak">
              {validationError || errorMessage}
            </Text>
          </Flex>
        )}
        {description && (
          <Flex
            paddingX="16"
            fillWidth
            id={`${id}-description`}
            textVariant="body-default-s"
            onBackground="neutral-weak"
          >
            {description}
          </Flex>
        )}
      </Column>
    );
  },
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
