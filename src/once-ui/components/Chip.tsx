"use client";

import React, { ReactNode, HTMLAttributes, MouseEventHandler } from 'react';

import { Text, Icon, IconButton, IconButtonProps, Flex } from '.';
import styles from './Chip.module.scss';

interface ChipProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    selected?: boolean;
    prefixIcon?: string;
    onRemove?: () => void;
    onClick?: MouseEventHandler<HTMLDivElement>;
    children?: ReactNode;
    iconButtonProps?: Partial<IconButtonProps>;
    style?: React.CSSProperties;
    className?: string;
}

const Chip: React.FC<ChipProps> = ({
    label,
    selected = true,
    prefixIcon,
    onRemove,
    onClick,
    children,
    iconButtonProps = {},
    style,
    className,
    ...props
}) => {
    const defaultIconButtonProps: IconButtonProps = {
        icon: "close",
        variant: "ghost",
        size: "s",
        tooltip: "Remove",
        onClick: (e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
        }
    };

    const combinedIconButtonProps = {
        ...defaultIconButtonProps,
        ...iconButtonProps,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            defaultIconButtonProps.onClick?.(e);
            iconButtonProps.onClick?.(e);
        }
    };

    return (
        <Flex
            alignItems="center"
            radius="full"
            paddingX="8"
            paddingY="4"
            className={`${styles.chip} ${selected ? styles.selected : styles.unselected} ${className || ''}`}
            onClick={onClick}
            style={style}
            {...props}>
            {prefixIcon && 
                <Icon name={prefixIcon} size="s" />
            }
            <Flex
                paddingX="8"
                paddingY="2">
                <Text
                    variant="body-default-s">
                    {label || children}
                </Text>
            </Flex>
            {onRemove && (
                <IconButton
                    {...combinedIconButtonProps}/>
            )}
        </Flex>
    );
};

Chip.displayName = "Chip";

export { Chip };