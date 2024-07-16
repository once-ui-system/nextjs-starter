"use client";

import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Flex, ToggleButton, Scroller } from '.';

interface ButtonOption {
    label?: string;
    value?: string;
    prefixIcon?: string;
    suffixIcon?: string;
    className?: string;
}

interface SegmentedControlProps {
    buttons: ButtonOption[];
    handleToggle: (selected: string) => void;
    defaultSelected?: string;
    className?: string;
    style?: React.CSSProperties;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
    buttons,
    handleToggle,
    defaultSelected,
    className,
    style,
}) => {
    const defaultIndex = buttons.findIndex(button => (button.value || button.label) === defaultSelected);
    const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex !== -1 ? defaultIndex : 0);

    useEffect(() => {
        if (buttons[selectedIndex]) {
            handleToggle(buttons[selectedIndex].value || buttons[selectedIndex].label || '');
        }
    }, [selectedIndex, buttons, handleToggle]);

    const handleButtonClick = (index: number) => {
        setSelectedIndex(index);
        if (buttons[index]) {
            handleToggle(buttons[index].value || buttons[index].label || '');
        }
    };

    return (
        <Flex
            fillWidth
            minWidth={0}
            position="relative"
            className={className}
            style={style}>
            <Flex
                fillWidth
                position="relative"
                overflowX="hidden"
                overflowY="hidden">
                <Scroller
                    contained={true}
                    direction="row">
                    <Flex
                        fillWidth
                        gap="2">
                        {buttons.map((button, index) => (
                            <ToggleButton
                                key={button.value || button.label}
                                label={button.label}
                                value={button.value || button.label}
                                selected={selectedIndex === index}
                                onClick={() => handleButtonClick(index)}
                                prefixIcon={button.prefixIcon}
                                suffixIcon={button.suffixIcon}
                                width="fill"
                                aria-pressed={selectedIndex === index}/>
                        ))}
                    </Flex>
                </Scroller>
            </Flex>
        </Flex>
    );
};

SegmentedControl.displayName = 'SegmentedControl';

export { SegmentedControl };
export type { SegmentedControlProps, ButtonOption };