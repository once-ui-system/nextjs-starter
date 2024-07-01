"use client";

import React, { ReactNode, HTMLAttributes } from 'react';

import styles from './InlineCode.module.scss';

interface InlineCodeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
}

const InlineCode: React.FC<InlineCodeProps> = ({ children, ...props }) => {
    return (
        <span className={styles.inlineCode} {...props}>
            {children}
        </span>
    );
};

InlineCode.displayName = "InlineCode";

export { InlineCode };