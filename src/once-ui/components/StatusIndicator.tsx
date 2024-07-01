"use client";

import React from 'react';
import classNames from 'classnames';

import styles from './StatusIndicator.module.scss';

interface StatusIndicatorProps {
    size: 's' | 'm' | 'l';
    color: 'green' | 'yellow' | 'red' | 'gray';
    className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ size, color, className }) => {
    return (
        <div
            className={classNames(styles.statusIndicator, styles[size], styles[color], className)}/>
    );
};

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };