"use client";

import React, { forwardRef } from 'react';

import { Avatar, AvatarProps, Flex } from '.';
import styles from './AvatarGroup.module.scss';

interface AvatarGroupProps {
    avatars: AvatarProps[];
    reverseOrder?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(({
    avatars,
    reverseOrder = false,
    className,
    style
}, ref) => {
    return (
        <Flex
            position="relative"
            ref={ref}
            className={`${styles.avatarGroup} ${className || ''}`}
            style={style}
            zIndex={0}>
            {avatars.map((avatarProps, index) => (
                <Avatar
                    key={index}
                    {...avatarProps}
                    className={styles.avatar}
                    style={{
                        ...avatarProps.style,
                        zIndex: reverseOrder ? avatars.length - index : index + 1
                    }}/>
            ))}
        </Flex>
    );
});

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
export type { AvatarGroupProps };