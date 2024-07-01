"use client";

import React, { CSSProperties, ReactNode, ElementType, HTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';

import { SpacingToken } from '../types';

type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

type Scheme = 'neutral' | 'brand' | 'accent' | 'info' | 'danger' | 'warning' | 'success';
type Weight = 'weak' | 'medium' | 'strong';

type RadiusSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
type RadiusNest = '4' | '8';

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
    as?: ElementType;
    direction?: 'row' | 'column';
    justifyContent?: CSSProperties['justifyContent'];
    alignItems?: CSSProperties['alignItems'];
    padding?: SpacingToken;
    paddingLeft?: SpacingToken;
    paddingRight?: SpacingToken;
    paddingTop?: SpacingToken;
    paddingBottom?: SpacingToken;
    paddingX?: SpacingToken;
    paddingY?: SpacingToken;
    margin?: SpacingToken;
    marginLeft?: SpacingToken;
    marginRight?: SpacingToken;
    marginTop?: SpacingToken;
    marginBottom?: SpacingToken;
    marginX?: SpacingToken;
    marginY?: SpacingToken;
    gap?: SpacingToken;
    wrap?: boolean;
    flex?: number;
    position?: Position;
    width?: number;
    height?: number;
    maxWidth?: number;
    minWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    fillWidth?: boolean;
    fillHeight?: boolean;
    hide?: 's' | 'm';
    show?: 's' | 'm';
    tabletDirection?: 'row' | 'column';
    mobileDirection?: 'row' | 'column';
    background?: `${Scheme}-${Weight}` | 'surface' | 'page' | 'transparent';
    alpha?: `${Scheme}-${Weight}`;
    solid?: `${Scheme}-${Weight}`;
    border?: `${Scheme}-${Weight}` | 'surface' | 'transparent';
    borderStyle?: 'solid-1' | 'solid-2';
    radius?: RadiusSize | `${RadiusSize}-${RadiusNest}`;
    overflowX?: CSSProperties['overflowX'];
    overflowY?: CSSProperties['overflowY'];
    zIndex?: CSSProperties['zIndex'];
    className?: string;
    children?: ReactNode;
    style?: React.CSSProperties;
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(({
    as: Component = 'div',
    direction,
    justifyContent,
    alignItems,
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
    wrap = false,
    flex,
    position,
    width,
    height,
    maxWidth,
    minWidth,
    minHeight,
    maxHeight,
    fillWidth = false,
    fillHeight = false,
    hide,
    show,
    tabletDirection,
    mobileDirection,
    background,
    solid,
    alpha,
    border,
    borderStyle,
    radius,
    overflowX,
    overflowY,
    zIndex,
    className,
    style,
    children,
    ...rest
}, ref) => {
    const generateClassName = (prefix: string, token: SpacingToken | undefined) => {
        return token ? `${prefix}-${token}` : undefined;
    };

    if (background && solid) {
        console.warn("You cannot use both 'background' and 'solid' props simultaneously. Only one will be applied.");
    }

    const classes = classNames(
        'flex',
        className,
        generateClassName('p', padding),
        generateClassName('pl', paddingLeft),
        generateClassName('pr', paddingRight),
        generateClassName('pt', paddingTop),
        generateClassName('pb', paddingBottom),
        generateClassName('px', paddingX),
        generateClassName('py', paddingY),
        generateClassName('m', margin),
        generateClassName('ml', marginLeft),
        generateClassName('mr', marginRight),
        generateClassName('mt', marginTop),
        generateClassName('mb', marginBottom),
        generateClassName('mx', marginX),
        generateClassName('my', marginY),
        generateClassName('g', gap),
        direction === 'column' && 'flex-column',
        direction === 'row' && 'flex-row',
        tabletDirection === 'column' && 'm-flex-direction-column',
        tabletDirection === 'row' && 'm-flex-direction-row',
        mobileDirection === 'column' && 's-flex-direction-column',
        mobileDirection === 'row' && 's-flex-direction-row',
        background && !solid && `background-${background}`,
        alpha && `alpha-${alpha}`,
        solid && `solid-${solid}`,
        border && `border-${border}`,
        borderStyle && `border-${borderStyle}`,
        radius === 'full' ? 'radius-full' : radius && `radius-${radius}`,
        hide === 's' && 's-flex-hide',
        hide === 'm' && 'm-flex-hide',
        show === 's' && 's-flex-show',
        show === 'm' && 'm-flex-show',
    );

    const combinedStyle: CSSProperties = {
        flexDirection: direction,
        justifyContent,
        alignItems,
        flexWrap: wrap ? 'wrap' : undefined,
        flex: flex !== undefined ? flex.toString() : undefined,
        maxWidth: maxWidth ? `${maxWidth}rem` : undefined,
        minWidth: minWidth ? `${minWidth}rem` : undefined,
        minHeight: minHeight ? `${minHeight}rem` : undefined,
        maxHeight: maxHeight ? `${maxHeight}rem` : undefined,
        width: fillWidth ? '100%' : width ? `${width}rem` : undefined,
        height: fillHeight ? '100%' : height ? `${height}rem` : undefined,
        position,
        overflowX,
        overflowY,
        zIndex,
        ...style,
    };

    return (
        <Component
            ref={ref}
            className={classes}
            style={combinedStyle}
            {...rest}>
            {children}
        </Component>
    );
});

Flex.displayName = "Flex";

export { Flex };