"use client";

import React, { useEffect, useState, forwardRef } from "react";
import styles from "./GlitchFx.module.scss";
import { Flex } from "./Flex";

interface GlitchFxProps extends React.ComponentProps<typeof Flex> {
  children: React.ReactNode;
  speed?: "slow" | "medium" | "fast";
  interval?: number;
  trigger?: "instant" | "hover" | "custom";
  continuous?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const GlitchFx = forwardRef<HTMLDivElement, GlitchFxProps>(
  (
    {
      children,
      speed = "medium",
      interval = 2500,
      trigger = "instant",
      continuous = true,
      style,
      className,
      ...rest
    },
    ref,
  ) => {
    const [isGlitching, setIsGlitching] = useState(
      continuous || trigger === "instant",
    );

    useEffect(() => {
      if (continuous || trigger === "instant") {
        setIsGlitching(true);
      }
    }, [continuous, trigger]);

    const handleMouseEnter = () => {
      if (trigger === "hover") {
        setIsGlitching(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger === "hover") {
        setIsGlitching(false);
      }
    };

    const triggerGlitch = () => {
      if (trigger === "custom") {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 500);
      }
    };

    useEffect(() => {
      if (trigger === "custom") {
        const glitchInterval = setInterval(triggerGlitch, interval);
        return () => clearInterval(glitchInterval);
      }
    }, [trigger, interval]);

    const speedClass = styles[speed];

    const combinedClassName = `${speedClass} ${isGlitching ? styles.active : ""} ${className || ""}`;

    return (
      <Flex
        ref={ref}
        style={style}
        position="relative"
        inline
        className={combinedClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        <Flex fillWidth inline position="relative" zIndex={1}>
          {children}
        </Flex>

        <Flex inline position="absolute" top="0" left="0" fill zIndex={0} opacity={50} className={`${styles.glitchLayer} ${styles.blueShift}`}>
          {children}
        </Flex>

        <Flex inline position="absolute" top="0" left="0" fill zIndex={0} opacity={50} className={`${styles.glitchLayer} ${styles.redShift}`}>
          {children}
        </Flex>
      </Flex>
    );
  },
);

GlitchFx.displayName = "GlitchFx";
export { GlitchFx };
