"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, forwardRef } from "react";
import classNames from "classnames";
import { Flex } from "@/once-ui/components";

export interface FlipCardProps extends React.ComponentProps<typeof Flex> {
    flipDirection?: "horizontal" | "vertical";
    timing?: number;
    flipped?: boolean;
    onFlip?: (flipped: boolean) => void;
    disableClickFlip?: boolean;
    autoFlipInterval?: number;
    children: [React.ReactNode, React.ReactNode];
    className?: string;
    style?: React.CSSProperties;
}

const FlipCard = forwardRef<HTMLDivElement, FlipCardProps>((props, ref) => {
    const {
        flipDirection = "horizontal",
        timing = 2000,
        flipped,
        onFlip,
        disableClickFlip = false,
        autoFlipInterval,
        children,
        className,
        style,
        ...rest
    } = props;

    const [internalFlipped, setInternalFlipped] = useState(false);
    const flippedState = flipped ?? internalFlipped;

    const cardRef = useRef<HTMLDivElement>(null);
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const updateHeight = () => {
            if (cardRef.current && frontRef.current && backRef.current) {
                const frontH = frontRef.current.scrollHeight;
                const backH = backRef.current.scrollHeight;
                cardRef.current.style.height = `${Math.max(frontH, backH)}px`;
            }
        };

        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        if (frontRef.current) observer.observe(frontRef.current);
        if (backRef.current) observer.observe(backRef.current);

        return () => observer.disconnect();
    }, [flippedState, children]);

    useEffect(() => {
        if (autoFlipInterval) {
            const interval = setInterval(() => {
                setInternalFlipped((prev) => !prev);
                onFlip?.(!flippedState);
            }, autoFlipInterval * 1000);

            return () => clearInterval(interval);
        }
    }, [autoFlipInterval, flippedState, onFlip]);

    const handleFlip = useCallback(() => {
        if (disableClickFlip || autoFlipInterval) return;
        setInternalFlipped((v) => !v);
        onFlip?.(!flippedState);
    }, [disableClickFlip, autoFlipInterval, flippedState, onFlip]);

    return (
        <Flex
            ref={(node) => {
                cardRef.current = node as HTMLDivElement;
                if (typeof ref === "function") ref(node as HTMLDivElement);
                else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            className={classNames("flipcard-button", className)}
            style={{
                ...style,
                minHeight: "200px",
                minWidth: "200px",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: `transform ${timing}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                transform: flippedState
                    ? flipDirection === "vertical"
                        ? "rotateX(180deg)"
                        : "rotateY(180deg)"
                    : "none",
                perspective: "1000px",
            }}
            onClick={handleFlip}
            role="button"
            aria-pressed={flippedState}
            tabIndex={0}
            {...rest}
        >
            <Flex
                ref={frontRef}
                aria-hidden={flippedState}
                style={{
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden"
                }}
            >
                {children[0]}
            </Flex>

            <Flex
                ref={backRef}
                aria-hidden={!flippedState}
                style={{
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    transform: "rotateY(180deg)",
                }}
            >
                {children[1]}
            </Flex>
        </Flex>
    );
});

FlipCard.displayName = "FlipCard";

export { FlipCard };
