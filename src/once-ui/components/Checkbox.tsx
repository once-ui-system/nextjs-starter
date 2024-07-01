"use client";

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { Flex, Icon, InteractiveDetails, InteractiveDetailsProps } from '.';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends Omit<InteractiveDetailsProps, 'onClick'> {
    style?: React.CSSProperties;
    className?: string;
    isChecked?: boolean;
    isIndeterminate?: boolean;
    onToggle?: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
    style,
    className,
    isChecked: controlledIsChecked,
    isIndeterminate = false,
    onToggle,
    ...interactiveDetailsProps
}) => {
    const [isChecked, setIsChecked] = useState(controlledIsChecked || false);

    useEffect(() => {
        if (controlledIsChecked !== undefined) {
            setIsChecked(controlledIsChecked);
        }
    }, [controlledIsChecked]);

    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        } else {
            setIsChecked(!isChecked);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleToggle();
        }
    };

    return (
        <Flex
            alignItems="center"
            gap="16"
            style={style}
            className={classNames(styles.container, className)}
            onClick={handleToggle}>
            <Flex
                position="relative"
                justifyContent="center"
                alignItems="center"
                radius="xs"
                background="surface"
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={classNames(styles.checkbox, {
                    [styles.checked]: controlledIsChecked !== undefined ? controlledIsChecked || isIndeterminate : isChecked,
                })}>
                {(controlledIsChecked !== undefined ? controlledIsChecked : isChecked) && !isIndeterminate && (
                    <Icon
                        onSolid="brand-strong"
                        name="check"
                        size="xs"
                        className={styles.icon}/>
                )}
                {isIndeterminate && (
                    <Flex
                        radius="full"
                        className={`${styles.icon} ${styles.indeterminate}`}/>
                )}
            </Flex>
            <InteractiveDetails
                {...interactiveDetailsProps}
                onClick={() => {}}/>
        </Flex>
    );
};

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };