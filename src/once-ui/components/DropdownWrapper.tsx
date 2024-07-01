"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';

import { Flex, Dropdown, DropdownProps } from '.';
import { DropdownOptions } from '.';
import styles from './Select.module.scss';

interface DropdownWrapperProps {
    children: ReactNode;
    dropdownOptions: DropdownOptions[];
    dropdownAlignment?: 'left' | 'center' | 'right';
    dropdownProps?: Omit<DropdownProps, 'options'> & { onOptionSelect?: (option: DropdownOptions) => void };
}

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
    children,
    dropdownOptions,
    dropdownAlignment = 'left',
    dropdownProps = {} 
}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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

    return (
        <Flex
            style={{ WebkitTapHighlightColor: 'transparent' }}
            position="relative"
            ref={wrapperRef}
            onClick={() => setDropdownOpen(!isDropdownOpen)}>
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
};

export { DropdownWrapper };