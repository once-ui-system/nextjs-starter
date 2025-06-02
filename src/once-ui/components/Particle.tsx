"use client";

import React, { useEffect, useRef } from "react";
import { SpacingToken } from "../types";
import { DisplayProps } from "../interfaces";
import { Flex } from ".";

interface ParticleProps extends React.ComponentProps<typeof Flex> {
  display?: boolean;
  density?: number;
  color?: string;
  size?: SpacingToken;
  speed?: number;
  interactive?: boolean;
  interactionRadius?: number;
  opacity?: DisplayProps["opacity"];
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Particle = React.forwardRef<HTMLDivElement, ParticleProps>(
  (
    {
      display = true,
      density = 100,
      color = "brand-on-background-weak",
      size = "2",
      speed = 0.3,
      interactive = false,
      interactionRadius = 20,
      opacity = 100,
      children,
      className,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (forwardedRef && "current" in forwardedRef) {
        forwardedRef.current = containerRef.current;
      } else if (typeof forwardedRef === "function") {
        forwardedRef(containerRef.current);
      }
    }, [forwardedRef]);

    useEffect(() => {
      if (!display || !containerRef.current) return;

      const container = containerRef.current;
      const particles: HTMLElement[] = [];
      const particleTargets = new Map<HTMLElement, { x: number; y: number }>();
      const initialPositions = new Map<HTMLElement, { x: number; y: number }>();
      let mousePosition = { x: -1000, y: -1000 };
      let animationFrameId: number;

      const parsedSize = `var(--static-space-${size})`;
      const parsedOpacity = `${opacity}%`;
      const movementSpeed = speed * 0.08;
      const repulsionStrength = 0.15 * (speed || 1);

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mousePosition = {
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
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
            y: targetY,
          });

          particleEl.style.left = `${currentX + (targetX - currentX) * movementSpeed}%`;
          particleEl.style.top = `${currentY + (targetY - currentY) * movementSpeed}%`;
        });

        animationFrameId = requestAnimationFrame(updateParticles);
      };

      if (interactive) {
        document.addEventListener("mousemove", handleMouseMove);
      }

      for (let i = 0; i < density; i++) {
        createParticle();
      }

      updateParticles();

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(animationFrameId);
        particles.forEach((particleEl) => {
          particleEl.remove();
          particleTargets.delete(particleEl);
          initialPositions.delete(particleEl);
        });
      };
    }, [
      display,
      color,
      size,
      speed,
      interactive,
      interactionRadius,
      opacity,
      density,
      containerRef,
    ]);

    return (
      <Flex
        ref={containerRef}
        position="absolute"
        top="0"
        left="0"
        fill
        pointerEvents="none"
        className={className}
        style={style}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

Particle.displayName = "Particle";
