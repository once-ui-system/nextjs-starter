"use client";

import React, { CSSProperties, forwardRef } from "react";
import classNames from "classnames";

import {
  FlexProps,
  SpacingProps,
  SizeProps,
  StyleProps,
  CommonProps,
  DisplayProps,
  ConditionalProps,
} from "../interfaces";
import { TextVariant, SpacingToken, ColorScheme, ColorWeight } from "../types";

interface ComponentProps
  extends FlexProps,
    SpacingProps,
    SizeProps,
    StyleProps,
    CommonProps,
    DisplayProps,
    ConditionalProps {}

const Flex = forwardRef<HTMLDivElement, ComponentProps>(
  (
    {
      as: Component = "div",
      inline,
      direction,
      justifyContent,
      alignItems,
      wrap = false,
      flex,
      textVariant,
      textSize,
      textWeight,
      textType,
      onBackground,
      onSolid,
      align,
      top,
      right,
      bottom,
      left,
      padding,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      paddingX,
      paddingY,
      margin,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      marginX,
      marginY,
      gap,
      negativeGap,
      position,
      width,
      height,
      maxWidth,
      minWidth,
      minHeight,
      maxHeight,
      fit = false,
      fitWidth = false,
      fitHeight = false,
      fill = false,
      fillWidth = false,
      fillHeight = false,
      hide,
      show,
      transition,
      tabletDirection,
      mobileDirection,
      background,
      solid,
      opacity,
      border,
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      borderStyle,
      borderWidth,
      radius,
      topRadius,
      rightRadius,
      bottomRadius,
      leftRadius,
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
      overflow,
      overflowX,
      overflowY,
      zIndex,
      shadow,
      cursor,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const generateClassName = (
      prefix: string,
      token: SpacingToken | undefined,
    ) => {
      return token ? `${prefix}-${token}` : undefined;
    };

    if (onBackground && onSolid) {
      console.warn(
        "You cannot use both 'onBackground' and 'onSolid' props simultaneously. Only one will be applied.",
      );
    }

    if (background && solid) {
      console.warn(
        "You cannot use both 'background' and 'solid' props simultaneously. Only one will be applied.",
      );
    }

    const getVariantClasses = (variant: TextVariant) => {
      const [fontType, weight, size] = variant.split("-");
      return [`font-${fontType}`, `font-${weight}`, `font-${size}`];
    };

    const sizeClass = textSize ? `font-${textSize}` : "";
    const weightClass = textWeight ? `font-${textWeight}` : "";

    const variantClasses = textVariant
      ? getVariantClasses(textVariant)
      : [sizeClass, weightClass];

    let colorClass = "";
    if (onBackground) {
      const [scheme, weight] = onBackground.split("-") as [
        ColorScheme,
        ColorWeight,
      ];
      colorClass = `${scheme}-on-background-${weight}`;
    } else if (onSolid) {
      const [scheme, weight] = onSolid.split("-") as [ColorScheme, ColorWeight];
      colorClass = `${scheme}-on-solid-${weight}`;
    }

    const generateDynamicClass = (type: string, value: string | undefined) => {
      if (!value) return undefined;
    
      if (["surface", "page", "overlay", "transparent"].includes(value)) {
        return `${value}-${type}`;
      }
    
      const parts = value.split("-");
      if (parts.includes("alpha")) {
        const [scheme, , weight] = parts;
        return `${scheme}-${type}-alpha-${weight}`;
      }
    
      const [scheme, weight] = value.split("-") as [ColorScheme, ColorWeight];
      return `${scheme}-${type}-${weight}`;
    };       

    const classes = classNames(
      inline ? "display-inline-flex" : "display-flex",
      generateClassName("p", padding),
      generateClassName("pl", paddingLeft),
      generateClassName("pr", paddingRight),
      generateClassName("pt", paddingTop),
      generateClassName("pb", paddingBottom),
      generateClassName("px", paddingX),
      generateClassName("py", paddingY),
      generateClassName("m", margin),
      generateClassName("ml", marginLeft),
      generateClassName("mr", marginRight),
      generateClassName("mt", marginTop),
      generateClassName("mb", marginBottom),
      generateClassName("mx", marginX),
      generateClassName("my", marginY),
      generateClassName("g", gap),
      generateClassName("top", top),
      generateClassName("right", right),
      generateClassName("bottom", bottom),
      generateClassName("left", left),
      generateDynamicClass("background", background),
      generateDynamicClass("solid", solid),
      generateDynamicClass("border", border || borderTop || borderRight || borderBottom || borderLeft),
      (border || borderTop || borderRight || borderBottom || borderLeft) && !borderStyle && "border-solid",
      border && !borderWidth && `border-1`,
      (borderTop || borderRight || borderBottom || borderLeft) && "border-reset",
      borderTop && "border-top-1",
      borderRight && "border-right-1",
      borderBottom && "border-bottom-1",
      borderLeft && "border-left-1",
      borderWidth && `border-${borderWidth}`,
      borderStyle && `border-${borderStyle}`,
      radius === "full" ? "radius-full" : radius && `radius-${radius}`,
      topRadius && `radius-${topRadius}-top`,
      rightRadius && `radius-${rightRadius}-right`,
      bottomRadius && `radius-${bottomRadius}-bottom`,
      leftRadius && `radius-${leftRadius}-left`,
      topLeftRadius && `radius-${topLeftRadius}-top-left`,
      topRightRadius && `radius-${topRightRadius}-top-right`,
      bottomLeftRadius && `radius-${bottomLeftRadius}-bottom-left`,
      bottomRightRadius && `radius-${bottomRightRadius}-bottom-right`,
      negativeGap && `gap-${direction === 'column' ? 'vertical' : 'horizontal'}--${negativeGap}`,
      direction === "column" && "flex-column",
      direction === "row" && "flex-row",
      tabletDirection === "column" && "m-flex-column",
      tabletDirection === "row" && "m-flex-row",
      mobileDirection === "column" && "s-flex-column",
      mobileDirection === "row" && "s-flex-row",
      transition && `transition-${transition}`,
      hide === "s" && "s-flex-hide",
      hide === "m" && "m-flex-hide",
      show === "s" && "s-flex-show",
      show === "m" && "m-flex-show",
      opacity && `opacity-${opacity}`,
      wrap && `flex-wrap`,
      overflow && `overflow-${overflow}`,
      overflowX && `overflow-${overflowX}`,
      overflowY && `overflow-${overflowY}`,
      fit && "fit",
      flex && `flex-${flex}`,
      justifyContent && `justify-${justifyContent}`,
      alignItems && `align-${alignItems}`,
      fitWidth && "fit-width",
      fitHeight && "fit-height",
      fill && "fill",
      fillWidth && "fill-width",
      fillHeight && "fill-height",
      shadow && `shadow-${shadow}`,
      position && `position-${position}`,
      zIndex && `z-index-${zIndex}`,
      textType && `font-${textType}`,
      cursor && `cursor-${cursor}`,
      colorClass,
      className,
      ...variantClasses,
    );

    const parseDimension = (
      value: number | SpacingToken | undefined,
      type: "width" | "height",
    ): string | undefined => {
      if (value === undefined) return undefined;
      if (typeof value === "number") return `${value}rem`;
      if (
        [
          "0",
          "1",
          "2",
          "4",
          "8",
          "12",
          "16",
          "20",
          "24",
          "32",
          "40",
          "48",
          "56",
          "64",
          "80",
          "104",
          "128",
          "160",
        ].includes(value)
      ) {
        return `var(--static-space-${value})`;
      }
      if (["xs", "s", "m", "l", "xl"].includes(value)) {
        return `var(--responsive-${type}-${value})`;
      }
      return undefined;
    };

    const combinedStyle: CSSProperties = {
      maxWidth: parseDimension(maxWidth, "width"),
      minWidth: parseDimension(minWidth, "width"),
      minHeight: parseDimension(minHeight, "height"),
      maxHeight: parseDimension(maxHeight, "height"),
      width: parseDimension(width, "width"),
      height: parseDimension(height, "height"),
      textAlign: align,
      ...style,
    };

    return (
      <Component ref={ref} className={classes} style={combinedStyle} {...rest}>
        {children}
      </Component>
    );
  },
);

Flex.displayName = "Flex";
export { Flex };
