"use client";

import React from 'react';

import { Flex, DropdownWrapper, DropdownProps, User, UserProps } from '.';
import { DropdownOptions } from '.';

interface UserMenuProps extends UserProps {
    selected?: boolean;
    dropdownOptions?: DropdownOptions[];
    dropdownAlignment?: 'left' | 'center' | 'right';
    dropdownProps?: Omit<DropdownProps, 'options'> & { onOptionSelect?: (option: DropdownOptions) => void };
}

const UserMenu: React.FC<UserMenuProps> = ({
    selected = false,
    dropdownOptions = [],
    dropdownAlignment = 'left',
    dropdownProps,
    ...userProps
}) => {
    return (
        <DropdownWrapper
            dropdownOptions={dropdownOptions}
            dropdownAlignment={dropdownAlignment}
            dropdownProps={dropdownProps}>
            <Flex
                direction="column"
                padding="4"
                radius="full"
                border={selected ? 'neutral-medium' : 'transparent'}
                background={selected ? 'neutral-strong' : 'transparent'}
                style={{ cursor: 'pointer' }}>
                <User {...userProps} />
            </Flex>
        </DropdownWrapper>
    );
};

UserMenu.displayName = "UserMenu";

export { UserMenu };