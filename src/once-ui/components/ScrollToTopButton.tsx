import { useState, useEffect } from 'react';
import {IconButton} from "@/once-ui/components/IconButton";

interface ScrollToTopButtonProps {
    bottom?: string;
    right?: string;
    size?: 's' | 'm' | 'l';
    shadow?: boolean;
    scrollBehavior?: ScrollBehavior;
}

export const ScrollToTopButton = ({
                                      bottom = '80px',
                                      right = '20px',
                                      size = 'l',
                                      shadow = true,
                                      scrollBehavior = 'smooth'
                                  }: ScrollToTopButtonProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        setIsVisible(window.scrollY > 300);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: scrollBehavior
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <IconButton
            icon="chevronUp"
            onClick={scrollToTop}
            variant="secondary"
            size={size}
            aria-label="Scroll to top"
            style={{
                boxShadow: shadow ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                position: 'fixed',
                bottom,
                right,
                zIndex: 1,
                transition: 'opacity 0.2s ease-in-out',
                opacity: isVisible ? 1 : 0
            }}
        />
    );
};