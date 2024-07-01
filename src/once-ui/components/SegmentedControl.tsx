"use client";

import { useState, useEffect, useRef } from 'react';
import { Flex, IconButton, ToggleButton } from '.';
import styles from './SegmentedControl.module.scss';

interface ButtonOption {
    label?: string;
    value?: string;
    prefixIcon?: string;
    suffixIcon?: string;
    className?: string;
}

interface SegmentedControlProps {
    buttons: ButtonOption[];
    onToggle: (selected: string) => void;
    defaultSelected: string;
    className?: string;
    style?: React.CSSProperties;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
    buttons,
    onToggle,
    defaultSelected,
    className,
    style,
}) => {
    const defaultIndex = buttons.findIndex(button => (button.value || button.label) === defaultSelected);
    const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex !== -1 ? defaultIndex : 0);
    const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
    const [showRightButton, setShowRightButton] = useState<boolean>(false);
    const controlRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (buttons[selectedIndex]) {
            onToggle(buttons[selectedIndex].value || buttons[selectedIndex].label || '');
        }
    }, [selectedIndex, buttons, onToggle]);

    useEffect(() => {
        const control = controlRef.current;
        const handleScroll = () => {
            if (control) {
                const scrollLeft = control.scrollLeft;
                const maxScrollLeft = control.scrollWidth - control.clientWidth;
                setShowLeftButton(scrollLeft > 0);
                setShowRightButton(scrollLeft < maxScrollLeft - 1);
            }
        };

        if (control && control.scrollWidth > control.clientWidth) {
            handleScroll();
            control.addEventListener('scroll', handleScroll);
            return () => control.removeEventListener('scroll', handleScroll);
        }
    }, [buttons]);

    const handleScrollRight = () => {
        const control = controlRef.current;
        if (control) {
            control.scrollBy({ left: control.clientWidth / 2, behavior: 'smooth' });
        }
    };

    const handleScrollLeft = () => {
        const control = controlRef.current;
        if (control) {
            control.scrollBy({ left: -control.clientWidth / 2, behavior: 'smooth' });
        }
    };

    const handleButtonClick = (index: number) => {
        setSelectedIndex(index);
        if (buttons[index]) {
            onToggle(buttons[index].value || buttons[index].label || '');
        }
    };

    return (
        <Flex
            position="relative"
            fillWidth
            radius="m-4"
            border="neutral-medium"
            borderStyle="solid-1"
            className={className}
            style={style}>
            {showLeftButton && (
                <div className={styles.scrollMaskContainer}>
                    <div className={`${styles.scrollMaskLeft} ${styles.scrollMask}`}></div>
                    <IconButton
                        icon="chevronLeft"
                        onClick={handleScrollLeft}
                        size="s"
                        variant="secondary"
                        className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}/>
                </div>
            )}
            <div className={styles.control} ref={controlRef}>
                {buttons.map((button, index) => (
                    <ToggleButton
                        key={button.value || button.label}
                        label={button.label}
                        value={button.value || button.label}
                        width="fill"
                        selected={selectedIndex === index}
                        onClick={() => handleButtonClick(index)}
                        prefixIcon={button.prefixIcon}
                        suffixIcon={button.suffixIcon}/>
                ))}
            </div>
            {showRightButton && (
                <div className={`${styles.scrollMaskRight} ${styles.scrollMaskContainer}`}>
                    <div className={styles.scrollMask}></div>
                    <IconButton
                        icon="chevronRight"
                        onClick={handleScrollRight}
                        size="s"
                        variant="secondary"
                        className={`${styles.scrollButton} ${styles.scrollButtonRight}`}/>
                </div>
            )}
        </Flex>
    );
};

SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl };
export type { SegmentedControlProps, ButtonOption };