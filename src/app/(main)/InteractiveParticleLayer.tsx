"use client";

import { ParticleFx } from "@once-ui-system/core";
import { useEffect, useRef } from "react";

export default function InteractiveParticleLayer() {
  const particleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particleLayer = particleRef.current;
    if (!particleLayer) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      particleLayer.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: event.clientX,
          clientY: event.clientY,
        }),
      );
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="particle-layer interactive-particle-layer" aria-hidden="true">
      <ParticleFx
        ref={particleRef}
        className="particle-field"
        fill
        interactive
        color="particle-color"
        opacity={90}
        density={450}
        speed={1.5}
        intensity={30}
      />
    </div>
  );
}
