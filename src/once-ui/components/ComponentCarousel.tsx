"use client";

import { Flex, RevealFx } from "@/once-ui/components";
import { useEffect, useState, useRef, Children } from "react";

interface ComponentCarouselProps extends React.ComponentProps<typeof Flex> {
    revealedByDefault?: boolean;
}

const ComponentCarousel: React.FC<ComponentCarouselProps> = ({
                                                               children,
                                                               revealedByDefault = false,
                                                               ...rest
                                                           }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState(revealedByDefault);
    const [initialTransition, setInitialTransition] = useState(revealedByDefault);
    const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const components = Children.toArray(children);

    const handleImageClick = () => {
        if (components.length > 1) {
            const nextIndex = (activeIndex + 1) % components.length;
            handleControlClick(nextIndex);
        }
    };

    const handleControlClick = (nextIndex: number) => {
        if (nextIndex !== activeIndex && !transitionTimeoutRef.current) {

            setIsTransitioning(false);

            transitionTimeoutRef.current = setTimeout(() => {
                setActiveIndex(nextIndex);

                setTimeout(() => {
                    setIsTransitioning(true);
                    transitionTimeoutRef.current = undefined;
                }, 300);
            }, 800);
        }
    };

    useEffect(() => {
        if (!revealedByDefault && !initialTransition) {
            setIsTransitioning(true);
            setInitialTransition(true);
        }
        return () => {
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, [revealedByDefault, initialTransition]);

    if (components.length === 0) {
        return null;
    }

    return (
        <Flex
            fillWidth
            gap="12"
            direction="column"
            {...rest}>
                <RevealFx
                    onClick={handleImageClick}
                    fillWidth
                    trigger={isTransitioning}
                    translateY="16"
                    speed="fast"
                >
                    {components[activeIndex]}
                </RevealFx>
            {components.length > 1 && (
                <>
                    <Flex gap="4" paddingX="s" fillWidth vertical="center">
                        {components.map((_, index) => (
                            <Flex
                                key={index}
                                onClick={() => handleControlClick(index)}
                                style={{
                                    background:
                                        activeIndex === index
                                            ? "var(--neutral-on-background-strong)"
                                            : "var(--neutral-alpha-medium)",
                                    cursor: "pointer",
                                    transition: "background 0.3s ease",
                                }}
                                fillWidth
                                height="2"
                            ></Flex>
                        ))}
                    </Flex>
                </>
            )}
        </Flex>
    );
};

ComponentCarousel.displayName = "ComponentCarousel";
export { ComponentCarousel };
