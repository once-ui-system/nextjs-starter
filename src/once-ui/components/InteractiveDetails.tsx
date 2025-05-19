"use client";

import React, { forwardRef } from "react";
import { Text, Column, IconButton, IconButtonProps, Row } from ".";

interface InteractiveDetailsProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  iconButtonProps?: IconButtonProps;
  onClick: () => void;
  className?: string;
  id?: string;
}

const InteractiveDetails: React.FC<InteractiveDetailsProps> = forwardRef<
  HTMLDivElement,
  InteractiveDetailsProps
>(({ label, description, iconButtonProps, onClick, className, id, disabled }, ref) => {
  return (
    <Column ref={ref} cursor={disabled ? "not-allowed" : undefined} className={className} onClick={onClick} id={id}>
      <Row gap="4" vertical="center">
        <Text as="span" variant="label-default-m" onBackground={disabled ? "neutral-weak" : "neutral-strong"}>
          {label}
        </Text>
        {iconButtonProps?.tooltip && (
          <div onClick={(e) => e.stopPropagation()}>
            <IconButton size="s" variant="ghost" icon="help" {...iconButtonProps} />
          </div>
        )}
      </Row>
      {description && (
        <Text as="span" variant="body-default-s" onBackground="neutral-weak">
          {description}
        </Text>
      )}
    </Column>
  );
});

InteractiveDetails.displayName = "InteractiveDetails";

export { InteractiveDetails };
export type { InteractiveDetailsProps };
