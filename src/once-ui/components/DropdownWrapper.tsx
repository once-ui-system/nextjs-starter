"use client";

import React, { useState, useRef, useEffect, ReactNode, forwardRef, useImperativeHandle } from 'react';
import { Flex, Dropdown, DropdownProps } from '.';
import { DropdownOptions } from '.';
import styles from './Select.module.scss';

interface DropdownWrapperProps {
    children: ReactNode;
    dropdownOptions: DropdownOptions[];
    dropdownAlignment?: 'left' | 'center' | 'right';
    dropdownProps?: Omit<DropdownProps, 'options'> & { onOptionSelect?: (option: DropdownOptions) => void };
}

const DropdownWrapper: React.FC<DropdownWrapperProps> = forwardRef<HTMLDivElement, DropdownWrapperProps>(({
    children,
    dropdownOptions,
    dropdownAlignment = 'left',
    dropdownProps = {}
}, ref) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => wrapperRef.current as HTMLDivElement);

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside as EventListener);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
        };
    }, []);

    const {
        onOptionSelect = () => {},
        ...restDropdownProps
    } = dropdownProps;

    const dropdownStyles = {
        left: dropdownAlignment === 'left' ? 0 : 'auto',
        right: dropdownAlignment === 'right' ? 0 : 'auto',
        marginLeft: dropdownAlignment === 'center' ? '50%' : undefined,
        transform: dropdownAlignment === 'center' ? 'translateX(-50%)' : undefined
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            setDropdownOpen(false);
        }
    };

    return (
        <Flex
            style={{ WebkitTapHighlightColor: 'transparent' }}
            position="relative"
            ref={wrapperRef}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}>
            {children}
            {isDropdownOpen && dropdownOptions.length > 0 && (
                <Dropdown
                    options={dropdownOptions}
                    onOptionSelect={(option) => {
                        console.log('Option selected:', option);
                        onOptionSelect(option);
                        setDropdownOpen(false);
                    }}
                    className={`${styles.dropdown} ${styles.top} ${styles.auto}`}
                    {...restDropdownProps}
                    style={{ ...dropdownStyles }}/>
            )}
        </Flex>
    );
});

DropdownWrapper.displayName = "DropdownWrapper";

export { DropdownWrapper };