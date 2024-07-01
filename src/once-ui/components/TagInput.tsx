"use client";

import React, { useState, KeyboardEventHandler, ChangeEventHandler, FocusEventHandler } from 'react';

import { Flex, Chip, Input, InputProps } from '.';

interface TagInputProps extends Omit<InputProps, 'onChange' | 'value'> {
    value: string[];
    onChange: (value: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange, label, placeholder, ...inputProps }) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (inputValue.trim()) {
                onChange([...value, inputValue.trim()]);
                setInputValue('');
            }
        }
    };

    const handleRemoveTag = (index: number) => {
        const newValue = value.filter((_, i) => i !== index);
        onChange(newValue);
    };

    const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
        setIsFocused(true);
    };

    const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
        setIsFocused(false);
    };

    return (
        <Input style={{height: 'var(--static-space-48)', paddingTop: 'var(--static-space-4)'}}
            label={label}
            placeholder={placeholder}
            labelAsPlaceholder
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...inputProps}>
            {value.length > 0 && (
                <Flex
                    style={{ margin: 'calc(-1 * var(--static-space-8)) var(--static-space-8)' }}
                    direction="row"
                    gap="4"
                    alignItems="center"
                    wrap
                    paddingY="16">
                    {value.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            onRemove={() => handleRemoveTag(index)}/>
                    ))}
                </Flex>
            )}
        </Input>
    );
};

export { TagInput };