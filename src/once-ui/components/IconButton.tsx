"use client";

import React, { forwardRef, useState, useEffect } from 'react';
import Link from 'next/link';

import { Icon, Tooltip } from '.';
import buttonStyles from './Button.module.scss';
import iconStyles from './IconButton.module.scss';

interface CommonProps {
    icon?: string;
    size?: 's' | 'm' | 'l';
    tooltip?: string;
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
    className?: string;
    style?: React.CSSProperties;
    href?: string;
}

export type IconButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
export type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const isExternalLink = (url: string) => /^https?:\/\//.test(url);

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps | AnchorProps>(({
    icon = 'refresh',
    size = 'm',
    tooltip,
    tooltipPosition = 'top',
    variant = 'primary',
    className,
    style,
    href,
    ...props
}, ref) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isHover) {
            timer = setTimeout(() => {
                setTooltipVisible(true);
            }, 400);
        } else {
            setTooltipVisible(false);
        }

        return () => clearTimeout(timer);
    }, [isHover]);

    const iconSize = size === 's' ? 's' : 'm';

    const content = (
        <>
            <Icon
                name={icon}
                size={iconSize}/>
            {tooltip && isTooltipVisible && (
                <div style={{ position: "absolute" }} className={iconStyles[tooltipPosition]}>
                    <Tooltip label={tooltip}/>
                </div>
            )}
        </>
    );

    const commonProps = {
        className: `${buttonStyles.button} ${buttonStyles[variant]} ${iconStyles[size]} ${className || ''}`,
        style: { ...style },
        onMouseEnter: () => setIsHover(true),
        onMouseLeave: () => setIsHover(false)
    };

    if (href) {
        const isExternal = isExternalLink(href);

        if (isExternal) {
            return (
                <a
                    {...commonProps}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                    {content}
                </a>
            );
        }

        return (
            <Link href={href}
                {...commonProps}
                {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {content}
            </Link>
        );
    }

    return (
        <button
            ref={ref}
            {...commonProps}
            {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
            {content}
        </button>
    );
});

IconButton.displayName = "IconButton";

export { IconButton };
