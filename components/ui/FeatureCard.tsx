import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, type Variants } from 'framer-motion';

interface Feature {
    id: number;
    name: string;
    designation: string;
    icon: React.ReactNode;
}

interface FeatureCardProps {
    feature: Feature;
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 350, damping: 40 });
    const ySpring = useSpring(y, { stiffness: 350, damping: 40 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ['17deg', '-17deg']);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-17deg', '17deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
    const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);
    // FIX: Replaced the exponentiation operator (**) with `Math.pow()` to resolve a TypeScript error.
    // FIX: Explicitly type the arguments in the useTransform callback to resolve "Argument of type 'unknown' is not assignable to parameter of type 'number'" error.
    const distance = useTransform([x, y], ([latestX, latestY]: [number, number]) => Math.sqrt(Math.pow(latestX, 2) + Math.pow(latestY, 2)));
    const glareOpacity = useTransform(distance, [0, 0.4], [0, 1]);


    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            variants={itemVariants}
            style={{
                transformStyle: 'preserve-3d',
                rotateX,
                rotateY,
            }}
            whileTap={{ scale: 0.95 }}
            className="relative w-full h-40 rounded-2xl bg-slate-900/60 border border-slate-800"
        >
            <div
                style={{
                    transform: 'translateZ(50px)',
                    transformStyle: 'preserve-3d',
                }}
                className="absolute inset-4 flex flex-col items-center justify-center text-center"
            >
                <div className="mb-2">{feature.icon}</div>
                <h3 className="text-sm font-bold text-neutral-200">{feature.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">{feature.designation}</p>
            </div>
            
            <motion.div
                className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
                style={{
                    opacity: glareOpacity,
                    background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(0, 255, 255, 0.25), transparent 50%)`,
                }}
            />
        </motion.div>
    );
};
