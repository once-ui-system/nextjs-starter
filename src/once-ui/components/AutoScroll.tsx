"use client";

import { Row } from "@/once-ui/components";
import styles from "./AutoScroll.module.scss";
import React, { forwardRef } from "react";

interface AutoScrollProps extends React.ComponentProps<typeof Row> {
  children: React.ReactNode;
  speed?: "slow" | "medium" | "fast";
  pause?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AutoScroll = forwardRef<HTMLDivElement, AutoScrollProps>(
  ({ children, speed = "medium", pause = false, className, style, ...flex }, ref) => {
    return (
      <Row overflow="hidden" fillWidth ref={ref} className={className} style={style} {...flex}>
        <Row
          fillWidth
          className={`${styles.marqueeWrapper} ${styles[speed]} ${pause ? styles.paused : ""}`}
        >
          <Row fillWidth horizontal="space-around" className={styles.marqueeContent}>
            {children}
          </Row>
          <Row fillWidth horizontal="space-around" className={styles.marqueeContent}>
            {children}
          </Row>
        </Row>
      </Row>
    );
  },
);

AutoScroll.displayName = "AutoScroll";
export { AutoScroll };
