// ThreeDTiltFx.tsx
"use client";

import React, {
  ReactNode,
  useState,
  useCallback,
  useRef,
  useEffect,
  CSSProperties,
} from "react";
import styles from "./ThreeDTiltFx.module.scss"; // Ensure this CSS module exists

interface TiltProps {
  maxTilt?: number;
  dampening?: number;
  transitionDuration?: number;
  threshold?: number;
  bufferZone?: number;
  edgeThreshold?: number;
  maxVelocity?: number;
}

interface TiltFXProps {
  children: ReactNode;
  maxTilt?: number;
  dampening?: number;
  transitionDuration?: number;
  threshold?: number;
  bufferZone?: number;
  edgeThreshold?: number;
  maxVelocity?: number;
  style?: CSSProperties;
  className?: string;
}

export const ThreeDTiltFx: React.FC<TiltFXProps> = ({
  children,
  maxTilt = 10,
  dampening = 0.05,
  transitionDuration = 300,
  threshold = 0.1,
  bufferZone = 0.15,
  edgeThreshold = 0.05,
  maxVelocity = 2,
  style,
  className,
}) => {
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
  );

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  const animate = useCallback(() => {
    const { x: currentX, y: currentY } = currentRotation.current;
    const { x: targetX, y: targetY } = targetRotation.current;

    // Calculate the difference
    let deltaX = targetX - currentX;
    let deltaY = targetY - currentY;

    // Limit the maximum delta to prevent rapid changes
    deltaX = clamp(deltaX, -maxVelocity, maxVelocity);
    deltaY = clamp(deltaY, -maxVelocity, maxVelocity);

    // Apply dampening
    currentRotation.current.x += deltaX * dampening;
    currentRotation.current.y += deltaY * dampening;

    // Clamp the rotation to maxTilt
    currentRotation.current.x = clamp(
      currentRotation.current.x,
      -maxTilt,
      maxTilt
    );
    currentRotation.current.y = clamp(
      currentRotation.current.y,
      -maxTilt,
      maxTilt
    );

    // Update the transform
    setTransform(
      `perspective(1000px) rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg) scale(1.05)`
    );

    // Continue the animation if not yet at the target
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      requestRef.current = null;
    }
  }, [dampening, threshold, maxVelocity, maxTilt]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Normalize mouse positions and clamp them
      const normalizedX = clamp(mouseX / (rect.width / 2), -1, 1);
      const normalizedY = clamp(mouseY / (rect.height / 2), -1, 1);

      // Calculate the target rotation
      targetRotation.current = {
        x: normalizedY * maxTilt,
        y: normalizedX * maxTilt,
      };

      // Start the animation if not already started
      if (requestRef.current === null) {
        requestRef.current = requestAnimationFrame(animate);
      }
    },
    [animate, maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    targetRotation.current = { x: 0, y: 0 };

    // Start the animation to reset rotation
    if (requestRef.current === null) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        width: "100%",
        height: "100%",
        willChange: "transform",
        ...style,
      }}
      className={`${styles.tiltFX} ${className || ""}`}
    >
      {children}
    </div>
  );
};

ThreeDTiltFx.displayName = "ThreeDTiltFx";
