
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SparklesCore } from '../components/ui/SparklesCore';
import { BackgroundBeams } from '../components/ui/BackgroundBeams';

interface LoadingPageProps {
    message: string;
    isFinished: boolean;
    onTransitionEnd: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message, isFinished, onTransitionEnd }) => {
    const [showContent, setShowContent] = useState(true);
    const [startExitAnimation, setStartExitAnimation] = useState(false);

    // Handle the exit animation when isFinished becomes true
    useEffect(() => {
        if (isFinished) {
            setShowContent(false); // Trigger fade-out of text and beams
            
            // Wait for content to fade before starting particle dissipation
            const timer = setTimeout(() => {
                setStartExitAnimation(true);
            }, 500); // Should match content exit transition duration

            return () => clearTimeout(timer);
        }
    }, [isFinished, onTransitionEnd]);

    return (
        <div className="w-screen h-screen overflow-hidden bg-black flex items-center flex-col justify-center relative">
            <SparklesCore
                id="tsparticlesloading"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full absolute inset-0 z-10"
                particleColor="#FFFFFF"
                isExiting={startExitAnimation}
                onExitComplete={onTransitionEnd}
            />
            
            <AnimatePresence>
                {showContent && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center flex-col"
                    >
                        <BackgroundBeams />
                        <div className="absolute inset-0 w-full h-full bg-black z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
                        
                        <div className="z-30 text-center p-4">
                            <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-bold">
                                Analyzing Your Resume
                            </h2>
                            <div className="h-8 mt-4">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={message}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-white text-sm md:text-base max-w-xl"
                                    >
                                        {message}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoadingPage;
