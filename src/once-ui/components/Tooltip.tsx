"use client";

import React from 'react';
import classNames from 'classnames';

import { Flex, Text, Icon } from '.';

type TooltipProps = {
    label: string;
    prefixIcon?: string;
    suffixIcon?: string;
    className?: string;
};

const Tooltip: React.FC<TooltipProps> = ({
    label,
    prefixIcon,
    suffixIcon,
    className,
}) => {
    return (
        <Flex style={{ zIndex: '1', whiteSpace: 'nowrap', userSelect: 'none' }}
            gap="4"
            background="neutral-medium"
            paddingY="4"
            paddingX="8"
            radius="s"
            border="neutral-medium"
            borderStyle="solid-1"
            alignItems="center"
            className={classNames(className)}>
            {prefixIcon && <Icon name={prefixIcon} size="xs" />}
            <Flex
                paddingX="2">
                <Text
                    as="span"
                    variant="body-default-xs"
                    onBackground="neutral-strong">
                    {label}
                </Text>
            </Flex>
            {suffixIcon && <Icon name={suffixIcon} size="xs" />}
        </Flex>
    );
};

Tooltip.displayName = "Tooltip";

export { Tooltip };
