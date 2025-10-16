import React, { useState, useRef } from 'react';
import type { ResumeData } from './types';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import LoadingPage from './pages/LoadingPage';
import { extractResumeDetails } from './services/geminiService';

type AppState = 'home' | 'loading' | 'results';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('home');
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Initializing analysis...");
    const [isExiting, setIsExiting] = useState(false);
    const fileToProcessRef = useRef<File | null>(null);

    const processFile = async (file: File) => {
        setIsLoadingComplete(false);
        setError(null);
        try {
            const onProgress = (message: string) => {
                setLoadingMessage(message);
            };
            const data = await extractResumeDetails(file, onProgress);
            setResumeData(data);
            setIsLoadingComplete(true); // Signal for loading page to start its exit animation
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            // Go back to the home page on error to allow the user to try again
            setAppState('home');
        }
    };

    const handleExtract = (file: File) => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }
        fileToProcessRef.current = file;
        setIsExiting(true); // Start exit animation on HomePage
    };

    const handleReset = () => {
        setIsExiting(true); // Start exit animation on ResultsPage
    };
    
    const handleExitComplete = () => {
        setIsExiting(false); // Reset exiting state for the next transition

        if (appState === 'home' && fileToProcessRef.current) {
            setAppState('loading');
            processFile(fileToProcessRef.current);
            fileToProcessRef.current = null;
        } else if (appState === 'results') {
            setAppState('home');
            setResumeData(null);
            setError(null);
            setIsLoadingComplete(false);
        }
    };

    const handleLoadingTransitionEnd = () => {
        setAppState('results');
    };


    if (appState === 'results' && resumeData) {
        return <ResultsPage data={resumeData} onReset={handleReset} isExiting={isExiting} onExitComplete={handleExitComplete} />;
    }

    if (appState === 'loading') {
        return <LoadingPage message={loadingMessage} isFinished={isLoadingComplete} onTransitionEnd={handleLoadingTransitionEnd} />;
    }
    
    return (
        <HomePage
            onExtract={handleExtract}
            error={error}
            setError={setError}
            isExiting={isExiting}
            onExitComplete={handleExitComplete}
        />
    );
};

export default App;