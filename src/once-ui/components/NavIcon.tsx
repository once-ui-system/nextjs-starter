import React, { forwardRef } from 'react';
import styles from './NavIcon.module.scss';
import { Flex } from '.';
import classNames from 'classnames';

interface NavIconProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    isActive: boolean;
}

const NavIcon = forwardRef<HTMLDivElement, Partial<NavIconProps>>(({
    className,
    isActive,
    style,
    onClick
}, ref) => {

    return (
        <Flex
            ref={ref}
            tabIndex={0}
            radius="m"
            position="relative"
            className={classNames(styles.button, className || '')}
            style={{ ...style }}
            onClick={onClick}>
            <div className={classNames(styles.line, isActive && styles.active)} />
            <div className={classNames(styles.line, isActive && styles.active)} />
        </Flex>
    );
});

NavIcon.displayName = 'NavIcon';

export { NavIcon };