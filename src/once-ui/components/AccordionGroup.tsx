import React from "react";
import { Column, Accordion, Line, Flex } from ".";

export type AccordionItem = {
  title: React.ReactNode;
  content: React.ReactNode;
};

export interface AccordionGroupProps extends React.ComponentProps<typeof Flex> {
  items: AccordionItem[];
  size?: "s" | "m" | "l";
  className?: string;
  style?: React.CSSProperties;
}

const AccordionGroup: React.FC<AccordionGroupProps> = ({
  items,
  size = "m",
  style,
  className,
  ...rest
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Column
      fillWidth
      radius="m"
      border="neutral-alpha-medium"
      overflow="hidden"
      style={style}
      className={className || ""}
      {...rest}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Accordion title={item.title} size={size}>
            {item.content}
          </Accordion>
          {index < items.length - 1 && <Line background="neutral-alpha-medium" />}
        </React.Fragment>
      ))}
    </Column>
  );
};

AccordionGroup.displayName = "AccordionGroup";
export { AccordionGroup };
