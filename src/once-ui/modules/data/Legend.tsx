"use client";

import React from "react";
import { Row, Text } from "../../components";

interface LegendProps {
  payload?: any[];
  labels?: "x" | "y" | "both" | "none";
  colors?: string[];
  position?: "top" | "bottom" | "left" | "right";
}

const Legend: React.FC<LegendProps> = ({
  payload,
  labels = "both",
  position = "top"
}) => {
  if (!payload || !payload.length) {
    return null;
  }

  const getPositionStyle = () => {
    switch (position) {
      case "top":
        return {
          left: (labels === "y" || labels === "both") ? "80px" : "12px",
          top: "12px"
        };
      case "bottom":
        return {
          left: "50%",
          bottom: "12px",
          transform: "translateX(-50%)"
        };
      case "left":
        return {
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)"
        };
      case "right":
        return {
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)"
        };
      default:
        return {
          left: (labels === "y" || labels === "both") ? "80px" : "12px",
          top: "12px"
        };
    }
  };

  const positionStyle = getPositionStyle();

  return (
    <Row 
      horizontal={position === "left" || position === "right" ? "center" : "start"}
      vertical="center" 
      position="absolute"
      gap="16"
      style={positionStyle}
    >
      {payload.map((entry: any, index: number) => {
        return (
          <Row key={index} vertical="center" gap="8">
            <Row
              style={{
                backgroundClip: "padding-box",
                border: `1px solid ${entry.stroke || entry.color}`,
                background: `linear-gradient(to bottom, ${entry.stroke || entry.color} 0%, transparent 100%)`
              }}
              minWidth="16"
              minHeight="16"
              radius="s"
            />
            <Text variant="label-default-s">
              {entry.value}
            </Text>
          </Row>
        );
      })}
    </Row>
  );
};

export { Legend };
export type { LegendProps };
