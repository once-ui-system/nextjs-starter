import React, { forwardRef } from "react";

import styles from "./Spinner.module.scss";
import { Flex } from ".";
import classNames from "classnames";

interface SpinnerProps extends React.ComponentProps<typeof Flex> {
  size?: "xs" | "s" | "m" | "l" | "xl";
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "m", ariaLabel = "Loading", className, style, ...rest }, ref) => {
    return (
      <Flex center style={style} className={className} {...rest}>
        <Flex ref={ref} center className={styles[size]} role="status" aria-label={ariaLabel}>
          <Flex fill>
            <Flex
              className={classNames(styles.size)}
              borderStyle="solid"
              fill
              radius="full"
              border="neutral-alpha-medium"
              position="absolute"
            />
            <Flex
              className={classNames(styles.spinner, styles.size)}
              borderStyle="solid"
              fill
              radius="full"
            />
          </Flex>
        </Flex>
      </Flex>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner };
