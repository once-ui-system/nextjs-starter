"use client";

import React, { CSSProperties, forwardRef, useEffect, useRef, useState } from "react";
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

interface ParticleProps {
  display?: boolean;
  density?: number;
  color?: string;
  size?: SpacingToken;
  speed?: number;
  interactive?: boolean;
  interactionRadius?: number;
  opacity?: DisplayProps["opacity"];
}

interface BackgroundProps extends React.ComponentProps<typeof Flex> {
  gradient?: GradientProps;
  dots?: DotsProps;
  grid?: GridProps;
  lines?: LinesProps;
  particle?: ParticleProps;
  mask?: MaskProps;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Background = forwardRef<HTMLDivElement, BackgroundProps>(
    (
        {
          gradient = {},
          dots = {},
          grid = {},
          lines = {},
          particle = {},
          mask = {},
          children,
          className,
          style,
          ...rest
        },
        forwardedRef,
    ) => {
      const dotsColor = dots.color ?? "brand-on-background-weak";
      const dotsSize = "var(--static-space-" + (dots.size ?? "24") + ")";

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

      useEffect(() => {
        if (!particle.display || !backgroundRef.current) return;

        const container = backgroundRef.current;
        const particles: HTMLElement[] = [];
        const particleTargets = new Map<HTMLElement, { x: number; y: number }>();
        const initialPositions = new Map<HTMLElement, { x: number; y: number }>();
        let mousePosition = { x: -1000, y: -1000 };
        let animationFrameId: number;

        const {
          color = 'brand-on-background-weak',
          size = '2',
          speed = 0.3,
          interactive = false,
          interactionRadius = 20,
          opacity = 100,
          density = 100
        } = particle;

        const parsedSize = `var(--static-space-${size})`;
        const parsedOpacity = `${opacity}%`;
        const movementSpeed = speed * 0.08;
        const repulsionStrength = 0.15 * (speed || 1);

        const handleMouseMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          mousePosition = {
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
          };
        };

        const createParticle = () => {
          const particleEl = document.createElement("div");
          particleEl.style.position = "absolute";
          particleEl.style.width = parsedSize;
          particleEl.style.height = parsedSize;
          particleEl.style.background = `var(--${color})`;
          particleEl.style.borderRadius = "50%";
          particleEl.style.pointerEvents = "none";
          particleEl.style.opacity = parsedOpacity;
          particleEl.style.transition = "transform 0.4s ease-out, opacity 0.6s ease-out";

          const initialX = 10 + Math.random() * 80;
          const initialY = 10 + Math.random() * 80;

          particleEl.style.left = `${initialX}%`;
          particleEl.style.top = `${initialY}%`;

          initialPositions.set(particleEl, { x: initialX, y: initialY });
          particleTargets.set(particleEl, { x: initialX, y: initialY });

          container.appendChild(particleEl);
          particles.push(particleEl);
          return particleEl;
        };

        const updateParticles = () => {
          particles.forEach((particleEl, index) => {
            const currentTarget = particleTargets.get(particleEl);
            const initial = initialPositions.get(particleEl);
            if (!currentTarget || !initial) return;

            const currentX = parseFloat(particleEl.style.left);
            const currentY = parseFloat(particleEl.style.top);

            const time = Date.now() * 0.001 * speed;
            const baseNoiseX = Math.sin(time + index) * 0.5;
            const baseNoiseY = Math.cos(time + index * 1.2) * 0.5;

            let targetX = initial.x + baseNoiseX;
            let targetY = initial.y + baseNoiseY;

            if (interactive) {
              const dx = mousePosition.x - currentX;
              const dy = mousePosition.y - currentY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < interactionRadius) {
                const force = (interactionRadius - distance) * repulsionStrength;
                const angle = Math.atan2(dy, dx);

                targetX -= Math.cos(angle) * force;
                targetY -= Math.sin(angle) * force;
              }
            }

            targetX = Math.max(5, Math.min(95, targetX));
            targetY = Math.max(5, Math.min(95, targetY));

            particleTargets.set(particleEl, {
              x: targetX,
              y: targetY
            });

            particleEl.style.left = `${currentX + (targetX - currentX) * movementSpeed}%`;
            particleEl.style.top = `${currentY + (targetY - currentY) * movementSpeed}%`;
          });

          animationFrameId = requestAnimationFrame(updateParticles);
        };

        if (interactive) {
          document.addEventListener('mousemove', handleMouseMove);
        }

        for (let i = 0; i < density; i++) {
          createParticle();
        }

        updateParticles();

        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          cancelAnimationFrame(animationFrameId);
          particles.forEach(particleEl => {
            particleEl.remove();
            particleTargets.delete(particleEl);
            initialPositions.delete(particleEl);
          });
        };
      }, [particle.display, particle.color, particle.size, particle.speed, particle.interactive, particle.interactionRadius, particle.opacity, particle.density]);
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

      return (
          <Flex
              ref={backgroundRef}
              fill
              className={
                classNames(
                    mask && styles.mask,
                    particle.display && styles.particles,
                    className
                )
              }
              top="0"
              left="0"
              zIndex={0}
              overflow="hidden"
              style={{
                ...maskStyle(),
                ...style,
              }}
              {...rest}
          >
            <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: ${particle.opacity ?? 30}%;
            }
            50% {
              transform: translate(
                  ${Math.random() * 4 - 2}px,
                  ${Math.random() * 4 - 2}px
              ) scale(0.98);
              opacity: ${(particle.opacity ?? 30) * 0.9}%;
            }
          }
        `}</style>
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
                        "--lines-angle": `${lines.angle ?? 45}deg`,
                        "--lines-color": `var(--${lines.color ?? "brand-on-background-weak"})`,
                        "--lines-thickness": `${lines.thickness ?? 0.5}px`,
                        "--lines-spacing": `var(--static-space-${lines.size ?? "24"})`,
                        background: `
                repeating-linear-gradient(
                  var(--lines-angle),
                  var(--static-transparent),
                  var(--static-transparent) calc(var(--lines-spacing) - var(--lines-thickness)),
                  var(--lines-color) calc(var(--lines-spacing) - var(--lines-thickness)),
                  var(--lines-color) var(--lines-spacing)
                )
              `,
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
                    className={styles.grid}
                    opacity={grid.opacity}
                    style={{
                      backgroundSize: `
                ${grid.width || "var(--static-space-32)"}
                ${grid.height || "var(--static-space-32)"}`,
                      backgroundPosition: "0 0",
                      backgroundImage: `
                linear-gradient(
                  90deg,
                  var(--${grid.color || "brand-on-background-weak"}) 0,
                  var(--${grid.color || "brand-on-background-weak"}) 1px,
                  var(--static-transparent) 1px,
                  var(--static-transparent) ${grid.width || "var(--static-space-32)"}
                ),
                linear-gradient(
                  0deg,
                  var(--${grid.color || "brand-on-background-weak"}) 0,
                  var(--${grid.color || "brand-on-background-weak"}) 1px,
                  var(--static-transparent) 1px,
                  var(--static-transparent) ${grid.height || "var(--static-space-32)"}
                )
              `,
                    }}
                />
            )}
            {children}
          </Flex>
      );
    },
);

Background.displayName = "Background";

export { Background };
