"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Flex, Icon, Heading } from ".";
import styles from "./Accordion.module.scss";
import classNames from "classnames";

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  open?: boolean;
}

const Accordion: React.FC<AccordionProps> = forwardRef(
  ({ title, children, style, className, open = false }, ref) => {
    const [isOpen, setIsOpen] = useState(open);

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    useImperativeHandle(ref, () => ({
      toggle: toggleAccordion,
      open: () => {
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
      },
    }));

    return (
      <Flex
        fillWidth
        direction="column"
        style={style}
        borderTop="neutral-medium"
        className={classNames(styles.border, className)}
      >
        <Flex
          tabIndex={0}
          className={styles.accordion}
          cursor="pointer"
          transition="macro-medium"
          paddingY="16"
          paddingX="20"
          alignItems="center"
          justifyContent="space-between"
          onClick={toggleAccordion}
          aria-expanded={isOpen}
          aria-controls="accordion-content"
        >
          <Heading as="h3" variant="heading-strong-s">
            {title}
          </Heading>
          <Icon
            name="chevronDown"
            size="m"
            style={{
              display: "flex",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "var(--transition-micro-medium)",
            }}
          />
        </Flex>
        <Flex
          id="accordion-content"
          fillWidth
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition:
              "grid-template-rows var(--transition-duration-macro-medium) var(--transition-eased)",
          }}
          aria-hidden={!isOpen}
        >
          <Flex
            fillWidth
            minHeight={0}
            overflow="hidden"
            direction="column"
          >
            <Flex fillWidth paddingX="20" paddingTop="8" paddingBottom="16">
              {children}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  },
);

Accordion.displayName = "Accordion";

export { Accordion };
