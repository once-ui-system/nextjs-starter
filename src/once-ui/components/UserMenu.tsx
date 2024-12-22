"use client";

import React from "react";
import classNames from "classnames";

import { Flex, DropdownWrapper, User, UserProps } from ".";
import styles from "./UserMenu.module.scss";

interface UserMenuProps extends UserProps {
  selected?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const UserMenu: React.FC<UserMenuProps> = ({
  selected = false,
  className,
  children,
  ...userProps
}) => {

  return (
    <DropdownWrapper
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
        >
          <User {...userProps} />
        </Flex>
      }
      dropdown={
        <>{children}</>
      }
    >
      
    </DropdownWrapper>
  );
};

UserMenu.displayName = "UserMenu";

export { UserMenu };
