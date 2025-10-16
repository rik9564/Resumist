import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { Sparkles, X, Send, Copy, Check } from 'lucide-react';
import type { WorkExperience, Education } from '../types';

type ChatContext = {
    type: 'summary' | 'work' | 'education' | 'skills';
    content: string | WorkExperience | Education | string[];
} | null;

interface ChatEnhancementModalProps {
    isOpen: boolean;
    onClose: () => void;
    context: ChatContext;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

// Helper to generate the initial prompt based on context
const getInitialPrompt = (context: ChatContext) => {
    if (!context) return "";
    switch (context.type) {
        case 'summary':
            return `Here is a professional summary from a resume:\n\n"${context.content}"\n\nPlease provide 3 concrete suggestions to make it more impactful.`;
        case 'work':
            const work = context.content as WorkExperience;
            const responsibilities = work.responsibilities.map(r => `- ${r}`).join('\n');
            return `Here is a job description from a resume:\n\nRole: ${work.role}\nCompany: ${work.company}\nResponsibilities:\n${responsibilities}\n\nPlease suggest ways to improve the responsibilities by using stronger action verbs or adding quantifiable metrics.`;
        case 'education':
             const edu = context.content as Education;
             return `Here is an education entry from a resume:\n\nInstitution: ${edu.institution}\nDegree: ${edu.degree}\n\nIs there any way to enhance this section? Perhaps by mentioning relevant coursework or academic achievements?`;
        case 'skills':
            return `Here is a list of skills from a resume:\n\n- ${(context.content as string[]).join('\n- ')}\n\nPlease suggest other related technical or soft skills that would be valuable to add for a candidate with this profile.`;
        default:
            return "Please provide suggestions for this section.";
    }
};

const getTitle = (context: ChatContext) => {
    if (!context) return "";
    switch (context.type) {
        case 'summary': return "Enhance Summary";
        case 'work': return `Enhance Role at ${(context.content as WorkExperience).company}`;
        case 'education': return `Enhance Degree from ${(context.content as Education).institution}`;
        case 'skills': return "Enhance Skills";
        default: return "Enhance Section";
    }
};

export const ChatEnhancementModal: React.FC<ChatEnhancementModalProps> = ({ isOpen, onClose, context }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Initialize chat and get initial suggestions when modal opens with new context
    useEffect(() => {
        if (isOpen && context) {
            const initializeChat = async () => {
                setIsLoading(true);
                setHistory([]);
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                    const chatSession = ai.chats.create({
                        model: 'gemini-2.5-flash',
                        config: {
                            systemInstruction: 'You are an expert resume writer and career coach. Your goal is to help the user improve sections of their resume. Be concise, positive, and provide actionable advice in markdown format. When asked, rewrite the text using strong action verbs and quantifiable achievements.',
                        },
                    });
                    setChat(chatSession);

                    const initialPrompt = getInitialPrompt(context);
                    const responseStream = await chatSession.sendMessageStream({ message: initialPrompt });
                    
                    let fullResponse = "";
                    setHistory([{ role: 'model', text: '...' }]); // Placeholder

                    for await (const chunk of responseStream) {
                        fullResponse += chunk.text;
                        setHistory([{ role: 'model', text: fullResponse }]);
                    }
                } catch (error) {
                    console.error("Chat initialization failed:", error);
                    setHistory([{ role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
                } finally {
                    setIsLoading(false);
                }
            };
            initializeChat();
        }
    }, [isOpen, context]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            
            let fullResponse = "";
            setHistory(prev => [...prev, { role: 'model', text: '...' }]); // Placeholder

            for await (const chunk of responseStream) {
                fullResponse += chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', text: fullResponse };
                    return newHistory;
                });
            }
        } catch (error) {
            console.error("Send message failed:", error);
            setHistory(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-2xl h-[80vh] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col shadow-2xl shadow-cyan-500/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-cyan-400" />
                                <h2 className="font-bold text-white truncate">{getTitle(context)}</h2>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full text-neutral-400 hover:bg-slate-800 transition-colors">
                                <X size={20} />
                            </button>
                        </header>

                        {/* Chat History */}
                        <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col gap-4">
                                {history.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`relative group max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-neutral-200'}`}>
                                            <pre className="font-sans whitespace-pre-wrap">{msg.text}</pre>
                                            {msg.role === 'model' && (
                                                <button 
                                                onClick={() => handleCopy(msg.text, index)}
                                                className="absolute -top-2 -right-2 p-1.5 bg-slate-700 rounded-full text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {copiedIndex === index ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && history.length > 0 && history[history.length-1].role === 'user' && (
                                    <div className="flex justify-start">
                                        <div className="max-w-lg px-4 py-2 rounded-xl bg-slate-800 text-neutral-200">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <footer className="p-4 border-t border-slate-700 flex-shrink-0">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for a revision or a new suggestion..."
                                    className="flex-grow bg-slate-800 border border-slate-600 rounded-full px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                    disabled={isLoading}
                                />
                                <button type="submit" disabled={isLoading || !input.trim()} className="p-2.5 rounded-full bg-cyan-500 text-white disabled:bg-slate-700 disabled:text-neutral-500 transition-colors">
                                    <Send size={20} />
                                </button>
                            </form>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};