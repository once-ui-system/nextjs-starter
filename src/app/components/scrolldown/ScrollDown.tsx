"use client";

import { Button } from "@/once-ui/components";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import React, { useState } from "react";

interface ScrollDownProps {
	className?: string;
	icon?: string;
	animateOffset?: number;
	duration?: number;
	ariaLabel?: string;
	variant?: "tertiary" | "primary" | "secondary" | "danger";
}

const ScrollDown = ({
	                    className = "absolute bottom-8",
	                    icon = "chevronDown",
	                    animateOffset = 20,
	                    duration = 2,
	                    ariaLabel = "Scroll down",
	                    variant = "secondary",
                    }: ScrollDownProps) => {
	const { scrollY } = useScroll();
	const [isVisible, setIsVisible] = useState(true);
	const opacity = useTransform(scrollY, [0, 100], [1, 0]);
	const scale = useTransform(scrollY, [0, 100], [1, 0.8]);
	
	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsVisible(latest < window.innerHeight * 0.8);
	});
	
	const handleClick = () => {
		window.scrollTo({
			top: window.innerHeight,
			behavior: "smooth"
		});
	};
	
	return (
		<motion.div
			className={className}
			style={{
				opacity, scale, paddingBottom: "2rem",
			}}
			animate={{
				y: isVisible ? [0, animateOffset, 0] : 0,
				opacity: isVisible ? 1 : 0
			}}
			transition={{
				y: {
					duration: duration,
					repeat: Infinity,
					ease: "easeInOut"
				},
				opacity: { duration: 0.5 }
			}}
			aria-hidden="true"
		>
			<Button
				variant={variant}
				suffixIcon={icon}
				onClick={handleClick}
				aria-label={ariaLabel}
			/>
		</motion.div>
	);
};

export default ScrollDown;