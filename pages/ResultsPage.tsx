
import React, { useState } from 'react';
import type { ResumeData, WorkExperience, Education } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Briefcase, GraduationCap, Wrench, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SparklesCore } from '../components/ui/SparklesCore';
import { cn } from '../utils/cn';
import { ChatEnhancementModal } from '../components/ChatEnhancementModal';

interface ResultsPageProps {
    data: ResumeData;
    onReset: () => void;
    isExiting: boolean;
    onExitComplete: () => void;
}

type ActiveTab = 'work' | 'education' | 'skills';

type ChatContext = {
    type: 'summary' | 'work' | 'education' | 'skills';
    content: string | WorkExperience | Education | string[];
} | null;

const TabButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-300",
            isActive
                ? "text-cyan-400 border-cyan-400 bg-slate-900"
                : "text-neutral-400 border-transparent hover:bg-slate-800/50"
        )}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const ResultsPage: React.FC<ResultsPageProps> = ({ data, onReset, isExiting, onExitComplete }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('work');
    const [workIndex, setWorkIndex] = useState(0);
    const [eduIndex, setEduIndex] = useState(0);

    const [chatContext, setChatContext] = useState<ChatContext>(null);
    const isChatModalOpen = chatContext !== null;

    const handleEnhanceClick = (context: ChatContext) => {
        setChatContext(context);
    };

    const handleWorkNav = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setWorkIndex((prev) => (prev + 1) % data.workExperience.length);
        } else {
            setWorkIndex((prev) => (prev - 1 + data.workExperience.length) % data.workExperience.length);
        }
    };
     const handleEduNav = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setEduIndex((prev) => (prev + 1) % data.education.length);
        } else {
            setEduIndex((prev) => (prev - 1 + data.education.length) % data.education.length);
        }
    };

    const currentWork = data.workExperience[workIndex];
    const currentEdu = data.education[eduIndex];

    const tabContentVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <>
            <ChatEnhancementModal 
                isOpen={isChatModalOpen}
                onClose={() => setChatContext(null)}
                context={chatContext}
            />
            <div className="fixed top-0 left-0 w-full h-screen -z-10">
                <SparklesCore
                    id="tsparticlesfullpage"
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
            <motion.main
                className="h-screen bg-transparent text-white antialiased flex flex-col p-4 sm:p-6 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: isExiting ? 0 : 1 }}
                transition={{ duration: 0.8 }}
            >
                <header className="flex-shrink-0 flex justify-between items-center pb-4 md:pb-6 border-b border-slate-800">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                        Analysis Complete
                    </h1>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition duration-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Analyze Another</span>
                    </button>
                </header>

                <div className="flex-grow flex flex-col md:flex-row gap-6 md:gap-10 pt-4 md:pt-6 overflow-hidden">
                    {/* Left Column: Personal Info & Summary */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full md:w-1/3 flex flex-col gap-6 md:gap-8"
                    >
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex-shrink-0">
                            <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 truncate">{data.name}</h2>
                            <div className="flex flex-col gap-2 mt-4 text-neutral-300 text-sm">
                                <span className="truncate">{data.email}</span>
                                <span className="truncate">{data.phone}</span>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col flex-grow overflow-hidden">
                             <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                <h3 className="text-xl font-semibold text-cyan-400">Summary</h3>
                                <button onClick={() => handleEnhanceClick({ type: 'summary', content: data.summary })} className="p-1 text-cyan-400/70 hover:text-cyan-400 transition-colors"><Sparkles size={18}/></button>
                             </div>
                             <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                                <p className="text-neutral-300 text-sm">{data.summary}</p>
                             </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Tabs */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                        className="w-full md:w-2/3 flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden"
                    >
                        <div className="flex-shrink-0 flex border-b border-slate-800">
                           <TabButton icon={<Briefcase size={16} />} label="Experience" isActive={activeTab === 'work'} onClick={() => setActiveTab('work')} />
                           <TabButton icon={<GraduationCap size={16} />} label="Education" isActive={activeTab === 'education'} onClick={() => setActiveTab('education')} />
                           <TabButton icon={<Wrench size={16} />} label="Skills" isActive={activeTab === 'skills'} onClick={() => setActiveTab('skills')} />
                        </div>

                        <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === 'work' && currentWork && (
                                    <motion.div key="work" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg text-white truncate pr-4">{currentWork.role}</h4>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                              <p className="text-sm text-neutral-400 whitespace-nowrap">{currentWork.startDate} - {currentWork.endDate}</p>
                                               <button onClick={() => handleEnhanceClick({ type: 'work', content: currentWork })} className="p-1 text-cyan-400/70 hover:text-cyan-400 transition-colors"><Sparkles size={18}/></button>
                                            </div>
                                        </div>
                                        <p className="text-md text-neutral-300 mb-4">{currentWork.company}</p>
                                        <ul className="list-disc list-inside space-y-3 text-neutral-400 text-sm">
                                            {currentWork.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                                        </ul>
                                        {data.workExperience.length > 1 && (
                                            <div className="flex-shrink-0 flex items-center justify-center gap-4 mt-8">
                                                <button onClick={() => handleWorkNav('prev')} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700"><ChevronLeft size={16}/></button>
                                                <span className="text-sm text-neutral-400">{workIndex + 1} / {data.workExperience.length}</span>
                                                <button onClick={() => handleWorkNav('next')} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700"><ChevronRight size={16}/></button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                {activeTab === 'education' && currentEdu && (
                                     <motion.div key="education" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col justify-center">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-lg text-white">{currentEdu.institution}</h4>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-sm text-neutral-400">{currentEdu.startDate} - {currentEdu.endDate}</p>
                                                    <button onClick={() => handleEnhanceClick({ type: 'education', content: currentEdu })} className="p-1 text-cyan-400/70 hover:text-cyan-400 transition-colors"><Sparkles size={18}/></button>
                                                </div>
                                            </div>
                                            <p className="text-md text-neutral-300">{currentEdu.degree}</p>
                                        </div>
                                        {data.education.length > 1 && (
                                            <div className="flex items-center justify-center gap-4 mt-8">
                                                <button onClick={() => handleEduNav('prev')} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700"><ChevronLeft size={16}/></button>
                                                <span className="text-sm text-neutral-400">{eduIndex + 1} / {data.education.length}</span>
                                                <button onClick={() => handleEduNav('next')} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700"><ChevronRight size={16}/></button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                {activeTab === 'skills' && (
                                    <motion.div key="skills" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit">
                                         <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-lg text-white">Skills</h4>
                                            <button onClick={() => handleEnhanceClick({ type: 'skills', content: data.skills })} className="p-1 text-cyan-400/70 hover:text-cyan-400 transition-colors"><Sparkles size={18}/></button>
                                         </div>
                                         <div className="flex flex-wrap gap-4">
                                            {data.skills.map((skill, index) => (
                                            <motion.span 
                                                key={index} 
                                                className="bg-cyan-900/50 text-cyan-300 text-sm font-medium px-4 py-2 rounded-full"
                                                initial={{opacity: 0, scale: 0.8}}
                                                animate={{opacity: 1, scale: 1}}
                                                transition={{delay: index * 0.05}}
                                            >
                                                {skill}
                                            </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </motion.main>
        </>
    );
};

export default ResultsPage;
