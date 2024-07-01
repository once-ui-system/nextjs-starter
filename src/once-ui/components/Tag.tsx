"use client";

import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

import { Flex, Text, Icon } from '.';
import styles from './Tag.module.scss';

interface TagProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'brand' | 'accent' | 'warning' | 'success' | 'danger' | 'neutral' | 'info' | 'gradient';
    size?: 's' | 'm' | 'l';
    label?: string;
    prefixIcon?: string;
    suffixIcon?: string;
    children?: ReactNode;
}

const Tag: React.FC<TagProps> = ({
    variant = 'neutral',
    size = 'm',
    label = '',
    prefixIcon,
    suffixIcon,
    className,
    children,
    ...props
}) => {
    const labelSize = size === 's' ? 'label-default-s' : 'label-default-s';
    const paddingSize = size === 's' ? '2' : '4';

    return (
        <div
            className={classNames(styles.tag, styles[variant], styles[size], className)}
            {...props}>
            {prefixIcon && <Icon name={prefixIcon} size="xs" />}
            <Flex
                paddingX={paddingSize}
                alignItems="center">
                <Text
                    as="span"
                    variant={labelSize}>
                    {label || children}
                </Text>
            </Flex>
            {suffixIcon && <Icon name={suffixIcon} size="xs" />}
        </div>
    );
};

Tag.displayName = "Tag";

export { Tag };
export type { TagProps };