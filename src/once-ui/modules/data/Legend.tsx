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
  position = "top",
  colors
}) => {
  if (!payload || !payload.length) {
    return null;
  }

  const getPositionStyle = () => {
    switch (position) {
      case "top":
        return {
          left: (labels === "y" || labels === "both") ? "88px" : "12px",
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
          left: (labels === "y" || labels === "both") ? "88px" : "12px",
          top: "12px"
        };
    }
  };

  const positionStyle = getPositionStyle();

  return (
    <Row
      wrap
      horizontal={position === "left" || position === "right" ? "center" : "start"}
      vertical="center" 
      position="absolute"
      gap="16"
      style={positionStyle}
    >
      {payload.map((entry: any, index: number) => {
        const color = colors && colors[index] ? colors[index] : (entry.stroke || entry.color);
        return (
          <Row key={index} vertical="center" gap="8">
            <Row
              style={{
                backgroundClip: "padding-box",
                border: `1px solid ${color}`,
                background: `linear-gradient(to bottom, ${color} 0%, transparent 100%)`
              }}
              minWidth="16"
              minHeight="16"
              radius="s"
            />
            <Text variant="label-default-s" wrap="nowrap">
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
