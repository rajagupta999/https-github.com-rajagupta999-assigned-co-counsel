"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { divorceSteps } from '@/lib/divorceContent';

function CoPilotContent() {
    const searchParams = useSearchParams();
    const workflowId = searchParams.get('workflow');
    const [messages, setMessages] = useState([{ role: 'ai', content: 'I am your Assigned Co-Counsel. How can I help you today? Ask me to draft documents, summarize cases, or guide you through the Divorce Workflow.' }]);
    const [inputValue, setInputValue] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInit = useRef(false);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        if (workflowId && !hasInit.current) { handleWorkflow(workflowId); hasInit.current = true; }
    }, [workflowId]);

    const handleWorkflow = (stepId: string) => {
        const step = divorceSteps.find(s => s.id === stepId);
        if (!step) return;
        setActiveWorkflow(stepId);
        setMessages(prev => [...prev, { role: 'user', content: `Start workflow: ${step.title}` }]);
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', content: `I've loaded the guide for **${step.title}**.\n\n${step.copilotPrompt}` }]);
            setEditorContent(`# ${step.title}\n\n## Overview\n${step.description}\n\n## Checklist\n[ ] Review current status\n[ ] Gather documents\n[ ] Draft relevant filings`);
        }, 800);
    };

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
        const msg = inputValue;
        setInputValue('');
        setTimeout(() => {
            let reply = 'I can help with that. Could you provide more details?';
            if (msg.toLowerCase().includes('draft')) { reply = "I'm drafting that in the editor now."; setEditorContent(prev => prev + '\n\n## New Draft\nBased on your request...'); }
            else if (msg.toLowerCase().includes('summary')) { reply = 'Here is a summary of the context...'; }
            setMessages(prev => [...prev, { role: 'ai', content: reply }]);
        }, 1000);
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 0px)', overflow: 'hidden' }}>
            {/* Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Document Editor</span>
                    <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}>Export PDF</span>
                </div>
                <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
                    {editorContent ? (
                        <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#334155', fontSize: '14px', maxWidth: '640px' }}>{editorContent}</pre>
                    ) : (
                        <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '4rem', fontSize: '14px' }}>Select a workflow or ask the assistant to start drafting.</div>
                    )}
                </div>
            </div>

            {/* Chat */}
            <div style={{ width: '380px', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Co-Counsel AI</div>
                <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ maxWidth: '85%', padding: '0.625rem 0.875rem', borderRadius: '10px', fontSize: '13px', lineHeight: 1.6, background: msg.role === 'user' ? '#2563eb' : '#f1f5f9', color: msg.role === 'user' ? '#fff' : '#334155' }}>{msg.content}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {/* Workflow buttons */}
                <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #e2e8f0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {divorceSteps.map(step => (
                        <button key={step.id} onClick={() => handleWorkflow(step.id)} style={{ display: 'inline-block', marginRight: '0.375rem', padding: '0.375rem 0.625rem', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: '1px solid', borderColor: activeWorkflow === step.id ? '#2563eb' : '#e2e8f0', background: activeWorkflow === step.id ? '#eff6ff' : '#fff', color: activeWorkflow === step.id ? '#2563eb' : '#64748b', cursor: 'pointer' }}>
                            {step.order}. {step.title.split(':')[0]}
                        </button>
                    ))}
                </div>
                {/* Input */}
                <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }} placeholder="Type a message..." style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                        <button onClick={sendMessage} disabled={!inputValue.trim()} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', opacity: inputValue.trim() ? 1 : 0.4 }}>Send</button>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', marginTop: '0.5rem' }}>Co-Counsel can make mistakes. Verify all legal citations.</div>
                </div>
            </div>
        </div>
    );
}

export default function CoPilotPage() {
    return (
        <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading Co-Pilot...</div>}>
            <CoPilotContent />
        </Suspense>
    );
}
