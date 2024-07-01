"use client";

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { Flex, InteractiveDetails, InteractiveDetailsProps } from '.';
import styles from './RadioButton.module.scss';

interface RadioButtonProps extends Omit<InteractiveDetailsProps, 'onClick'> {
    style?: React.CSSProperties;
    className?: string;
    isChecked?: boolean;
    onToggle?: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
    style,
    className,
    isChecked: controlledIsChecked,
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
                radius="full"
                background="surface"
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={classNames(styles.radioButton, {
                    [styles.checked]: isChecked,
                })}>
                {isChecked && 
                    <Flex
                        radius="full"
                        className={styles.icon}/>
                }
            </Flex>
            <InteractiveDetails
                {...interactiveDetailsProps}
                onClick={() => {}}/>
        </Flex>
    );
};

RadioButton.displayName = "RadioButton";

export { RadioButton };
export type { RadioButtonProps };