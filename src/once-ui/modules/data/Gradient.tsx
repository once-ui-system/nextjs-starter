"use client";

import React from "react";
import { chart } from "../../../app/resources/data.config";
import { ChartStyles } from "./interfaces";

interface GradientStop {
  offset: string;
  opacity: number;
  variant?: ChartStyles;
}

interface LinearGradientProps {
  id: string;
  color: string;
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  stops?: GradientStop[];
  variant?: ChartStyles;
}

interface RadialGradientProps {
  id: string;
  color: string;
  cx?: string;
  cy?: string;
  r?: string;
  fx?: string;
  fy?: string;
  stops?: GradientStop[];
  variant?: ChartStyles;
}

const getStopsByVariant = (variant: ChartStyles = "gradient", isRadial: boolean = false): GradientStop[] => {
  if (isRadial) {
    // For radial gradients, we invert the opacity for better visual effect
    switch (variant) {
      case "flat":
        return [
          { offset: "0%", opacity: 1 },
          { offset: "100%", opacity: 1 }
        ];
      case "outline":
        return [
          { offset: "0%", opacity: 0 },
          { offset: "100%", opacity: 0 }
        ];
      case "gradient":
      default:
        return [
          { offset: "0%", opacity: 0 },
          { offset: "100%", opacity: 1 }
        ];
    }
  } else {
    // For linear gradients
    switch (variant) {
      case "flat":
        return [
          { offset: "0%", opacity: 1 },
          { offset: "100%", opacity: 1 }
        ];
      case "outline":
        return [
          { offset: "0%", opacity: 0 },
          { offset: "100%", opacity: 0 }
        ];
      case "gradient":
      default:
        return [
          { offset: "0%", opacity: 1 },
          { offset: "100%", opacity: 0 }
        ];
    }
  }
};

export const LinearGradient: React.FC<LinearGradientProps> = ({
  id,
  color,
  x1 = "0",
  y1 = "0",
  x2 = "0",
  y2 = "1",
  stops,
  variant = chart.variant
}) => {
  const gradientStops = stops || getStopsByVariant(variant as ChartStyles);
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      {gradientStops.map((stop, index) => (
        <stop
          key={index}
          offset={stop.offset}
          stopColor={color}
          stopOpacity={stop.opacity}
        />
      ))}
    </linearGradient>
  );
};

export const RadialGradient: React.FC<RadialGradientProps> = ({
  id,
  color,
  cx = "50%",
  cy = "50%",
  r = "50%",
  fx = "50%",
  fy = "50%",
  stops,
  variant = chart.variant
}) => {
  const gradientStops = stops || getStopsByVariant(variant as ChartStyles, true);
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r} fx={fx} fy={fy}>
      {gradientStops.map((stop, index) => (
        <stop
          key={index}
          offset={stop.offset}
          stopColor={color}
          stopOpacity={stop.opacity}
        />
      ))}
    </radialGradient>
  );
};
