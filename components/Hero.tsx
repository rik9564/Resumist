
import React, { useEffect } from 'react';
import { motion, type Variants, useAnimation } from 'framer-motion';
import { FileText, Sparkles, Wrench, Shield, ArrowRight } from 'lucide-react';
import { FeatureCard } from './ui/FeatureCard';
import { SparklesCore } from './ui/SparklesCore';
import { BackgroundBeams } from './ui/BackgroundBeams';

const features = [
  {
    id: 1,
    name: "Instant Analysis",
    designation: "Extract key data in seconds",
    icon: <FileText className="w-8 h-8 text-neutral-400" />,
  },
  {
    id: 2,
    name: "AI Suggestions",
    designation: "Enhance summary & experience",
    icon: <Sparkles className="w-8 h-8 text-neutral-400" />,
  },
  {
    id: 3,
    name: "Skill Enhancement",
    designation: "Discover relevant skills",
    icon: <Wrench className="w-8 h-8 text-neutral-400" />,
  },
  {
    id: 4,
    name: "Data Privacy",
    designation: "Your data is safe and secure",
    icon: <Shield className="w-8 h-8 text-neutral-400" />,
  },
];

interface HeroProps {
  onGetStartedClick: () => void;
  isExiting: boolean;
  onExitComplete: () => void;
}

const brandName = "Resumist";
const tagline = "Analyze, Enhance, and Perfect";
const subTagline = "Your Resume with AI. Unlock its full potential and land your dream job faster.";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (delay: number = 0) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    }),
    exit: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
  };

const buttonVariants: Variants = {
  initial: {},
  hover: {
    scale: 1.05,
    boxShadow: '0px 0px 20px rgba(0, 255, 255, 0.4)',
    borderColor: 'rgba(0, 255, 255, 0.8)',
    transition: { duration: 0.2 }
  }
};

const textSpanVariants: Variants = {
  initial: { marginRight: '0rem' },
  hover: { marginRight: '0.5rem' }
};

const arrowDivVariants: Variants = {
  initial: { width: 0, opacity: 0 },
  hover: { width: '1.25rem', opacity: 1 }
};

export const Hero: React.FC<HeroProps> = ({ onGetStartedClick, isExiting, onExitComplete }) => {
    const controls = useAnimation();

    useEffect(() => {
        if (isExiting) {
            controls.start("exit");
        }
    }, [isExiting, controls]);

    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
             <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                    id="tsparticleshero"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                    isExiting={isExiting}
                    onExitComplete={onExitComplete}
                />
            </div>
            <BackgroundBeams />

             <motion.div 
                animate={controls}
                className="relative flex flex-col items-center justify-center text-center p-4 z-10"
             >
                <div className="relative mb-12">
                    <motion.h1
                        variants={containerVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 80, delay: 0.2 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-bold text-white"
                    >
                       {brandName}
                    </motion.h1>
                    {/* Smoother Gradient Underline */}
                    <motion.div
                         variants={containerVariants}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            delay: 0.4,
                            duration: 0.8,
                            ease: [0.4, 0.0, 0.2, 1],
                        }}
                        style={{ transformOrigin: 'center' }}
                        className="absolute -bottom-2 md:-bottom-6 left-0 w-full h-8 md:h-12 bg-[radial-gradient(ellipse_at_bottom_center,rgba(0,255,255,0.4),transparent_60%)]"
                    />
                </div>

                <motion.h2
                    variants={containerVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.6 }}
                    className="text-2xl sm:text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 tracking-wide"
                >
                    {tagline}
                </motion.h2>

                <motion.p
                     variants={containerVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.8 }}
                    className="mt-4 font-normal text-base text-neutral-300 max-w-lg mx-auto tracking-wide"
                >
                    {subTagline}
                </motion.p>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1.0}
                    className="my-8 md:my-12 w-full max-w-xs sm:max-w-md md:max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {features.map((feature) => (
                         <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </motion.div>

                <motion.div
                     variants={containerVariants}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: 1.2,
                        type: 'spring',
                        stiffness: 150,
                        damping: 18,
                    }}
                >
                    <motion.button
                        onClick={onGetStartedClick}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-xl relative bg-slate-900 text-white text-sm border border-slate-600 flex items-center justify-center overflow-hidden"
                    >
                        <motion.span 
                            className="inline-block"
                            variants={textSpanVariants}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            Launch Analysis
                        </motion.span>
                        <motion.div 
                            className="flex items-center justify-center"
                            variants={arrowDivVariants}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <ArrowRight className="w-5 h-5"/>
                        </motion.div>
                    </motion.button>
                </motion.div>
             </motion.div>
        </div>
    );
};
