"use client";
import { cn } from "../../utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const stepStates = [
    {
        id: 1,
        name: "Reading File",
        description: "Parsing resume document...",
    },
    {
        id: 2,
        name: "AI Analysis",
        description: "Extracting key information...",
    },
    {
        id: 3,
        name: "Finalizing",
        description: "Structuring your data...",
    },
];

const LoadingDot = () => {
    return (
        <div className="flex items-center justify-center space-x-2">
            <motion.div
                className="h-2 w-2 rounded-full bg-neutral-400"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="h-2 w-2 rounded-full bg-neutral-400"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                }}
            />
            <motion.div
                className="h-2 w-2 rounded-full bg-neutral-400"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                }}
            />
        </div>
    );
};


export const MultiStepLoader = ({
    loading,
    duration = 2000,
}: {
    loading: boolean;
    duration?: number;
}) => {
    const [currentState, setCurrentState] = useState(0);

    useEffect(() => {
        if (!loading) {
            setCurrentState(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentState((prev) => (prev + 1) % stepStates.length);
        }, duration);

        return () => clearInterval(interval);
    }, [loading, duration]);


    return (
        <AnimatePresence mode="wait">
            {loading && (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg"
                >
                    <div className="relative w-full max-w-md">
                        <div className="flex justify-between mb-4">
                            {stepStates.map((step, index) => (
                                <div key={step.name} className={cn("flex-1", index > 0 && "ml-2")}>
                                    <div
                                        className={cn(
                                            "h-1 rounded-full transition-colors",
                                            currentState >= index ? "bg-cyan-500" : "bg-neutral-800"
                                        )}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="h-24 p-4 rounded-md flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentState}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center"
                                >
                                    <div className="text-lg font-bold text-white mb-2">
                                        {stepStates[currentState].name}
                                    </div>
                                    <div className="text-neutral-400 mb-4">
                                        {stepStates[currentState].description}
                                    </div>
                                    <LoadingDot />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
