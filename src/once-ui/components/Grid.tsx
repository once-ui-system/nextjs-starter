"use client";

import React, { CSSProperties, ReactNode, ElementType, HTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';

import { SpacingToken } from '../types';
import styles from './Grid.module.scss';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
	as?: ElementType;
	columns?: number | string;
	rows?: number | string;
	gap?: SpacingToken;
	tabletColumns?: '1col' | '2col' | '3col';
	mobileColumns?: '1col' | '2col' | '3col';
	tabletRows?: number | string;
	mobileRows?: number | string;
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
	width?: number;
	height?: number;
	maxWidth?: number;
	minWidth?: number;
	minHeight?: number;
	maxHeight?: number;
	fillWidth?: boolean;
	fillHeight?: boolean;
	overflowX?: CSSProperties['overflowX'];
	overflowY?: CSSProperties['overflowY'];
	zIndex?: CSSProperties['zIndex'];
	className?: string;
	children: ReactNode;
	style?: React.CSSProperties;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(({
	as: Component = 'div',
	columns,
	rows,
	gap,
	tabletColumns,
	mobileColumns,
	tabletRows,
	mobileRows,
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
	width,
	height,
	maxWidth,
	minWidth,
	minHeight,
	maxHeight,
	fillWidth = false,
	fillHeight = false,
	overflowX,
	overflowY,
	zIndex,
	className,
	style,
	children,
	...rest
}, ref) => {
	const generateClassName = (
		prefix: string,
		token: SpacingToken | undefined) => {
		return token ? `${prefix}-${token}` : undefined;
	};

	const classes = classNames(
		styles.grid,
		className,
		fillWidth && styles.fillWidth,
		tabletColumns && styles[`tablet-${tabletColumns}`],
		mobileColumns && styles[`mobile-${mobileColumns}`],
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
	);

	const combinedStyle: CSSProperties = {
		gridTemplateColumns: columns,
		gridTemplateRows: rows,
		gap,
		maxWidth: maxWidth ? `${maxWidth}rem` : undefined,
		minWidth: minWidth ? `${minWidth}rem` : undefined,
		minHeight: minHeight ? `${minHeight}rem` : undefined,
		maxHeight: maxHeight ? `${maxHeight}rem` : undefined,
		width: fillWidth ? '100%' : width ? `${width}rem` : undefined,
		height: fillHeight ? '100%' : height ? `${height}rem` : undefined,
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

Grid.displayName = "Grid";

export { Grid };
export type { GridProps };