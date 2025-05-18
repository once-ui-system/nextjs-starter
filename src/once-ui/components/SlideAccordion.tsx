"use client";

import React, { useState } from "react";
import { Flex, Text, Column, Icon, Background, Button } from ".";
import styles from "./SlideAccordion.module.scss";
import { FlexProps } from '../interfaces';

export interface SlideAccordionItem {
  title: string;
  content: React.ReactNode;
  buttonTitle: string;
  icon: string;
  background?: React.ComponentProps<typeof Background>;
}

interface SlideAccordionProps extends React.ComponentProps<typeof Flex> {
  items: SlideAccordionItem[];
  size?: "s" | "m" | "l";
}

const SlideAccordion: React.FC<SlideAccordionProps> = ({ items, size = "m", ...rest }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const collapsedWidth = size === "s" ? 5 : size === "m" ? 7 : 10; 

  const expandedWidth = 20; 
  const iconSize = size === "s" ? "xs" : size === "m" ? "s" : "m";
  
  return (
    <Flex direction="row" gap="8" overflowX="auto" padding="4" fillHeight>
      {items.map((item, index) => {
        const isExpanded = hoveredIndex === index;
        
        return (
          <Flex
            key={index}
            {...rest}
            width={isExpanded ? expandedWidth : collapsedWidth}
            background="surface"
            fillHeight
            border="neutral-alpha-medium"
            radius="m"
            cursor="pointer"
            className={styles.expandTransition}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            overflow="hidden"
            position="relative"
            style={{ 
              transitionDelay: isExpanded ? '0ms' : '75ms' 
            }}
          >
            {/* Background component when specified */}
            {item.background && (
              <Background {...item.background} position="absolute"/>
            )}
            
            {/* Collapsed view with vertical text and icon at bottom */}
            <Flex 
              direction="column"
              fillWidth
              fillHeight
              vertical="space-between"
              horizontal="center"
              padding="16"
              gap="12"
              style={{
                opacity: isExpanded ? 0 : 1,
                position: "absolute",
                inset: 0,
                transition: "opacity 0.25s ease-out",
                transitionDelay: isExpanded ? "0s" : "0.25s",
                pointerEvents: isExpanded ? "none" : "auto",
              }}
            >
              <Text 
                variant={`heading-strong-${size === "s" ? "xs" : "s"}`}
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                  textOrientation: "mixed"
                }}
              >
                {item.title}
              </Text>
              
              <Icon 
                name={item.icon} 
                size={iconSize} 
                onBackground="neutral-strong" 
              />
            </Flex>
            
            {/* Expanded view with full content */}
            <Flex
              direction="column"
              fillWidth
              vertical="space-between"
              fillHeight
              padding="24"
              gap="16"
              style={{
                opacity: isExpanded ? 1 : 0,
                position: "absolute",
                inset: 0,
                transition: "opacity 0.25s ease-in",
                transitionDelay: isExpanded ? "0.25s" : "0s",
                pointerEvents: isExpanded ? "auto" : "none",
              }}
            >
              <Flex horizontal="space-between" vertical="center">
                <Text variant={`heading-strong-${size === "l" ? "m" : "s"}`}>
                  {item.title}
                </Text>
                <Icon 
                  name={item.icon} 
                  size={iconSize} 
                  onBackground="neutral-strong" 
                />
              </Flex>
              
              <Column 
                gap="12" 
                overflow="auto"
                style={{
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? "translateX(0)" : "translateX(20px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  transitionDelay: isExpanded ? "0.35s" : "0s",
                }}
              >
                <Text 
                  variant={`body-default-${size === "s" ? "xs" : "s"}`} 
                  onBackground="neutral-weak"
                >
                  {item.content}
                </Text>
                <Button variant="secondary">
                  {item.buttonTitle}
                </Button>
              </Column>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};

SlideAccordion.displayName = "SlideAccordion";
export { SlideAccordion };