"use client";

import { useMotionValue } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const ParticleFx = ({ density = 80, color = "brand-on-background-weak", motion = 0.5 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<HTMLDivElement[]>([]);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const newParticles = Array.from({ length: density }).map(() => {
            const particle = document.createElement("div");
            particle.style.position = "absolute";
            particle.style.width = "4px";
            particle.style.height = "4px";
            particle.style.background = `var(--${color})`;
            particle.style.borderRadius = "50%";
            particle.style.pointerEvents = "none";
            particle.style.opacity = "0.3";
            particle.style.transform = "translateZ(0)";

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            containerRef.current?.appendChild(particle);
            return particle;
        });

        setParticles(newParticles);

        let animationFrame: number;
        const animate = () => {
            newParticles.forEach((particle, index) => {
                const x = parseFloat(particle.style.left) + Math.sin(Date.now() * 0.001 + index) * motion;
                const y = parseFloat(particle.style.top) + Math.cos(Date.now() * 0.001 + index) * motion;

                const mx = mouseX.get();
                const my = mouseY.get();
                const dx = mx - x;
                const dy = my - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                particle.style.transform = `translate(
          ${Math.sin(Date.now() * 0.001 + index) * 2}px,
          ${Math.cos(Date.now() * 0.001 + index) * 2}px
        ) scale(${1 - distance * 0.002})`;
            });
            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            newParticles.forEach(particle => particle.remove());
        };
    }, [density, color, motion]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width * 100);
        mouseY.set((e.clientY - rect.top) / rect.height * 100);
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0"
            onMouseMove={handleMouseMove}
        />
    );
};

export default ParticleFx;