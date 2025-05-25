"use client";

import React from "react";

interface GradientStop {
  offset: string;
  opacity: number;
  variant?: "flat" | "gradient" | "outline";
}

interface LinearGradientProps {
  id: string;
  color: string;
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  stops?: GradientStop[];
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
}

const defaultStops: GradientStop[] = [
  { offset: "0%", opacity: 0.8 },
  { offset: "100%", opacity: 0 }
];

export const LinearGradient: React.FC<LinearGradientProps> = ({
  id,
  color,
  x1 = "0",
  y1 = "0",
  x2 = "0",
  y2 = "1",
  stops = defaultStops
}) => {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      {stops.map(({ offset, opacity }) => (
        <stop
          key={offset}
          offset={offset}
          stopColor={color.startsWith("var(--") ? color : `var(--data-${color})`}
          stopOpacity={opacity}
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
  stops = defaultStops
}) => {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r} fx={fx} fy={fy}>
      {stops.map(({ offset, opacity }) => (
        <stop
          key={offset}
          offset={offset}
          stopColor={color.startsWith("var(--") ? color : `var(--data-${color})`}
          stopOpacity={opacity}
        />
      ))}
    </radialGradient>
  );
};
