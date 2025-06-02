"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Placement } from "@floating-ui/react-dom";
import { Flex } from ".";
import styles from "./CursorCard.module.scss";

export interface CursorCardProps extends React.ComponentProps<typeof Flex> {
  trigger?: ReactNode;
  overlay?: ReactNode;
  placement?: Placement;
  className?: string;
  style?: React.CSSProperties;
}

const CursorCard = forwardRef<HTMLDivElement, CursorCardProps>(
  ({ trigger, overlay, placement = "bottom-left", className, style, ...flex }, ref) => {
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => cardRef.current as HTMLDivElement);

    useEffect(() => {
      const checkTouchDevice = () => {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
      };

      setIsTouchDevice(checkTouchDevice());
    }, []);

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (isHovering && !isTouchDevice) {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }
      },
      [isHovering, isTouchDevice],
    );

    useEffect(() => {
      if (!isTouchDevice) {
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
        };
      }
    }, [handleMouseMove, isTouchDevice]);

    // Create a portal container if it doesn't exist
    useEffect(() => {
      if (typeof document !== "undefined") {
        let portalContainer = document.getElementById("cursor-card-portal");
        if (!portalContainer) {
          portalContainer = document.createElement("div");
          portalContainer.id = "cursor-card-portal";
          document.body.appendChild(portalContainer);
        }
      }

      return () => {
        if (typeof document !== "undefined") {
          const portalContainer = document.getElementById("cursor-card-portal");
          if (portalContainer && portalContainer.childNodes.length === 0) {
            document.body.removeChild(portalContainer);
          }
        }
      };
    }, []);

    return (
      <>
        {trigger && (
          <Flex
            ref={triggerRef}
            onMouseEnter={() => !isTouchDevice && setIsHovering(true)}
            onMouseLeave={() => !isTouchDevice && setIsHovering(false)}
          >
            {trigger}
          </Flex>
        )}
        {isHovering &&
          !isTouchDevice &&
          typeof document !== "undefined" &&
          createPortal(
            <Flex
              zIndex={10}
              position="fixed"
              top="0"
              left="0"
              pointerEvents="none"
              ref={cardRef}
              className={`${styles.fadeIn} ${className || ""}`}
              style={{
                isolation: "isolate",
                transform: `translate(calc(${mousePosition.x}px ${placement.includes("left") ? "- 100%" : placement.includes("right") ? "" : "- 50%"}), calc(${mousePosition.y}px ${placement.includes("top") ? "- 100%" : placement.includes("bottom") ? "" : "- 50%"}))`,
                ...style,
              }}
              {...flex}
            >
              {overlay}
            </Flex>,
            document.getElementById("cursor-card-portal") || document.body,
          )}
      </>
    );
  },
);

CursorCard.displayName = "CursorCard";

export { CursorCard };
