"use client";

import React from 'react';
import classNames from 'classnames';

import { iconLibrary } from '../icons';
import { IconType } from 'react-icons';
import { ColorScheme, ColorWeight } from '../types';

const sizeMap: Record<string, string> = {
    xs: 'var(--static-space-16)',
    s: 'var(--static-space-20)',
    m: 'var(--static-space-24)',
    l: 'var(--static-space-32)',
    xl: 'var(--static-space-40)',
};

type IconProps = {
    name: string;
    className?: string;
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    onBackground?: `${ColorScheme}-${ColorWeight}`;
    onSolid?: `${ColorScheme}-${ColorWeight}`;
    style?: React.CSSProperties;
};

const Icon: React.FC<IconProps> = ({
    name,
    onBackground,
    onSolid,
    size = 'm',
    className,
    style,
}) => {
    const IconComponent: IconType | undefined = iconLibrary[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" does not exist in the library.`);
        return null;
    }

    if (onBackground && onSolid) {
        console.warn("You cannot use both 'onBackground' and 'onSolid' props simultaneously. Only one will be applied.");
    }

    let colorClass = 'color-inherit';

    if (onBackground) {
        const [scheme, weight] = onBackground.split('-') as [ColorScheme, ColorWeight];
        colorClass = `${scheme}-on-background-${weight}`;
    } else if (onSolid) {
        const [scheme, weight] = onSolid.split('-') as [ColorScheme, ColorWeight];
        colorClass = `${scheme}-on-solid-${weight}`;
    }

    return (
        <IconComponent
            className={classNames(colorClass, className)}
            style={{ fontSize: sizeMap[size], ...style }}
            aria-label={name}/>
    );
};

export { Icon };