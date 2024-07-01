"use client";

import React from 'react';
import Image from 'next/image';

import { Skeleton, Icon, Text, StatusIndicator, Flex } from '.';
import styles from './Avatar.module.scss';

interface AvatarProps {
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    value?: string;
    src?: string;
    loading?: boolean;
    empty?: boolean;
    statusIndicator?: {
        color: 'green' | 'yellow' | 'red' | 'gray';
    };
    style?: React.CSSProperties;
    className?: string;
}

const sizeMapping: Record<'xs' | 's' | 'm' | 'l' | 'xl', 'xs' | 's' | 'm' | 'l' | 'xl'> = {
    xs: 'xs',
    s: 's',
    m: 'm',
    l: 'l',
    xl: 'xl',
};

const statusIndicatorSizeMapping: Record<'xs' | 's' | 'm' | 'l' | 'xl', 's' | 'm' | 'l'> = {
    xs: 's',
    s: 's',
    m: 'm',
    l: 'm',
    xl: 'l',
};

const Avatar: React.FC<AvatarProps> = ({
    size = 'm',
    value,
    src,
    loading,
    empty,
    statusIndicator,
    style,
    className
}) => {
    const isEmpty = empty || (!src && !value);

    if (value && src) {
        throw new Error("Avatar cannot have both 'value' and 'src' props.");
    }

    if (loading) {
        return (
            <Skeleton
                shape="circle"
                width={sizeMapping[size]}
                height={sizeMapping[size]}
                className={`${styles.avatar} ${className}`}/>
        );
    }

    const renderContent = () => {
        if (isEmpty) {
            return <Icon
                onBackground="neutral-medium"
                name="person"
                size={sizeMapping[size]}
                className={styles.icon}/>;
        }

        if (src) {
            return (
                <Image
                    style={{ objectFit: "cover", background: "var(--neutral-background-medium)" }}
                    src={src} 
                    fill
                    alt="avatar"
                    sizes="64px"
                    className={styles.image}/>
            );
        }

        if (value) {
            return (
                <Text
                    as="span"
                    onBackground="neutral-weak"
                    variant={`body-default-${size}`}
                    className={styles.truncate}>
                    {value}
                </Text>
            );
        }

        return null;
    };

    return (
        <Flex
            position="relative"
            justifyContent="center"
            alignItems="center"
            radius="full"
            border="neutral-strong"
            borderStyle="solid-1"
            style={style}
            className={`${styles.avatar} ${styles[size]} ${className || ''}`}>
            {renderContent()}
            {statusIndicator && (
                <StatusIndicator
                    size={statusIndicatorSizeMapping[size]}
                    color={statusIndicator.color}
                    className={`${styles.className || ''} ${styles.indicator} ${size === 'xl' ? styles.position : ''}`}/>
            )}
        </Flex>
    );
};

Avatar.displayName = "Avatar";

export { Avatar };
export type { AvatarProps };