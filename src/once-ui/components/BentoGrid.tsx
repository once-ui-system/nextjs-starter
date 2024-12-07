import React, { ReactNode, forwardRef } from "react";
import classNames from "classnames";
import { GridProps } from "./Grid";
import styles from "./BentoGrid.module.scss";
import { Flex } from "./Flex";

interface BentoGridProps extends GridProps {
  layout: GridLayout[];
  children: ReactNode[];
  gap?: 'xs' | 's' | 'm' | 'l' | 'xl';
  padding?: 'xs' | 's' | 'm' | 'l' | 'xl';
}

interface GridLayout {
  area?: string;
  columnSpan?: number;
  rowSpan?: number;
}

const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ layout, children, className, style, gap = 'm', padding = 'm', ...rest }, ref) => {
    const combinedClassName = classNames(
      styles.bentoGrid,
      styles[`gap-${gap}`],
      styles[`padding-${padding}`],
      className
    );

    const combinedStyle = {
      ...style,
      animation:
        "fadeIn var(--transition-duration-micro-medium) var(--transition-eased)",
      backgroundColor: "var(--background-surface)",
    };

    return (
      <Flex
        ref={ref}
        className={combinedClassName}
        style={combinedStyle}
        {...rest}
      >
        {children.map((child, index) => {
          const itemLayout = layout[index] || {};
          const gridStyle: React.CSSProperties = {
            gridColumn: itemLayout.columnSpan
              ? `span ${itemLayout.columnSpan}`
              : "span 1",
            gridRow: itemLayout.rowSpan
              ? `span ${itemLayout.rowSpan}`
              : "span 1",
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
