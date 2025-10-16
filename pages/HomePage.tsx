import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero } from '../components/Hero';
import { ResumeExtractor } from '../components/ResumeExtractor';
import { BackgroundBeams } from '../components/ui/BackgroundBeams';
import { SparklesCore } from '../components/ui/SparklesCore';

interface HomePageProps {
    onExtract: (file: File) => void;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    isExiting: boolean;
    onExitComplete: () => void;
}

const HomePage: React.FC<HomePageProps> = (props) => {
    const [view, setView] = useState<'hero' | 'extractor'>('hero');
    const [isExitingHero, setIsExitingHero] = useState(false);
    const { isExiting, onExitComplete } = props;

    const handleHeroExitStart = () => {
        setIsExitingHero(true);
    };

    const handleHeroExitComplete = () => {
        setView('extractor');
        setIsExitingHero(false); // Reset for potential future navigation
    };

    const ExtractorView: React.FC = () => (
        <div className="h-screen w-full bg-black flex flex-col relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 w-full h-full bg-black z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                    id="tsparticlesextractor"
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
                className="flex-grow flex flex-col"
                animate={{ opacity: isExiting ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Main content area that grows and centers its child */}
                <main className="flex-grow flex flex-col items-center justify-center z-30 p-4">
                     <ResumeExtractor {...props} />
                </main>

                {/* Footer */}
                <footer className="flex-shrink-0 text-center p-6 bg-transparent text-neutral-500 text-sm z-30">
                    <p>Built with Resumist AI. All rights reserved.</p>
                </footer>
            </motion.div>
        </div>
    );

    return (
        <main className="h-screen bg-black text-white antialiased overflow-hidden">
             {view === 'hero' ? (
                <Hero 
                    onGetStartedClick={handleHeroExitStart} 
                    isExiting={isExitingHero}
                    onExitComplete={handleHeroExitComplete}
                />
            ) : (
                 <motion.div
                    key="extractor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    <ExtractorView />
                </motion.div>
            )}
        </main>
    );
};

export default HomePage;