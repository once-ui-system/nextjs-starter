"use client";

import React, {useState, useEffect, forwardRef, ComponentProps, useRef, useLayoutEffect, useCallback} from "react";
import classNames from "classnames";
import {Flex} from "@/once-ui/components";

interface FlipCardProps extends React.ComponentProps<typeof Flex> {
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

function isInteractiveElement(target: EventTarget | null): boolean {
	let el = target as HTMLElement | null;
	while (el) {
		if (!(el instanceof HTMLElement)) break;
		const tag = el.tagName.toLowerCase();
		if (
			tag === "button" && el.classList.contains("flipcard-button") ||
			tag === "a" ||
			tag === "input" ||
			tag === "textarea" ||
			tag === "select"
		) {
			return true;
		}
		el = el.parentElement;
	}
	return false;
}

const FlipCard = forwardRef<HTMLDivElement, FlipCardProps>(
	({
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
	 }, ref) => {
		const [loading, setLoading] = useState(false);
		const [internalFlipped, setInternalFlipped] = useState(false);
		const isFlipped = flipped !== undefined ? flipped : internalFlipped;

		const cardRef = useRef<HTMLDivElement>(null);
		const frontRef = useRef<HTMLDivElement>(null);
		const backRef = useRef<HTMLDivElement>(null);

		const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

		useLayoutEffect(() => {
			const measure = () => {
				const front = frontRef.current;
				const back = backRef.current;
				if (!front || !back) return;
				const frontHeight = front.scrollHeight;
				const backHeight = back.scrollHeight;
				const targetHeight = isFlipped ? backHeight : frontHeight;
				setCardHeight(targetHeight);
			};
			measure();
			const roFront = new window.ResizeObserver(measure);
			const roBack = new window.ResizeObserver(measure);
			if (frontRef.current) roFront.observe(frontRef.current);
			if (backRef.current) roBack.observe(backRef.current);
			return () => {
				roFront.disconnect();
				roBack.disconnect();
			};
		}, [isFlipped, children]);

		useEffect(() => {
			if (!autoFlipInterval) return;

			const interval = setInterval(() => {
				setInternalFlipped(prev => {
					const newState = !prev;
					onFlip?.(newState);
					return newState;
				});
			}, autoFlipInterval * 1000);

			return () => clearInterval(interval);
		}, [autoFlipInterval, onFlip]);

		const handleFlip = useCallback(
			(fromArrow = false) => {
				if (autoFlipInterval) return;
				if (!fromArrow && disableClickFlip) return;
				if (flipped === undefined) setInternalFlipped((f) => !f);
				onFlip?.(!isFlipped);
			},
			[autoFlipInterval, flipped, onFlip, isFlipped, disableClickFlip]
		);

		const handleCardClick = (e: React.MouseEvent) => {
			const clickedElement = e.target as HTMLElement;

			if (isInteractiveElement(clickedElement)) return;
			const isArrowClick = !!clickedElement.closest('.flipcard-arrow-btn');
			if (isArrowClick) return;
			if (disableClickFlip) return;
			handleFlip();
		};

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (disableClickFlip) return;
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleFlip();
			}
		};

		const renderFace = (
			content: React.ReactNode,
			refObj: React.RefObject<HTMLDivElement | null>,
			isBack: boolean
		) => (
			<Flex
				center
				fill
				position="absolute"
				zIndex={isBack ? 1 : 2}
				ref={refObj}
				aria-hidden={isFlipped ? (!isBack) : isBack}
				style={{
					backfaceVisibility: "hidden",
					cursor: disableClickFlip ? "pointer" : "auto",
					transform: isBack
						? flipDirection === "vertical"
							? "rotateX(180deg)"
							: "rotateY(180deg)"
						: undefined,
				}}
			>
				{content}
			</Flex>
		);

		if (!Array.isArray(children) || children.length !== 2) {
			throw new Error("FlipCard requires exactly two children: [front, back]");
		}

		return (
			<Flex
				ref={(node) => {
					cardRef.current = node as HTMLDivElement;
					if (typeof ref === "function") ref(node as HTMLDivElement);
					else if (ref)
						(ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement;
				}}
				position="relative"
				center
				fill
				align="center"
				cursor="pointer"
				style={{
					transformStyle: "preserve-3d",
					transition: `transform ${timing}ms cubic-bezier(0.22, 1, 0.36, 1)`,
					transform: isFlipped
						? flipDirection === "vertical"
							? "rotateX(180deg)"
							: "rotateY(180deg)"
						: "none",
				}}
				role="button"
				className="flipcard-button"
				aria-pressed={isFlipped}
				onClick={handleCardClick}
				onKeyDown={handleKeyDown}
				{...rest}
			>
				{renderFace(children[0], frontRef, false)}
				{renderFace(children[1], backRef, true)}
			</Flex>
		);
	}
);

FlipCard.displayName = "Component";
export { FlipCard };
