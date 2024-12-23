"use client";

import React from "react";
import classNames from "classnames";
import { Flex, DropdownWrapper, User, UserProps } from ".";
import styles from "./UserMenu.module.scss";
import { DropdownWrapperProps } from "./DropdownWrapper";

interface UserMenuProps extends UserProps, Pick<DropdownWrapperProps, 'minHeight' | 'minWidth' | 'maxWidth'> {
  selected?: boolean;
  dropdown?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const UserMenu: React.FC<UserMenuProps> = ({
  selected = false,
  dropdown,
  minWidth,
  maxWidth,
  minHeight,
  className,
  style,
  ...userProps
}) => {

  return (
    <DropdownWrapper
      minWidth={minWidth}
      maxWidth={maxWidth}
      minHeight={minHeight}
      trigger={
        <Flex
          direction="column"
          padding="4"
          radius="full"
          border={selected ? "neutral-medium" : "transparent"}
          background={selected ? "neutral-strong" : "transparent"}
          className={classNames(
            className || "",
            "cursor-interactive",
            selected ? styles.selected : "",
            styles.wrapper,
          )}
          style={style}
        >
          <User {...userProps} />
        </Flex>
      }
      dropdown={
        <>{dropdown}</>
      }
    >
      
    </DropdownWrapper>
  );
};

UserMenu.displayName = "UserMenu";

export { UserMenu };
