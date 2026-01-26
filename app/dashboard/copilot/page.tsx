
"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { divorceSteps } from '@/lib/divorceContent';

function CoPilotContent() {
    const searchParams = useSearchParams();
    const workflowId = searchParams.get('workflow');

    const [messages, setMessages] = useState([
        { role: 'ai', content: 'I am your Assigned Co-Counsel. How can I help you today? You can ask me to draft documents, summarize cases, or guide you through the Divorce Workflow.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [editorContent, setEditorContent] = useState<string>('');
    const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitializedWorkflow = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (workflowId && !hasInitializedWorkflow.current) {
            handleWorkflowLaunch(workflowId);
            hasInitializedWorkflow.current = true;
        }
    }, [workflowId]);

    const handleWorkflowLaunch = (stepId: string) => {
        const step = divorceSteps.find(s => s.id === stepId);
        if (!step) return;

        setActiveWorkflow(stepId);

        setMessages(prev => [...prev, { role: 'user', content: `Start workflow: ${step.title}` }]);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `I've pulled up the guide for **${step.title}**. \n\nI have populated the editor with the key checklist items for this step.\n\n${step.copilotPrompt}`
            }]);

            setEditorContent(`
# ${step.title}

## Overview
${step.description}

## Action Checklist
[ ] Review current status
[ ] Gather relevant documents
[ ] Secure digital accounts

## Draft
(AI generation placeholder based on: "${step.copilotPrompt}")
            `);
        }, 800);
    };

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { role: 'user', content: inputValue }]);
        setInputValue('');

        setTimeout(() => {
            let aiResponse = "I can help with that. Could you provide more details?";
            if (inputValue.toLowerCase().includes('draft')) {
                aiResponse = "I'm drafting that for you in the editor on the left.";
                setEditorContent(prev => prev + "\n\n## New Draft Section\nBased on your request, here is a draft clause...");
            } else if (inputValue.toLowerCase().includes('summary')) {
                aiResponse = "Here is a summary of the context...";
            }

            setMessages(prev => [...prev, {
                role: 'ai',
                content: aiResponse
            }]);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-56px)] flex bg-slate-50 overflow-hidden">

            {/* LEFT PANE: Editor */}
            <div className="flex-1 flex flex-col h-full border-r border-slate-200/80 bg-white">
                {/* Editor Toolbar */}
                <div className="h-12 border-b border-slate-100 flex items-center justify-between px-5 bg-white">
                    <div className="flex items-center gap-2.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <span className="font-semibold text-slate-600 text-sm">Untitled Document</span>
                        <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-medium">Saved</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-colors">Format</button>
                        <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">Export PDF</button>
                    </div>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-white cursor-text">
                    {editorContent ? (
                        <pre className="font-sans text-slate-700 whitespace-pre-wrap leading-relaxed max-w-3xl mx-auto text-[15px]">
                            {editorContent}
                        </pre>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                            </div>
                            <p className="text-sm font-medium">Select a workflow or ask the Assistant to start drafting.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: Assistant Chat */}
            <div className="w-[400px] flex flex-col h-full bg-white relative">
                {/* Chat Header */}
                <div className="h-12 border-b border-slate-100 flex items-center justify-between px-5 bg-white">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm">AI</div>
                        <span className="font-semibold text-slate-800 text-sm">Co-Counsel</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1.5 font-semibold">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Online
                    </span>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm'
                                }`}>
                                <div className="markdown-prose">{msg.content}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Workflow Selector */}
                <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {divorceSteps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => handleWorkflowLaunch(step.id)}
                            className={`inline-flex items-center text-[11px] font-semibold px-3 py-1.5 rounded-lg mr-1.5 transition-all border ${activeWorkflow === step.id
                                ? 'text-blue-700 bg-blue-50 border-blue-200'
                                : 'text-slate-500 bg-slate-50 border-slate-100 hover:bg-slate-100 hover:text-slate-700'
                                }`}
                        >
                            {step.order}. {step.title.split(':')[0]}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200/80">
                    <div className="relative flex items-center">
                        <textarea
                            className="w-full bg-slate-50 text-slate-700 text-sm rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-300 transition-all resize-none border border-slate-200"
                            placeholder="Message Co-Counsel..."
                            rows={1}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!inputValue.trim()}
                            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all shadow-sm"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                        Assigned Co-Counsel can make mistakes. Verify all legal citations.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CoPilotPage() {
    return (
        <Suspense fallback={
            <div className="h-[calc(100vh-56px)] flex items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Loading Co-Pilot...</span>
                </div>
            </div>
        }>
            <CoPilotContent />
        </Suspense>
    );
}
