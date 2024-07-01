"use client";

import React, { ElementType, ComponentPropsWithoutRef } from 'react';
import classNames from 'classnames';

import { ColorScheme, ColorWeight, TextVariant, TextSize, TextWeight } from '../types';

type HeadingProps<T extends ElementType> = {
    as?: T;
    variant?: TextVariant;
    size?: TextSize;
    weight?: TextWeight;
    onBackground?: `${ColorScheme}-${ColorWeight}`;
    onSolid?: `${ColorScheme}-${ColorWeight}`;
    align?: 'left' | 'center' | 'right' | 'justify';
    children: React.ReactNode;
    className?: string;
} & ComponentPropsWithoutRef<T>;

const Heading = <T extends ElementType = 'h1'>({
    as,
    variant,
    size,
    weight,
    onBackground,
    onSolid,
    align,
    children,
    className,
    ...props
}: HeadingProps<T>) => {
    const Component = as || 'h1';

    if (variant && (size || weight)) {
        console.warn("When 'variant' is set, 'size' and 'weight' are ignored.");
    }

    if (onBackground && onSolid) {
        console.warn("You cannot use both 'onBackground' and 'onSolid' props simultaneously. Only one will be applied.");
    }

    const getVariantClasses = (variant: TextVariant) => {
        const [fontType, weight, size] = variant.split('-');
        return [`font-${fontType}`, `font-${weight}`, `font-${size}`];
    };

    const sizeClass = size ? `font-${size}` : 'font-m';
    const weightClass = weight ? `font-${weight}` : 'font-strong';

    const classes = variant
        ? getVariantClasses(variant)
        : [sizeClass, weightClass];

    let colorClass = 'color-inherit';
    if (onBackground) {
        const [scheme, weight] = onBackground.split('-') as [ColorScheme, ColorWeight];
        colorClass = `${scheme}-on-background-${weight}`;
    } else if (onSolid) {
        const [scheme, weight] = onSolid.split('-') as [ColorScheme, ColorWeight];
        colorClass = `${scheme}-on-solid-${weight}`;
    }

    const style = {
        textAlign: align,
    };

    return (
        <Component
            className={classNames(...classes, colorClass, className)}
            style={style}
            {...props}>
            {children}
        </Component>
    );
};

Heading.displayName = "Heading";

export { Heading };