"use client";

import React from "react";
import { Row, Text } from "../../components";
import { Swatch } from "./Swatch";
import { styles } from "../../../app/resources/data.config";
import { ChartStyles } from "./interfaces";

interface LegendProps {
  payload?: any[];
  labels?: "x" | "y" | "both" | "none";
  colors?: string[];
  direction?: "row" | "column";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  variant?: ChartStyles;
}

const Legend: React.FC<LegendProps> = ({
  payload,
  labels = "both",
  position = "top-left",
  direction,
  colors,
  variant = styles.variant
}) => {
  if (!payload || !payload.length) {
    return null;
  }

  const getPositionStyle = () => {
    switch (position) {
      case "top-left":
        return {
          paddingLeft: (labels === "y" || labels === "both") ? "var(--static-space-80)" : "var(--static-space-20)",
          top: "var(--static-space-12)"
        };
      case "top-right":
        return {
          paddingRight: "var(--static-space-20)",
          top: "var(--static-space-12)",
          justifyContent: "flex-end"
        };
      case "bottom-left":
        return {
          paddingLeft: "var(--static-space-20)",
          bottom: "var(--static-space-12)",
        };
      case "bottom-right":
        return {
          paddingRight: "var(--static-space-20)",
          bottom: "var(--static-space-12)",
          justifyContent: "flex-end"
        };
      case "top-center":
        return {
          left: "50%",
          top: "var(--static-space-12)",
          transform: "translateX(-50%)",
        };
      case "bottom-center":
        return {
          left: "50%",
          bottom: "var(--static-space-12)",
          transform: "translateX(-50%)",
        };
      default:
        return {
          paddingLeft: (labels === "y" || labels === "both") ? "var(--static-space-80)" : "var(--static-space-20)",
          top: "0.75rem"
        };
    }
  };

  const positionStyle = getPositionStyle();

  return (
    <Row
      wrap
      fillWidth
      horizontal={(position === "top-left" || position === "top-right" || position === "bottom-left" || position === "bottom-right") ? "start" : "center"}
      vertical="center"
      position="absolute"
      gap="16"
      pointerEvents="none"
      direction={direction}
      style={positionStyle}
    >
      {payload.map((entry: any, index: number) => {
        const color = colors && colors[index] ? colors[index] : (entry.stroke || entry.color);
        return (
          <Row key={index} vertical="center" gap="8">
            <Swatch 
              color={color} 
              size="m"
              variant={variant as ChartStyles}
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
