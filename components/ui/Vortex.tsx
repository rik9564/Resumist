"use client";
import React, { useEffect, useRef, useImperativeHandle } from "react";
import { cn } from "../../utils/cn";

// This component is adapted from the Vortex component by Aceternity UI.
// Original source: https://ui.aceternity.com/components/vortex

class VortexEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private vortexWidth: number = 0;
  private vortexHeight: number = 0;
  private particles: Particle[] = [];
  private particleCount: number = 700;
  private particleSpeed: number = 0.04;
  private particleRadius: number = 1;
  private baseHue: number = 200; // Cyan-ish
  private animationFrameId?: number;
  private dissipating: boolean = false;
  private onDissipationComplete?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Could not get 2D context from canvas");
    }
    this.ctx = ctx;
    this.init();
  }

  private init() {
    this.resize();
    this.createParticles();
    this.animate();
    window.addEventListener("resize", this.resize.bind(this));
  }

  private resize() {
    this.vortexWidth = this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.vortexHeight = this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this.vortexWidth, this.vortexHeight, this.particleRadius, this.baseHue));
    }
  }

  public dissipate(onComplete: () => void) {
      this.dissipating = true;
      this.onDissipationComplete = onComplete;
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.vortexWidth, this.vortexHeight);
    
    let activeParticles = 0;
    this.particles.forEach((particle) => {
      particle.update(this.particleSpeed, this.vortexWidth, this.vortexHeight, this.dissipating);
      particle.draw(this.ctx);
      if (particle.isAlive()) {
          activeParticles++;
      }
    });

    if (this.dissipating && activeParticles === 0) {
        this.cleanup();
        this.onDissipationComplete?.();
        return;
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }
  
  public cleanup() {
    if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener("resize", this.resize.bind(this));
  }
}

class Particle {
  private x: number;
  private y: number;
  private angle: number;
  private radius: number;
  private color: string;
  private opacity: number = 1;
  private dissipationSpeed: number;

  constructor(vw: number, vh: number, baseRadius: number, baseHue: number) {
    this.x = Math.random() * vw;
    this.y = Math.random() * vh;
    this.angle = 0;
    this.radius = baseRadius * (Math.random() + 0.5);
    const lightness = Math.random() * 50 + 20;
    this.color = `hsl(${baseHue}, 100%, ${lightness}%)`;
    this.dissipationSpeed = Math.random() * 8 + 4;
  }

  public update(speed: number, vw: number, vh: number, dissipating: boolean) {
    if (dissipating) {
        const dx = this.x - vw / 2;
        const dy = this.y - vh / 2;
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * this.dissipationSpeed;
        this.y += Math.sin(angle) * this.dissipationSpeed;
        this.dissipationSpeed *= 1.015; // Accelerate
        this.opacity -= 0.015;
    } else {
        const dx = this.x - vw / 2;
        const dy = this.y - vh / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.angle = Math.atan2(dy, dx);
        this.angle += speed;

        this.x = vw / 2 + Math.cos(this.angle) * distance;
        this.y = vh / 2 + Math.sin(this.angle) * distance;

        if (distance < 10) {
            this.x = Math.random() * vw;
            this.y = Math.random() * vh;
        }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.opacity <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    const originalColor = this.color.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
    if (originalColor) {
        const [, hue, saturation, lightness] = originalColor;
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${this.opacity})`;
    } else {
        ctx.fillStyle = this.color;
    }
    ctx.fill();
  }

  public isAlive(): boolean {
      return this.opacity > 0;
  }
}

interface VortexProps {
    children?: React.ReactNode;
    className?: string;
    backgroundColor?: string;
}

export interface VortexRef {
    dissipate: (onComplete: () => void) => void;
}

export const Vortex = React.forwardRef<VortexRef, VortexProps>(({
    children,
    className,
    backgroundColor = "black"
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const vortexRef = useRef<VortexEffect | null>(null);

    useImperativeHandle(ref, () => ({
        dissipate: (onComplete: () => void) => {
            vortexRef.current?.dissipate(onComplete);
        }
    }));

    useEffect(() => {
        if (canvasRef.current) {
            vortexRef.current = new VortexEffect(canvasRef.current);
        }

        return () => {
            vortexRef.current?.cleanup();
        }
    }, []);

    return (
        <div className={cn("relative h-full w-full", className)}>
            <canvas
                ref={canvasRef}
                className="absolute h-full w-full top-0 left-0"
                style={{ backgroundColor }}
            ></canvas>
            <div className="relative z-10">{children}</div>
        </div>
    )
});