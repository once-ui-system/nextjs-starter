"use client";

import React, { useState, useEffect, forwardRef, useRef } from "react";
import { SpacingToken } from "../types";
import styles from "./RevealFx.module.scss";
import { Flex } from ".";

interface RevealFxProps extends React.ComponentProps<typeof Flex> {
  children: React.ReactNode;
  speed?: "slow" | "medium" | "fast";
  delay?: number;
  revealedByDefault?: boolean;
  translateY?: number | SpacingToken;
  trigger?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const RevealFx = forwardRef<HTMLDivElement, RevealFxProps>(
  (
    {
      children,
      speed = "medium",
      delay = 0,
      revealedByDefault = false,
      translateY,
      trigger,
      style,
      className,
      ...rest
    },
    ref,
  ) => {
    const [isRevealed, setIsRevealed] = useState(revealedByDefault);
    const [maskRemoved, setMaskRemoved] = useState(false);
    const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getSpeedDurationMs = () => {
      switch (speed) {
        case "fast":
          return 1000;
        case "medium":
          return 2000;
        case "slow":
          return 3000;
        default:
          return 2000;
      }
    };

    const getSpeedDuration = () => {
      const ms = getSpeedDurationMs();
      return `${ms / 1000}s`;
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsRevealed(true);
        
        // Always set a timeout to remove the mask after transition completes
        transitionTimeoutRef.current = setTimeout(() => {
          setMaskRemoved(true);
        }, getSpeedDurationMs());
      }, delay * 1000);

      return () => {
        clearTimeout(timer);
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
      };
    }, [delay]);

    useEffect(() => {
      if (trigger !== undefined) {
        setIsRevealed(trigger);
        
        // Reset mask removal state when trigger changes
        setMaskRemoved(false);
        
        // If trigger is true, set timeout to remove mask after transition
        if (trigger) {
          if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
          }
          
          transitionTimeoutRef.current = setTimeout(() => {
            setMaskRemoved(true);
          }, getSpeedDurationMs());
        }
      }
    }, [trigger]);

    const getTranslateYValue = () => {
      if (typeof translateY === "number") {
        return `${translateY}rem`;
      } else if (typeof translateY === "string") {
        return `var(--static-space-${translateY})`;
      }
      return undefined;
    };

    const translateValue = getTranslateYValue();

    const revealStyle: React.CSSProperties = {
      transitionDuration: getSpeedDuration(),
      transform: isRevealed ? "translateY(0)" : `translateY(${translateValue})`,
      ...style,
    };

    // If mask is removed after transition, use the no-mask classes
    if (maskRemoved) {
      return (
        <Flex
          fillWidth
          ref={ref}
          style={revealStyle}
          className={`${styles.revealedNoMask} ${className || ""}`}
          {...rest}
        >
          {children}
        </Flex>
      );
    }

    return (
      <Flex
        fillWidth
        ref={ref}
        style={revealStyle}
        className={`${styles.revealFx} ${isRevealed ? styles.revealed : styles.hidden} ${className || ""}`}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

RevealFx.displayName = "RevealFx";
export { RevealFx };
