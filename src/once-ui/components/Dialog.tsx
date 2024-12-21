"use client";

import React, { ReactNode, useEffect, useCallback, useRef, forwardRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Flex, Heading, IconButton, Text } from '.';
import styles from './Dialog.module.scss';

interface DialogProps extends Omit<React.ComponentProps<typeof Flex>, 'title'> {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    base?: boolean;
    stack?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onHeightChange?: (height: number) => void;
    minHeight?: number;
}

const Dialog: React.FC<DialogProps> = forwardRef<HTMLDivElement, DialogProps>(({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    base = false,
    style,
    className,
    onHeightChange,
    minHeight,
    ...rest
}, ref) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
      if (isOpen) {
          setIsVisible(true);
          setTimeout(() => setIsAnimating(true), 25);
      } else {
          setIsAnimating(false);
          const timeout = setTimeout(() => setIsVisible(false), 300);
          return () => clearTimeout(timeout);
      }
  }, [isOpen]);

  useEffect(() => {
    if (dialogRef.current && isVisible) {
      const height = dialogRef.current.offsetHeight;
      onHeightChange?.(height);
    }
  }, [isVisible, onHeightChange]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
      if (event.key === 'Escape' && !base) {
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
  }, [onClose, base]);

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

  if (!isVisible) return null;

  return ReactDOM.createPortal(
      <Flex
          ref={ref}
          transition="macro-medium"
          background="overlay"
          position="fixed"
          zIndex={9}
          top="0"
          left="0"
          right="0"
          bottom="0"
          className={classNames(styles.overlay, { [styles.open]: isAnimating })}
          justifyContent="center"
          alignItems="center"
          padding="l"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title">
          <Flex
              fillWidth fillHeight
              justifyContent="center" alignItems="center"
              transition="macro-medium"
              style={{
                  transform: base ? 'scale(0.94) translateY(-1.25rem)' : '',
              }}
              {...rest}>
              <Flex
                  className={classNames(styles.dialog, className, { [styles.open]: isAnimating })}
                  style={{ ...style, minHeight }}
                  ref={dialogRef}
                  fillWidth
                  maxWidth={40}
                  transition="macro-medium"
                  shadow="xl"
                  radius="xl"
                  border="neutral-medium"
                  background="neutral-weak"
                  direction="column">
                  <Flex
                      as="header"
                      direction="column"
                      paddingX="24"
                      paddingTop="24"
                      paddingBottom="s"
                      gap="4">
                      <Flex
                          fillWidth
                          justifyContent="space-between"
                          gap="8">
                          <Heading
                              id="dialog-title"
                              variant="heading-strong-l">
                              {title}
                          </Heading>
                          <IconButton
                              icon="close"
                              size="m"
                              variant="tertiary"
                              tooltip="Close"
                              onClick={onClose} />
                      </Flex>
                      {description && (
                          <Text
                              variant="body-default-s"
                              onBackground="neutral-weak">
                              {description}
                          </Text>
                      )}
                  </Flex>
                  <Flex
                      as="section"
                      paddingX="24" paddingBottom="24"
                      overflowY="auto"
                      direction="column">
                      {children}
                  </Flex>
                  {footer && (
                      <Flex
                          borderTop="neutral-medium"
                          as="footer"
                          justifyContent="flex-end"
                          padding="12"
                          gap="8">
                          {footer}
                      </Flex>
                  )}
                </Flex>
            </Flex>
        </Flex>,
        document.body
    );
});

Dialog.displayName = "Dialog";

export { Dialog };