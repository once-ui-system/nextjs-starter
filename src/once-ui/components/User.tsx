"use client";

import React from 'react';

import { Flex, Text, Skeleton, Tag, TagProps, Avatar, AvatarProps } from '.';

interface UserProps {
    name?: string;
    subline?: string;
    tag?: string;
    tagProps?: TagProps;
    loading?: boolean;
    avatarProps?: AvatarProps;
}

const User: React.FC<UserProps> = ({ 
    name, 
    subline, 
    tagProps = {}, 
    loading = false, 
    avatarProps = {} 
}) => {
    const { src, value, empty, ...restAvatarProps } = avatarProps;
    const isEmpty = empty || (!src && !value);

    return (
        <Flex
            alignItems="center"
            gap="8">
            <Avatar 
                size="m"
                src={src} 
                value={value} 
                empty={isEmpty}
                loading={loading} 
                {...restAvatarProps}/>
            {name && (
                <Flex
                    direction="column"
                    paddingLeft="4"
                    paddingRight="12">
                    {loading ? (
                        <Flex
                            minWidth={6}
                            paddingY="4">
                            <Skeleton
                                width="xl"
                                height="m"
                                shape="line"/>
                        </Flex>
                    ) : ( 
                        <Flex
                            gap="8"
                            alignItems="center">
                            <Text
                                variant="heading-strong-xs"
                                onBackground="neutral-strong">
                                {name}
                            </Text>
                            {tagProps.label && (
                                <Tag
                                    size="s"
                                    {...tagProps}>
                                    {tagProps.label}
                                </Tag>
                            )}
                        </Flex>
                    )}
                    {loading ? (
                        <Flex
                            paddingY="4">
                            <Skeleton
                                width="l"
                                height="xs"
                                shape="line"/>
                        </Flex>
                    ) : (
                        <Text
                            variant="body-default-xs"
                            onBackground="neutral-weak">
                            {subline}
                        </Text>
                    )}
                </Flex>
            )}
        </Flex>
    );
};

User.displayName = "User";

export { User };
export type { UserProps };