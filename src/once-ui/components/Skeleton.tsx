"use client";

import React from 'react';
import classNames from 'classnames';

import styles from './Skeleton.module.scss';

interface SkeletonProps {
    shape: 'line' | 'circle';
    width?: 'xl' | 'l' | 'm' | 's' | 'xs';
    height?: 'xl' | 'l' | 'm' | 's' | 'xs';
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ shape, width, height, className }) => {
    const skeletonClasses = classNames(
        styles.skeleton,
        styles[shape],
        width && styles['w-' + width],
        height && styles['h-' + height],
        className
    );

    return <div className={skeletonClasses} />;
};

Skeleton.displayName = "Skeleton";

export { Skeleton };