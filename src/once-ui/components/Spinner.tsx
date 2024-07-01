import React from 'react';
import classNames from 'classnames';

import styles from './Spinner.module.scss';

interface SpinnerProps {
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    className?: string;
    style?: React.CSSProperties;
}

const Spinner: React.FC<SpinnerProps> = ({
    size = 'm',
    className,
    style }) => {
    return (
        <div className={classNames(styles.bounding, styles[size], className)} style={style}>
            <div className={classNames(styles.spinner)}/>
        </div>
    );
};

Spinner.displayName = "Spinner";

export { Spinner };