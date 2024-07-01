"use client"

import React, { useEffect, useState } from 'react';
import { IconButton, Icon, Flex, Text } from '.';
import styles from './Toast.module.scss';

interface ToastProps {
    className?: string;
    variant: 'success' | 'danger';
    icon?: boolean;
    onClose?: () => void;
    action?: React.ReactNode;
    children: React.ReactNode;
}

const iconMap = {
    success: 'checkCircle',
    danger: 'errorCircle'
};

const Toast: React.FC<ToastProps> = ({
        variant,
        className,
        icon = true,
        onClose,
        action, 
        children }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 6000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!visible && onClose) {
            onClose();
        }
    }, [visible, onClose]);

    return (
        <Flex
            fillWidth
            background='surface'
            radius="l"
            paddingY="12"
            paddingX="20"
            border="neutral-medium"
            borderStyle="solid-1"
            className={`${className || ''} ${styles.toast} ${styles[variant]} ${visible ? styles.visible : styles.hidden}`}>
            <Flex
                fillWidth
                alignItems="center"
                gap="8">
                {icon &&
                    <Icon
                        size="l"
                        onBackground={`${variant}-medium`}
                        name={iconMap[variant]}/>
                }
                <Text
                    variant="body-default-s"
                    style={{width: '100%'}}
                    as="div">
                    {children}
                </Text>
                {action &&
                    <div>
                        {action}
                    </div>
                }
                {onClose && (
                    <IconButton
                        variant="ghost"
                        icon="close"
                        size="m"
                        tooltip="Hide"
                        tooltipPosition="top"
                        onClick={() => setVisible(false)}/>
                )}
            </Flex>
        </Flex>
    );
};

export { Toast };