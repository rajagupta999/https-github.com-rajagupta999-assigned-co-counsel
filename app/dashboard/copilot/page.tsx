
"use client";

import { useState, useRef, useEffect } from 'react';
import { divorceGuidebook } from '@/lib/divorceContent';

export default function CoPilotPage() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'I am your Assigned Co-Counsel. How can I help you today? You can ask me to draft documents, summarize cases, or guide you through the Divorce Workflow.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [editorContent, setEditorContent] = useState<string>('');
    const [activeWorkflow, setActiveWorkflow] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleWorkflowClick = (stepId: number) => {
        const step = divorceGuidebook.steps.find(s => s.id === stepId);
        if (!step) return;

        setActiveWorkflow(stepId);

        // Simulate AI "Thinking" and then drafting
        setMessages(prev => [...prev, { role: 'user', content: `Start workflow: ${step.title}` }]);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `I've pulled up the guide for **${step.title}**. \n\nI have populated the editor with the key checklist items for this step.`
            }]);

            setEditorContent(`
# ${step.title}

## Overview
${step.content}

## Action Checklist
[ ] Review current safety status
[ ] Gather relevant documents
[ ] Secure digital accounts

## Notes
(Start typing your notes here...)
            `);
        }, 800);
    };

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { role: 'user', content: inputValue }]);
        setInputValue('');

        // Simulating "Harvey" logic
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
        <div className="h-[calc(100vh-64px)] flex bg-[#f0f2f5] overflow-hidden">

            {/* LEFT PANE: Editor / Canvas (The "Work") */}
            <div className="flex-1 flex flex-col h-full border-r border-[#dadce0] bg-white shadow-sm z-10 transition-all duration-300">
                {/* Editor Toolbar */}
                <div className="h-14 border-b border-[#dadce0] flex items-center justify-between px-4 bg-white">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-gray-500">description</span>
                        <span className="font-medium text-gray-700 text-sm">Untitled Document</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Saved</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-xs font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded transition-colors">Format</button>
                        <button className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">Export PDF</button>
                    </div>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-white cursor-text">
                    {editorContent ? (
                        <pre className="font-sans text-gray-800 whitespace-pre-wrap leading-relaxed max-w-3xl mx-auto">
                            {editorContent}
                        </pre>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <p className="text-sm">Select a workflow or ask the Assistant to start drafting.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: Assistant / Chat (The "Brain") */}
            <div className="w-[400px] flex flex-col h-full bg-white relative">
                {/* Chat Header */}
                <div className="h-14 border-b border-[#dadce0] flex items-center justify-between px-4 bg-white z-20 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">AI</div>
                        <span className="font-semibold text-gray-800 text-sm">Co-Counsel</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="text-xs text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Online
                        </span>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3.5 rounded-2xl text-sm max-w-[85%] shadow-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}>
                                <div className="markdown-prose">{msg.content}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Workflow Selector (Quick Actions) */}
                <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {divorceGuidebook.steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => handleWorkflowClick(step.id)}
                            className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full mr-2 transition-colors border border-gray-200"
                        >
                            {step.id}. {step.title.split(':')[0]}…
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-[#dadce0]">
                    <div className="relative flex items-center">
                        <textarea
                            className="w-full bg-[#f1f3f4] text-gray-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all resize-none"
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
                            className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                    <div className="text-[10px] text-gray-400 text-center mt-2">
                        {divorceGuidebook.disclaimer}
                    </div>
                </div>
            </div>
        </div>
    );
}
