
import React, { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { CheckCircle, FileUp, XCircle, ArrowRight } from 'lucide-react';

interface ResumeExtractorProps {
    onExtract: (file: File) => void;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

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


export const ResumeExtractor: React.FC<ResumeExtractorProps> = ({
    onExtract,
    error,
    setError,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
                setError(null);
            } else {
                setError("Please upload a valid PDF file.");
                setFile(null);
            }
        }
    };

    const handleExtractClick = useCallback(() => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }
        onExtract(file);
    }, [file, onExtract, setError]);

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="max-w-4xl w-full mx-auto p-4 md:p-8 z-10 relative flex flex-col items-center"
        >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                Upload Your Resume
            </h1>
            <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
                Simply upload your resume in PDF format. Our AI will instantly analyze and structure the content for you.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 w-full">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="application/pdf"
                />
                <div 
                    className="w-full max-w-xl h-48 border-2 border-dashed border-neutral-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors"
                    onClick={triggerFileSelect}
                >
                    {file ? (
                        <div className="text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                            <p className="mt-2 text-neutral-200">{file.name}</p>
                            <p className="text-sm text-neutral-400">Ready to extract</p>
                        </div>
                    ) : (
                        <div className="text-center text-neutral-400">
                             <FileUp className="mx-auto h-12 w-12" />
                            <p className="mt-2">Click to upload or drag & drop</p>
                             <p className="text-sm">PDF only</p>
                        </div>
                    )}
                </div>

                 <motion.button
                    onClick={handleExtractClick}
                    disabled={!file}
                    variants={buttonVariants}
                    initial="initial"
                    whileHover={!file ? "initial" : "hover"}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-xl relative bg-slate-900 text-white text-sm border border-slate-600 flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <motion.span 
                        className="inline-block"
                        variants={textSpanVariants}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        Extract Details
                    </motion.span>
                    <motion.div 
                        className="flex items-center justify-center"
                        variants={arrowDivVariants}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <ArrowRight className="w-5 h-5"/>
                    </motion.div>
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        key="error"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8 w-full max-w-xl flex items-center justify-center gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg"
                    >
                        <XCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
