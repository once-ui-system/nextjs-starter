"use client";

import { useState, useRef, useEffect } from "react";
import { Flex, SmartImage, IconButton } from ".";
import styles from "./CompareImage.module.scss";

interface CompareImageProps extends React.ComponentProps<typeof Flex> {
  leftImageSrc: string;
  rightImageSrc: string;
  leftImageAlt?: string;
  rightImageAlt?: string;
}

export const CompareImage = ({
  leftImageSrc,
  rightImageSrc,
  leftImageAlt = "",
  rightImageAlt = "",
  ...rest
}: CompareImageProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const updatePosition = (clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const containerWidth = rect.width;

    // Calculate percentage (constrained between 0 and 100)
    const newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setPosition(newPosition);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <Flex
      position="relative"
      ref={containerRef}
      aspectRatio="16/9"
      fillWidth
      style={{ touchAction: "none" }}
      {...rest}
    >
        <SmartImage src={leftImageSrc} alt={leftImageAlt} fill position="absolute" style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
        }} />

        <SmartImage src={rightImageSrc} alt={rightImageAlt} fill position="absolute" style={{
            clipPath: `inset(0 0 0 ${position}%)`,
        }} />

      {/* Hit area and visible line */}
      <Flex
        position="absolute"
        horizontal="center"
        width={3}
        className={styles.hitArea}
        top="0"
        bottom="0"
        style={{
          left: `${position}%`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <Flex
          width="1"
          fillHeight
          background="neutral-strong"
          zIndex={2}
        />
      </Flex>
      <IconButton
        icon="chevronsLeftRight"
        variant="secondary"
        className={styles.dragIcon}
        style={{
          left: `${position}%`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      />
    </Flex>
  );
};

CompareImage.displayName = "CompareImage";