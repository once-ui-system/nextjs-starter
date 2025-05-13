"use client";

import styles from "./ProgressRing.module.scss";
import { Column, Text } from "@/once-ui/components";
import { SVG } from "@/app/components/svg/SVG";

interface ProgressRingProps {
    value: number;
    size?: "s" | "m" | "l";
    tone?: "primary" | "warning" | "success";
    label?: string;
}

export const ProgressRing = ({
                                 value,
                                 size = "s",
                                 tone = "primary",
                                 label
                             }: ProgressRingProps) => {
    const strokeWidth = 4;
    const radius = {
        s: 30,
        m: 45,
        l: 60
    }[size];

    const normalizedRadius = radius - strokeWidth;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <Column
            className={`
        ${styles.container}
        ${styles[`size-${size}`]}
        ${styles[`tone-${tone}`]}
      `}
        >
            <SVG
                className={styles.svg}
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            >
                <circle
                    className={styles.background}
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className={styles.progress}
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset }}
                />
            </SVG>

            {label && (
                <Text
                    variant="body-strong-m"
                    className={styles.label}
                >
                    {label}
                </Text>
            )}
        </Column>
    );
};