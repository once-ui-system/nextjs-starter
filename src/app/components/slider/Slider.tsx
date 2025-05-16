import {Column, Flex, Text } from '@/once-ui/components';
import { useState, useEffect } from 'react';

type SliderProps = {
    min?: number;
    max?: number;
    value: number;
    onChange: (value: number) => void;
    label?: string;
    step?: number;
} & React.ComponentProps<typeof Flex>;

export const Slider = ({
                           min = 0,
                           max = 100,
                           value,
                           onChange,
                           label,
                           step = 1,
                           ...flexProps
                       }: SliderProps) => {
    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setInternalValue(newValue);
        onChange(newValue);
    };

    return (
        <Column gap="s" {...flexProps}>
            {label && <Text variant="body-default-s">{label}</Text>}

            <Flex align="center" gap="m">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={internalValue}
                    onChange={handleChange}
                    style={{
                        flex: 1,
                        WebkitAppearance: 'none',
                        height: '4px',
                        background: `linear-gradient(to right, var(--color-primary-medium) ${
                            ((internalValue - min) / (max - min)) * 100
                        }%, var(--color-neutral-light) ${
                            ((internalValue - min) / (max - min)) * 100
                        }%)`,
                        borderRadius: 'var(--radius-full)',
                    }}
                />

                <Text variant="body-strong-s" align="center">
                    {internalValue}
                </Text>
            </Flex>
        </Column>
    );
};