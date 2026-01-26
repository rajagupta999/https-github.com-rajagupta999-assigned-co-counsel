
"use client";

import { useState } from 'react';

export default function CoPilotPage() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'I have analyzed the discovery documents. Ready to draft your Motion to Suppress?' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { role: 'user', content: inputValue }]);
        setInputValue('');

        // Simulating AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: 'Drafting now. Citing De Bour.'
            }]);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in relative">
            {/* Document Background */}

            {/* Left Pane: Document Editor (Google Docs Style) */}
            <div className="flex-1 flex flex-col card p-0 overflow-hidden shadow-sm border-gray-300">
                <div className="p-3 border-b border-gray-200 bg-[#f8f9fa] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600 font-bold text-xl">≡</div>
                        <h2 className="font-medium text-gray-700 text-sm">Motion to Suppress.docx</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-xs btn btn-primary px-4 py-1.5 h-auto">Share</button>
                    </div>
                </div>

                {/* Toolbar Simulation */}
                <div className="px-4 py-2 border-b border-gray-200 bg-white flex gap-4 text-gray-500 text-sm">
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span className="border-l border-gray-300 mx-2"></span>
                    <strong>B</strong>
                    <em>I</em>
                    <span className="underline">U</span>
                </div>

                <div className="flex-1 p-12 bg-white text-gray-900 font-serif leading-relaxed overflow-y-auto max-w-4xl mx-auto w-full shadow-inner bg-[#f0f0f0]">
                    <div className="bg-white shadow-sm min-h-full p-12 mx-auto">
                        <p className="mb-6 text-center">SUPREME COURT OF THE STATE OF NEW YORK<br />COUNTY OF NEW YORK</p>
                        <p className="mb-8 font-bold text-center">PEOPLE OF THE STATE OF NEW YORK vs. JOHN DOE</p>

                        <h3 className="font-bold underline mb-4 text-center">AFFIRMATION IN SUPPORT OF MOTION</h3>

                        <p className="mb-4 indent-8 text-justify">
                            1. I am the attorney for the defendant, JOHN DOE, and make this affirmation in support of the motion to suppress physical evidence...
                        </p>

                        <p className="mb-4 indent-8 text-justify bg-blue-50 border-l-2 border-blue-500 pl-2 pr-1 relative group cursor-help">
                            2. On October 12, 2025, Officer Smith stopped Mr. Doe's vehicle without probable cause. As established in
                            <span className="font-bold text-blue-800 mx-1">People v. De Bour, 40 N.Y.2d 210</span>,
                            a police officer may not stop a vehicle merely for a "hunch".

                            {/* Source Hover Tooltip */}
                            <span className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-72 p-3 bg-gray-900 text-white text-xs rounded shadow-xl z-50">
                                <strong className="block text-blue-300 mb-1">Source: Legal Knowledge Base</strong>
                                "Common-law right to inquire is activated by a founded suspicion..."
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Pane: AI Chat (Side Panel) */}
            <div className="w-80 flex flex-col card p-0 border-l-0 rounded-l-none bg-white shadow-lg fixed right-0 top-16 bottom-0 z-30 border border-gray-300">
                <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                    <h2 className="font-medium text-gray-700 flex items-center gap-2 text-sm">
                        <span className="text-blue-600">✦</span> Case Strategist
                    </h2>
                    <button className="text-gray-400 hover:text-gray-600">×</button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg text-sm max-w-[90%] shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 border border-transparent focus-within:bg-white focus-within:border-blue-500/50 transition-colors">
                        <input
                            className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700"
                            placeholder="Ask to draft..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button onClick={sendMessage} className="text-blue-600 font-bold text-lg leading-none">↑</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
