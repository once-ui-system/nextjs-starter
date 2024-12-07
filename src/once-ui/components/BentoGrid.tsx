import React, { ReactNode, forwardRef } from "react";
import classNames from "classnames";
import { GridProps } from "./Grid";
import styles from "./BentoGrid.module.scss";
import { Flex } from "./Flex";

interface BentoGridProps extends GridProps {
  layout: GridLayout[];
  children: ReactNode[];
}

interface GridLayout {
  area?: string;
  columnSpan?: number;
  rowSpan?: number;
}

const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ layout, children, className, style, ...rest }, ref) => {
    const combinedStyle = {
      ...style,
      display: "grid",
      gridGap: "var(--static-space-24)",
      padding: "var(--static-space-24)",
      animation:
        "fadeIn var(--transition-duration-micro-medium) var(--transition-eased)",
      backgroundColor: "var(--background-surface)",
    };

    return (
      <Flex
        ref={ref}
        className={classNames(styles.bentoGrid, className)}
        style={combinedStyle}
        {...rest}
      >
        {children.map((child, index) => {
          const itemLayout = layout[index] || {};
          const gridStyle: React.CSSProperties = {
            gridColumn: itemLayout.columnSpan
              ? `span ${itemLayout.columnSpan}`
              : undefined,
            gridRow: itemLayout.rowSpan
              ? `span ${itemLayout.rowSpan}`
              : undefined,
          };

          return (
            <Flex
              flex={1}
              key={index}
              className={classNames(styles.gridItem)}
              style={gridStyle}
            >
              {child}
            </Flex>
          );
        })}
      </Flex>
    );
  },
);

BentoGrid.displayName = "BentoGrid";

export { BentoGrid };
export type { BentoGridProps, GridLayout };
