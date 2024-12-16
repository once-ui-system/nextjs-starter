"use client";

import React, {
  CSSProperties,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { SpacingToken } from "../types";
import { Flex } from "./Flex";
import { DisplayProps } from "../interfaces";
import styles from "./Background.module.scss";
import classNames from "classnames";

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && "current" in ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

interface MaskProps {
  cursor?: boolean;
  x?: number;
  y?: number;
  radius?: number;
}

interface GradientProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  x?: number;
  y?: number;
  radius?: number;
  colorStart?: string;
  colorEnd?: string;
}

interface DotsProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  color?: string;
  size?: SpacingToken;
}

interface LinesProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  size?: SpacingToken;
}

interface BackgroundProps {
  position?: CSSProperties["position"];
  gradient?: GradientProps;
  dots?: DotsProps;
  lines?: LinesProps;
  mask?: MaskProps;
  className?: string;
  style?: React.CSSProperties;
}

const Background = forwardRef<HTMLDivElement, BackgroundProps>(
  (
    {
      position = "fixed",
      gradient = {},
      dots = {},
      lines = {},
      mask = {},
      className,
      style,
    },
    forwardedRef,
  ) => {
    const dotsColor = dots.color ?? "brand-on-background-weak";
    const dotsSize = dots.size ?? "24";

    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setRef(forwardedRef, backgroundRef.current);
    }, [forwardedRef]);

    useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        if (backgroundRef.current) {
          const rect = backgroundRef.current.getBoundingClientRect();
          setCursorPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      };

      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    useEffect(() => {
      let animationFrameId: number;

      const updateSmoothPosition = () => {
        setSmoothPosition((prev) => {
          const dx = cursorPosition.x - prev.x;
          const dy = cursorPosition.y - prev.y;
          const easingFactor = 0.05;

          return {
            x: Math.round(prev.x + dx * easingFactor),
            y: Math.round(prev.y + dy * easingFactor),
          };
        });
        animationFrameId = requestAnimationFrame(updateSmoothPosition);
      };

      if (mask.cursor) {
        animationFrameId = requestAnimationFrame(updateSmoothPosition);
      }

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [cursorPosition, mask]);

    const commonStyles: CSSProperties = {
      pointerEvents: "none",
      ...style,
    };

    const maskStyle = (): CSSProperties => {
      if (!mask) return {};

      if (mask.cursor) {
        return {
          "--mask-position-x": `${smoothPosition.x}px`,
          "--mask-position-y": `${smoothPosition.y}px`,
          "--mask-radius": `${mask.radius || 50}vh`,
        } as CSSProperties;
      }

      if (mask.x != null && mask.y != null) {
        return {
          "--mask-position-x": `${mask.x}%`,
          "--mask-position-y": `${mask.y}%`,
          "--mask-radius": `${mask.radius || 50}vh`,
        } as CSSProperties;
      }

      return {};
    };

    const commonFlexProps = {
      position,
      top: "0" as SpacingToken,
      left: "0" as SpacingToken,
      zIndex: 0 as DisplayProps["zIndex"],
      fill: true,
      ref: backgroundRef,
    };

    return (
      <>
        {gradient.display && (
          <Flex
            {...commonFlexProps}
            className={classNames(
              styles.gradient,
              mask && styles.mask,
              className
            )}
            opacity={gradient.opacity}
            style={{
              ...commonStyles,
              ...maskStyle(),
              ["--gradient-position-x" as string]: gradient.x != null ? `${gradient.x}%` : "50%",
              ["--gradient-position-y" as string]: gradient.y != null ? `${gradient.y}%` : "50%",
              ["--gradient-radius" as string]: gradient.radius != null ? `${gradient.radius}% ${gradient.radius}%` : "100% 100%",
              ["--gradient-color-start" as string]: gradient.colorStart ? `var(--${gradient.colorStart})` : "var(--brand-alpha-strong)",
              ["--gradient-color-end" as string]: gradient.colorEnd ? `var(--${gradient.colorEnd})` : "var(--brand-alpha-weak)",
            }}
          />
        )}
        {dots.display && (
          <Flex
            {...commonFlexProps}
            className={classNames(
              styles.dots,
              mask && styles.mask,
              className
            )}
            opacity={dots.opacity}
            style={{
              ...commonStyles,
              backgroundImage: `radial-gradient(var(--${dotsColor}) 0.5px, var(--static-transparent) 0.5px)`,
              backgroundSize: `${dotsSize} ${dotsSize}`,
              ...maskStyle(),
            }}
          />
        )}
        {lines.display && (
          <Flex
            {...commonFlexProps}
            className={classNames(
              styles.lines,
              mask && styles.mask,
              className
            )}
            opacity={lines.opacity}
            style={{
              ...commonStyles,
              backgroundImage: `repeating-linear-gradient(45deg, var(--brand-on-background-weak) 0, var(--brand-on-background-weak) 0.5px, var(--static-transparent) 0.5px, var(--static-transparent) ${dots.size})`,
              ...maskStyle(),
            }}
          />
        )}
      </>
    );
  },
);

Background.displayName = "Background";

export { Background };
