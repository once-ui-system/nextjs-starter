"use client";

import React from "react";
import { Row } from "../../components";
import { RadiusSize, SpacingToken } from "../../types";
import { chart } from "../../../app/resources/data.config";
import { ChartStyles } from "./interfaces";

export interface SwatchProps {
  color: string;
  size?: "s" | "m";
  variant?: ChartStyles;
}

export const Swatch: React.FC<SwatchProps> = ({ color, size = "m", variant = chart.variant }) => {
  const sizeMap: Record<
    string,
    { minWidth: SpacingToken; minHeight: SpacingToken; radius: RadiusSize }
  > = {
    s: {
      minWidth: "12",
      minHeight: "12",
      radius: "xs",
    },
    m: {
      minWidth: "16",
      minHeight: "16",
      radius: "s",
    },
  };

  const getStyleByVariant = () => {
    const baseStyle = {
      backgroundClip: "padding-box",
      border: `1px solid ${color}`,
    };

    switch (variant) {
      case "flat":
        return {
          ...baseStyle,
          background: color,
        };
      case "outline":
        return {
          ...baseStyle,
          background: "transparent",
        };
      case "gradient":
      default:
        return {
          ...baseStyle,
          background: `linear-gradient(to bottom, ${color} 0%, transparent 100%)`,
        };
    }
  };

  return (
    <Row
      style={getStyleByVariant()}
      minWidth={sizeMap[size].minWidth}
      minHeight={sizeMap[size].minHeight}
      radius={sizeMap[size].radius}
    />
  );
};
