"use client";

import React, { ReactNode, useEffect, useCallback, useRef, MouseEventHandler } from 'react';
import ReactDOM from 'react-dom';

import { Flex, Heading, IconButton, Button, ButtonProps } from '.';
import styles from './Dialog.module.scss';

interface DialogButtonProps extends Partial<ButtonProps> {
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    primaryButtonProps: DialogButtonProps;
    secondaryButtonProps?: DialogButtonProps;
    dangerButtonProps?: DialogButtonProps;
    style?: React.CSSProperties;
    className?: string;
}

const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    title,
    children,
    primaryButtonProps,
    secondaryButtonProps,
    dangerButtonProps,
    style,
    className
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
        if (event.key === 'Tab' && dialogRef.current) {
            const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
        if (isOpen && dialogRef.current) {
            const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            firstElement.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <Flex
            className={`${styles.overlay} ${className || ''}`}
            style={style}
            justifyContent="center"
            alignItems="center"
            alpha="neutral-medium">
            <Flex
                className={styles.dialog}
                ref={dialogRef}
                fillWidth
                maxWidth={40}
                radius="l"
                border="neutral-medium"
                borderStyle="solid-1"
                background="neutral-weak"
                direction="column">
                <Flex
                    as="header"
                    justifyContent="space-between"
                    alignItems="center"
                    padding="24">
                    <Heading
                        variant="heading-strong-l">
                        {title}
                    </Heading>
                    <IconButton
                        icon="close"
                        size="m"
                        variant="tertiary"
                        tooltip="Close"
                        onClick={onClose}/>
                </Flex>
                <Flex
                    as="section"
                    padding="24">
                    {children}
                </Flex>
                <Flex
                    as="footer"
                    justifyContent="space-between"
                    padding="24">
                    {dangerButtonProps && (
                        <Button
                            {...dangerButtonProps}
                            variant='danger'
                            size='m'/>
                    )}
                    <Flex
                        gap="8">
                        {secondaryButtonProps && (
                            <Button
                                {...secondaryButtonProps}
                                variant='secondary'
                                size='m'/>
                        )}
                        <Button
                            {...primaryButtonProps}
                            variant='primary'
                            size='m'/>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>,
        document.body
    );
};

Dialog.displayName = "Dialog";

export { Dialog };