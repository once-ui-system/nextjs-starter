import Link from "next/link";
import React, { ReactNode, forwardRef } from "react";

interface LinkButtonProps {
  href?: string;
  children: ReactNode;
  [key: string]: any;
}

const isExternalLink = (url: string) => /^https?:\/\//.test(url);

const ElementType = forwardRef<HTMLElement, LinkButtonProps>(({ href, children, ...props }, ref) => {
  if (href) {
    const isExternal = isExternalLink(href);
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noreferrer" ref={ref as React.Ref<HTMLAnchorElement>} {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} {...props as React.ButtonHTMLAttributes<HTMLButtonElement>}>
      {children}
    </button>
  );
});

ElementType.displayName = "ElementType";
export { ElementType };
