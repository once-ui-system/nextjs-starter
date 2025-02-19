import Link from "next/link";
import React, { ReactNode, forwardRef } from "react";
import { Flex } from "./Flex";

interface ElementTypeProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const isExternalLink = (url: string) => /^https?:\/\//.test(url);

const ElementType = forwardRef<HTMLElement, ElementTypeProps>(
  ({ href, onClick, children, className, style, ...props }, ref) => {
    if (href) {
      const isExternal = isExternalLink(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={className}
            style={style}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
          style={style}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={className}
          style={style}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    return (
      <Flex
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        style={style}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </Flex>
    );
  }
);

ElementType.displayName = "ElementType";
export { ElementType };