"use client";

import React, { useState, useRef, useEffect, KeyboardEvent, ReactNode, forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Flex, Text } from '.';
import styles from './Dropdown.module.scss';

interface DropdownOptions {
    label: string;
    value: string;
    hasPrefix?: React.ReactNode;
    hasSuffix?: React.ReactNode;
    description?: string;
    dividerAfter?: boolean;
    danger?: boolean;
}

interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    options: DropdownOptions[];
    selectedOption?: string;
    onOptionSelect: (option: DropdownOptions) => void;
    className?: string;
    children?: ReactNode;
    onEscape?: () => void;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({
    options,
    selectedOption,
    onOptionSelect,
    className,
    children,
    onEscape,
    ...props },
    ref) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [typedChars, setTypedChars] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<number | null>(null);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (focusedIndex === null) {
            setFocusedIndex(0);
        } else {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setFocusedIndex((prevIndex) => (prevIndex !== null && prevIndex < options.length - 1 ? prevIndex + 1 : 0));
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setFocusedIndex((prevIndex) => (prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : options.length - 1));
            } else if (event.key === 'Enter' && focusedIndex !== null) {
                onOptionSelect(options[focusedIndex]);
            } else if (/^[a-zA-Z0-9]$/.test(event.key)) {
                setTypedChars((prevChars) => prevChars + event.key);
            }
        }

        if (event.key === 'Escape') {
            if (onEscape) onEscape();
        }
    };

    const handleOptionClick = (option: DropdownOptions) => {
        onOptionSelect(option);
    };

    const handleOptionMouseEnter = (index: number) => {
        setFocusedIndex(index);
    };

    useEffect(() => {
        if (dropdownRef.current && focusedIndex !== null) {
            const focusedOption = dropdownRef.current.querySelectorAll<HTMLElement>('.' + styles.option)[focusedIndex];
            if (focusedOption) {
                focusedOption.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                focusedOption.focus();
            }
        }
    }, [focusedIndex]);

    useEffect(() => {
        if (typedChars.length > 0) {
            const matchIndex = options.findIndex(option => option.label.toLowerCase().startsWith(typedChars.toLowerCase()));
            if (matchIndex !== -1) {
                setFocusedIndex(matchIndex);
            }
            if (typingTimeoutRef.current !== null) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = window.setTimeout(() => {
                setTypedChars('');
            }, 500);
        }
    }, [typedChars, options]);

    useEffect(() => {
        if (dropdownRef.current && selectedOption !== undefined) {
            const selectedIndex = options.findIndex(option => option.label === selectedOption);
            if (selectedIndex !== -1) {
                setFocusedIndex(selectedIndex);
                const selectedOptionElement = dropdownRef.current.querySelectorAll<HTMLElement>('.' + styles.option)[selectedIndex];
                if (selectedOptionElement) {
                    selectedOptionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }
    }, [selectedOption, options]);

    return (
        <Flex
            direction="column"
            padding="4"
            border="neutral-medium"
            borderStyle="solid-1"
            radius="m-4"
            background="surface"
            gap="2"
            minWidth={12}
            className={classNames(styles.dropdown, className)}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            ref={ref || dropdownRef}
            {...props}>
            {children}
            {options.map((option, index) => (
                <React.Fragment key={index}>
                    <Flex
                        alignItems="center"
                        paddingX="12"
                        paddingY="8"
                        gap="12"
                        radius="m"
                        className={classNames(styles.option, {
                            [styles.focused]: focusedIndex === index,
                            [styles.selected]: selectedOption === option.label,
                            [styles.danger]: option.danger,
                        })}
                        onClick={() => handleOptionClick(option)}
                        onMouseEnter={() => handleOptionMouseEnter(index)}>
                        {option.hasPrefix && <Flex className={styles.prefix}>{option.hasPrefix}</Flex>}
                        <Flex style={{ whiteSpace: "nowrap" }}
                            direction="column"
                            className={styles.optionText}>
                            <Text
                                as="span"
                                onBackground="neutral-strong"
                                variant="label-default-s">
                                {option.label}
                            </Text>
                            {option.description && 
                                <Text
                                    as="span"
                                    variant="body-default-xs"
                                    onBackground="neutral-weak">
                                    {option.description}
                                </Text>
                            }
                        </Flex>
                        {option.hasSuffix && <Flex className={styles.suffix}>{option.hasSuffix}</Flex>}
                    </Flex>
                    {option.dividerAfter && <div className={styles.divider} />}
                </React.Fragment>
            ))}
        </Flex>
    );
});

Dropdown.displayName = "Dropdown";

export { Dropdown };
export type { DropdownOptions, DropdownProps };