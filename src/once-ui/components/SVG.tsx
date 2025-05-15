"use client";

import React, { ElementType, ComponentPropsWithoutRef } from "react";
import classNames from "classnames";
import {CommonProps, SpacingProps} from "@/once-ui/interfaces";
import {ColorScheme, ColorWeight, SpacingToken} from "@/once-ui/types";

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
};

export const SVG = <T extends ElementType = "svg">({
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
                                                ...props
                                            }: SVGProps<T>) => {
    const Component = as || "svg";

    const generateColorClass = (
        type: "fill" | "stroke",
        scheme?: ColorScheme,
        weight?: ColorWeight
    ) => {
        if (!scheme) return "";
        return `${type}-${scheme}-${weight}`;
    };

    const generateSpacingClass = (prefix: string, token?: SpacingToken) => {
        return token ? `${prefix}-${token}` : "";
    };

    const classes = classNames(
        "transition-colors",
        generateColorClass("fill", colorScheme, colorWeight),
        generateColorClass("stroke", strokeScheme, strokeWeight),
        generateSpacingClass("p", padding),
        generateSpacingClass("m", margin),
        {
            "cursor-pointer hover:scale-105": interactive,
            "opacity-hoverable": interactive
        },
        className
    );

    return (
        <Component
            className={classes}
            style={{
                width: size,
                height: size,
                ...style
            }}
            {...props}
        >
            {children}
        </Component>
    );
};