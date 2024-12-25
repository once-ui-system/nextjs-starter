'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './HoloFx.module.scss';
import { Flex } from '.';
import { CSSProperties } from 'react';

interface MaskOptions {
    maskPosition?: string;
}

interface HoloFxProps extends React.ComponentProps<typeof Flex> {
    children: React.ReactNode;
    light?: {
        opacity?: number;
        filter?: string;
        blending?: CSSProperties['mixBlendMode'];
        mask?: MaskOptions;
    };
    burn?: {
        opacity?: number;
        filter?: string;
        blending?: CSSProperties['mixBlendMode'];
        mask?: MaskOptions;
    };
    texture?: {
        opacity?: number;
        filter?: string;
        blending?: CSSProperties['mixBlendMode'];
        image?: string;
        mask?: MaskOptions;
    };
}

const formatMask = (maskPosition: string = '100 200'): string => {
    const [x, y] = maskPosition.split(' ');
    const formattedX = `${x}%`;
    const formattedY = `${y ? y : x}%`;
    return `radial-gradient(ellipse ${formattedX} ${formattedY} at var(--gradient-pos-x, 50%) var(--gradient-pos-y, 50%), black 50%, transparent 100%)`;
};

const getMaskStyle = (mask?: MaskOptions): string => {
    return mask?.maskPosition ? formatMask(mask.maskPosition) : formatMask();
};

const HoloFx: React.FC<HoloFxProps> = ({ 
    children,
    light,
    burn,
    texture,
    ...props
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    let lastCall = 0;

    const lightDefaults = {
        opacity: 0.3,
        blending: 'color-dodge' as CSSProperties['mixBlendMode'],
        mask: getMaskStyle(light?.mask),
        ...light,
    };

    const burnDefaults = {
        opacity: 0.3,
        filter: 'brightness(0.2) contrast(2)',
        blending: 'color-dodge' as CSSProperties['mixBlendMode'],
        mask: getMaskStyle(burn?.mask),
        ...burn,
    };

    const textureDefaults = {
        opacity: 0.1,
        blending: 'color-dodge' as CSSProperties['mixBlendMode'],
        image: 'repeating-linear-gradient(-45deg, var(--static-white) 0, var(--static-white) 1px, transparent 3px, transparent 2px)',
        mask: getMaskStyle(texture?.mask),
        ...texture,
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const now = Date.now();
            if (now - lastCall < 16) return;
            lastCall = now;

            const element = ref.current;
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = ((offsetX - centerX) / centerX) * 100;
            const deltaY = ((offsetY - centerY) / centerY) * 100;

            element.style.setProperty('--gradient-pos-x', `${deltaX}%`);
            element.style.setProperty('--gradient-pos-y', `${deltaY}%`);
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <Flex
            position="relative"
            style={{ overflow: 'hidden' }}
            zIndex={0}
            ref={ref}
            className={styles.HoloFx}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}>
            <Flex fillWidth fillHeight className={styles.base}>
                {children}
            </Flex>
            <Flex
                position="absolute"
                fillWidth fillHeight
                className={styles.overlay1}
                style={{
                    transform: 'translateX(1px) translateY(1px)',
                    pointerEvents: 'none',
                    opacity: isHovered ? burnDefaults.opacity : 0,
					transition: 'opacity 0.3s ease-in-out',
                    filter: burnDefaults.filter,
                    mixBlendMode: burnDefaults.blending,
                    maskImage: burnDefaults.mask as string,
                }}>
                {children}
            </Flex>
            <Flex
                position="absolute"
                fillWidth fillHeight
                className={styles.overlay1}
                style={{
                    transform: 'translateX(-1px) translateY(-1px)',
                    pointerEvents: 'none',
                    opacity: isHovered ? lightDefaults.opacity : 0,
					transition: 'opacity 0.3s ease-in-out',
                    filter: lightDefaults.filter,
                    mixBlendMode: lightDefaults.blending,
                    maskImage: lightDefaults.mask as string,
                }}>
                {children}
            </Flex>
            <Flex
                position="absolute"
                fillWidth fillHeight
                className={styles.overlay2}
                style={{
                    pointerEvents: 'none',
                    opacity: isHovered ? textureDefaults.opacity : 0,
                    backgroundImage: textureDefaults.image,
                    backgroundSize: '150% 150%',
                    backgroundPosition: 'center',
                    transform: `translateX(calc(var(--gradient-pos-x) / 50))`,
                    filter: textureDefaults.filter,
                    mixBlendMode: textureDefaults.blending,
                    maskImage: textureDefaults.mask as string,
                }}>
            </Flex>
        </Flex>
    );
};

HoloFx.displayName = 'HoloFx';
export { HoloFx };