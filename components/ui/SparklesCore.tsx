"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
  particleColor?: string;
  isExiting?: boolean;
  onExitComplete?: () => void;
}) => {
  const {
    id = "tsparticles",
    className,
    background = "black",
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 1200,
    particleColor = "#FFFFFF",
    isExiting = false,
    onExitComplete,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const exitingRef = useRef(false);

  useEffect(() => {
    exitingRef.current = isExiting;
  }, [isExiting]);

  useEffect(() => {
    if (canvasRef.current && !isInitialized) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let w = (canvas.width = window.innerWidth);
      let h = (canvas.height = window.innerHeight);

      const handleResize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", handleResize);

      const particles: { 
          x: number; y: number; size: number; speedX: number; speedY: number;
          opacity: number; dissipationSpeed: number; 
      }[] = [];
      
      const rate = particleDensity;

      const createParticles = () => {
        for (let i = 0; i < rate; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * (maxSize - minSize) + minSize,
            speedX: Math.random() * 0.4 - 0.2,
            speedY: Math.random() * 0.4 - 0.2,
            opacity: 1,
            dissipationSpeed: Math.random() * 3 + 1.5,
          });
        }
      };

      const animateParticles = () => {
        ctx.clearRect(0, 0, w, h);
        let activeParticles = 0;
        particles.forEach((p) => {
            if (exitingRef.current) {
                const dx = p.x - w / 2;
                const dy = p.y - h / 2;
                const angle = Math.atan2(dy, dx);
                p.x += Math.cos(angle) * p.dissipationSpeed;
                p.y += Math.sin(angle) * p.dissipationSpeed;
                p.dissipationSpeed *= 1.03;
                p.opacity -= 0.02;
                p.size *= 1.025; // Grow particle size for "warp speed" effect
                if (p.opacity < 0) p.opacity = 0;
            } else {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x > w || p.x < 0) p.speedX *= -1;
                if (p.y > h || p.y < 0) p.speedY *= -1;
            }

            if (p.opacity > 0) {
                activeParticles++;
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        if (exitingRef.current && activeParticles === 0) {
            onExitComplete?.();
            return;
        }

        requestAnimationFrame(animateParticles);
      };
      
      createParticles();
      animateParticles();
      setIsInitialized(true);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isInitialized, particleDensity, maxSize, minSize, particleColor, onExitComplete]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <canvas
        id={id}
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ backgroundColor: background }}
      ></canvas>
    </div>
  );
};