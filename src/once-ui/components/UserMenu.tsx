"use client";

import React from "react";
import classNames from "classnames";
import { Flex, DropdownWrapper, User, UserProps, DropdownWrapperProps } from ".";
import styles from "./UserMenu.module.scss";
import { Placement } from "@floating-ui/react-dom";

interface UserMenuProps
  extends UserProps,
    Pick<DropdownWrapperProps, "minHeight" | "minWidth" | "maxWidth"> {
  selected?: boolean;
  placement?: Placement;
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
  placement,
  className,
  style,
  ...userProps
}) => {
  return (
    <DropdownWrapper
      minWidth={minWidth}
      maxWidth={maxWidth}
      minHeight={minHeight}
      floatingPlacement={placement}
      style={{
        borderRadius: "var(--radius-full)",
      }}
      trigger={
        <Flex
          tabIndex={0}
          direction="column"
          padding="4"
          radius="full"
          cursor="interactive"
          border={selected ? "neutral-medium" : "transparent"}
          background={selected ? "neutral-strong" : "transparent"}
          className={classNames(className || "", selected ? styles.selected : "", styles.wrapper)}
          style={style}
        >
          <User {...userProps} />
        </Flex>
      }
      dropdown={dropdown}
    />
  );
};

UserMenu.displayName = "UserMenu";
export { UserMenu };
