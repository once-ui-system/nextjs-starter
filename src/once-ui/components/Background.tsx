"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import { Flex, Mask, MaskProps } from ".";
import styles from "./Background.module.scss";
import classNames from "classnames";
import { DisplayProps } from "../interfaces";
import { SpacingToken } from "../types";

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && "current" in ref) {
    (ref as React.RefObject<T | null>).current = value;
  }
}

interface GradientProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  tilt?: number;
  colorStart?: string;
  colorEnd?: string;
}

interface DotsProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  color?: string;
  size?: SpacingToken;
}

interface GridProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  color?: string;
  width?: string;
  height?: string;
}

interface LinesProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  size?: SpacingToken;
  thickness?: number;
  angle?: number;
  color?: string;
}

interface BackgroundProps extends React.ComponentProps<typeof Flex> {
  gradient?: GradientProps;
  dots?: DotsProps;
  grid?: GridProps;
  lines?: LinesProps;
  mask?: MaskProps;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Background = forwardRef<HTMLDivElement, BackgroundProps>(
  (
    { gradient = {}, dots = {}, grid = {}, lines = {}, mask, children, className, style, ...rest },
    forwardedRef,
  ) => {
    const dotsColor = dots.color ?? "brand-on-background-weak";
    const dotsSize = "var(--static-space-" + (dots.size ?? "24") + ")";

    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setRef(forwardedRef, backgroundRef.current);
    }, [forwardedRef]);

    const remap = (
      value: number,
      inputMin: number,
      inputMax: number,
      outputMin: number,
      outputMax: number,
    ) => {
      return ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
    };

    const adjustedX = gradient.x != null ? remap(gradient.x, 0, 100, 37.5, 62.5) : 50;
    const adjustedY = gradient.y != null ? remap(gradient.y, 0, 100, 37.5, 62.5) : 50;

    const renderContent = () => (
      <>
        {gradient.display && (
          <Flex
            position="absolute"
            className={styles.gradient}
            opacity={gradient.opacity}
            pointerEvents="none"
            style={{
              ["--gradient-position-x" as string]: `${adjustedX}%`,
              ["--gradient-position-y" as string]: `${adjustedY}%`,
              ["--gradient-width" as string]:
                gradient.width != null ? `${gradient.width / 4}%` : "25%",
              ["--gradient-height" as string]:
                gradient.height != null ? `${gradient.height / 4}%` : "25%",
              ["--gradient-tilt" as string]: gradient.tilt != null ? `${gradient.tilt}deg` : "0deg",
              ["--gradient-color-start" as string]: gradient.colorStart
                ? `var(--${gradient.colorStart})`
                : "var(--brand-solid-strong)",
              ["--gradient-color-end" as string]: gradient.colorEnd
                ? `var(--${gradient.colorEnd})`
                : "var(--brand-solid-weak)",
            }}
          />
        )}
        {dots.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            className={styles.dots}
            opacity={dots.opacity}
            style={
              {
                "--dots-color": `var(--${dotsColor})`,
                "--dots-size": dotsSize,
              } as React.CSSProperties
            }
          />
        )}
        {lines.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            className={styles.lines}
            opacity={lines.opacity}
            style={
              {
                "--lines-size": `var(--static-space-${lines.size ?? "80"})`,
                backgroundImage: `repeating-linear-gradient(${lines.angle ?? 90}deg, var(--${lines.color ?? "brand-on-background-weak"}) 0px, var(--${lines.color ?? "brand-on-background-weak"}) ${lines.thickness ?? 1}px, var(--static-transparent) ${lines.thickness ?? 1}px, var(--static-transparent) ${lines.size ?? "80"}px)`,
              } as React.CSSProperties
            }
          />
        )}
        {grid.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            opacity={grid.opacity}
            style={{
              backgroundImage: `linear-gradient(to right, var(--${grid.color ?? "brand-on-background-weak"}) 1px, transparent 1px), linear-gradient(to bottom, var(--${grid.color ?? "brand-on-background-weak"}) 1px, transparent 1px)`,
              backgroundSize: `${grid.width ?? "80px"} ${grid.height ?? "80px"}`,
            }}
          />
        )}
        {children}
      </>
    );

    return (
      <Flex
        ref={backgroundRef}
        fill
        className={classNames(className)}
        top="0"
        left="0"
        zIndex={0}
        overflow="hidden"
        style={style}
        {...rest}
      >
        {mask ? (
          <Mask
            fill
            position="absolute"
            cursor={mask.cursor}
            radius={mask.radius}
            x={mask.x}
            y={mask.y}
          >
            {renderContent()}
          </Mask>
        ) : (
          renderContent()
        )}
      </Flex>
    );
  },
);

Background.displayName = "Background";
export { Background };
