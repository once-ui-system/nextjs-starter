
"use client";

import React, { ElementType, ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";
import classNames from "classnames";
import { CommonProps, SpacingProps } from "@/once-ui/interfaces";
import { ColorScheme, ColorWeight, SpacingToken } from "@/once-ui/types";

type SVGProps<T extends ElementType> =
    ComponentPropsWithoutRef<"svg"> &
    CommonProps &
    SpacingProps & {
    as?: T;
    colorScheme?: ColorScheme;
    colorWeight?: ColorWeight;
    strokeScheme?: ColorScheme;
    strokeWeight?: ColorWeight;
    interactive?: boolean;
    size?: "x" | "s" | "m" | "l" | "xl";
    children?: ReactNode;
};

function getColorClass(type: "fill" | "stroke", scheme?: ColorScheme, weight?: ColorWeight) {
    return scheme ? `${type}-${scheme}-${weight}` : "";
}

function getSpacingClass(prefix: string, token?: SpacingToken) {
    return token ? `${prefix}-${token}` : "";
}

const SVG = forwardRef<SVGSVGElement, SVGProps<ElementType>>(function SVG(
    {
        as,
        colorScheme = "neutral",
        colorWeight = "weak",
        strokeScheme,
        strokeWeight = "weak",
        interactive = false,
        size = "m",
        padding,
        margin,
        className,
        style,
        children,
        ...rest
    },
    ref
) {
    const Component = as || "svg";
    const classes = classNames(
        "transition-colors",
        getColorClass("fill", colorScheme, colorWeight),
        getColorClass("stroke", strokeScheme, strokeWeight),
        getSpacingClass("p", padding),
        getSpacingClass("m", margin),
        {
            "cursor-pointer hover:scale-105": interactive,
            "opacity-hoverable": interactive,
        },
        className
    );

    return (
        <Component
            ref={ref}
            className={classes}
            style={{ width: size, height: size, ...style }}
            {...rest}
        >
            {children}
        </Component>
    );
});

SVG.displayName = "SVG";

export { SVG };
