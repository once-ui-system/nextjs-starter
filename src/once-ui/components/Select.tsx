"use client";

import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

import { Icon, Dropdown, Input, InputProps } from '.';
import { DropdownOptions } from '.';
import inputStyles from './Input.module.scss';
import styles from './Select.module.scss';

interface SelectProps extends Omit<InputProps, 'onSelect' | 'value'> {
    options: DropdownOptions[];
    value: string;
    onSelect: (option: DropdownOptions) => void;
    renderDropdownOptions?: (option: DropdownOptions) => React.ReactNode;
    renderCustomDropdownContent?: () => React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onSelect,
    renderDropdownOptions,
    renderCustomDropdownContent,
    ...inputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!value);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        setIsDropdownOpen(true);
        if (inputProps.onFocus) inputProps.onFocus(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (!selectRef.current?.contains(event.relatedTarget as Node)) {
            setIsDropdownOpen(false);
        }
        if (value || event.target.value) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
        if (inputProps.onBlur) inputProps.onBlur(event);
    };

    const handleSelect = (option: DropdownOptions) => {
        onSelect(option);
        setIsDropdownOpen(false);
        setIsFilled(true);
    };

    const handleEscape = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        if (isDropdownOpen && dropdownRef.current) {
            dropdownRef.current.focus();
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className={classNames(inputStyles.wrapper, inputProps.className)} ref={selectRef}>
            <Input
                {...inputProps}
                style={{ cursor: 'pointer' }}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                readOnly
                hasSuffix={<Icon style={{ pointerEvents: 'none' }} name="chevronDown" size="m" />}
                className={classNames({
                    [inputStyles.filled]: isFilled,
                    [inputStyles.focused]: isFocused,
                })}/>
            {isDropdownOpen && (
                <Dropdown
                    style={{ maxHeight: '24rem' }}
                    options={options}
                    onOptionSelect={handleSelect}
                    className={`${styles.dropdown} ${styles.top} ${styles.fixed}`}
                    selectedOption={value || undefined}
                    ref={dropdownRef}
                    onEscape={handleEscape}>
                    {renderCustomDropdownContent && renderCustomDropdownContent()}
                </Dropdown>
            )}
        </div>
    );
};

Select.displayName = "Select";

export { Select };