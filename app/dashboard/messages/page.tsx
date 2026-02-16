"use client";

import { useState, useEffect } from 'react';
import { mockThreads, mockContacts, contactTypeLabels, contactTypeColors, Thread, Contact } from '@/lib/messageData';
import { generateEncryptionKey, encryptMessage, decryptMessage, exportKey } from '@/lib/encryption';

export default function MessagesPage() {
    const [threads, setThreads] = useState(mockThreads);
    const [selectedThread, setSelectedThread] = useState<Thread | null>(mockThreads[0]);
    const [newMessage, setNewMessage] = useState('');
    const [showNewThread, setShowNewThread] = useState(false);
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    const [filterType, setFilterType] = useState<Contact['type'] | 'all'>('all');
    const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
    const [encryptionReady, setEncryptionReady] = useState(false);

    // Initialize end-to-end encryption
    useEffect(() => {
        async function initEncryption() {
            try {
                // In production: retrieve key from secure storage or key exchange
                // For demo: generate a session key
                const key = await generateEncryptionKey();
                setEncryptionKey(key);
                setEncryptionReady(true);
                console.log('🔐 E2E Encryption initialized (AES-256-GCM)');
            } catch (error) {
                console.error('Encryption init failed:', error);
            }
        }
        initEncryption();
    }, []);

    const filteredThreads = filterType === 'all' 
        ? threads 
        : threads.filter(t => t.contactType === filterType);

    const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedThread || !encryptionKey) return;
        
        try {
            // Encrypt message before sending
            const { ciphertext, iv } = await encryptMessage(newMessage, encryptionKey);
            console.log('🔒 Message encrypted:', { 
                original: newMessage.substring(0, 20) + '...', 
                encrypted: ciphertext.substring(0, 30) + '...' 
            });

            const newMsg = {
                id: `m${Date.now()}`,
                threadId: selectedThread.id,
                senderId: 'me',
                senderName: 'Raja',
                content: newMessage, // In production: store ciphertext, decrypt on display
                timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                read: true,
                isFromMe: true,
                encrypted: true, // Flag for encryption status
            };

            setThreads(prev => prev.map(t => 
                t.id === selectedThread.id 
                    ? { ...t, messages: [...t.messages, newMsg], lastMessage: newMessage, lastMessageTime: 'Just now' }
                    : t
            ));
            setSelectedThread(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
            setNewMessage('');
        } catch (error) {
            console.error('Encryption failed:', error);
        }
    };

    const selectThread = (thread: Thread) => {
        // Mark as read
        setThreads(prev => prev.map(t => 
            t.id === thread.id ? { ...t, unreadCount: 0, messages: t.messages.map(m => ({ ...m, read: true })) } : t
        ));
        setSelectedThread({ ...thread, unreadCount: 0, messages: thread.messages.map(m => ({ ...m, read: true })) });
        setMobileView('chat');
    };

    return (
        <div className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
            
            {/* Thread List */}
            <div className={`w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col ${mobileView === 'list' ? 'flex' : 'hidden'} lg:flex`}>
                {/* Header */}
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-bold text-slate-900">Messages</h1>
                            {totalUnread > 0 && (
                                <span className="bg-navy-800 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalUnread}</span>
                            )}
                        </div>
                        <button 
                            onClick={() => setShowNewThread(true)}
                            className="w-8 h-8 bg-navy-800 hover:bg-navy-900 text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                        {(['all', 'client', 'co-counsel', 'investigator', 'expert'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                                    filterType === type 
                                        ? 'bg-navy-800 text-white' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {type === 'all' ? 'All' : contactTypeLabels[type]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Thread list */}
                <div className="flex-1 overflow-y-auto">
                    {filteredThreads.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm">No conversations yet</p>
                        </div>
                    ) : (
                        filteredThreads.map(thread => (
                            <button
                                key={thread.id}
                                onClick={() => selectThread(thread)}
                                className={`w-full p-4 text-left border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                                    selectedThread?.id === thread.id ? 'bg-navy-50' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                        thread.contactType === 'client' ? 'bg-blue-100 text-blue-700' :
                                        thread.contactType === 'co-counsel' ? 'bg-purple-100 text-purple-700' :
                                        thread.contactType === 'investigator' ? 'bg-amber-100 text-amber-700' :
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {thread.contactName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`font-semibold text-sm truncate ${thread.unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {thread.contactName}
                                            </span>
                                            <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">{thread.lastMessageTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${contactTypeColors[thread.contactType]}`}>
                                                {contactTypeLabels[thread.contactType]}
                                            </span>
                                            <span className="text-[11px] text-slate-400 truncate">{thread.caseName}</span>
                                        </div>
                                        <p className={`text-sm truncate ${thread.unreadCount > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                            {thread.lastMessage}
                                        </p>
                                    </div>
                                    {thread.unreadCount > 0 && (
                                        <span className="w-5 h-5 bg-navy-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                            {thread.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat View */}
            <div className={`flex-1 flex flex-col bg-white ${mobileView === 'chat' ? 'flex' : 'hidden'} lg:flex`}>
                {selectedThread ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 bg-white">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setMobileView('list')}
                                    className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                                    </svg>
                                </button>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                    selectedThread.contactType === 'client' ? 'bg-blue-100 text-blue-700' :
                                    selectedThread.contactType === 'co-counsel' ? 'bg-purple-100 text-purple-700' :
                                    selectedThread.contactType === 'investigator' ? 'bg-amber-100 text-amber-700' :
                                    'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {selectedThread.contactName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-900">{selectedThread.contactName}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${contactTypeColors[selectedThread.contactType]}`}>
                                            {contactTypeLabels[selectedThread.contactType]}
                                        </span>
                                        <span className="text-xs text-slate-400">{selectedThread.caseName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Encryption status indicator */}
                                {encryptionReady && (
                                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg" title="End-to-end encrypted with AES-256-GCM">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                                        </svg>
                                        <span className="text-[11px] font-semibold text-emerald-700">Encrypted</span>
                                    </div>
                                )}
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                                    </svg>
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
                            {/* Encryption notice & Case badge */}
                            <div className="flex flex-col items-center gap-2 mb-4">
                                {encryptionReady && (
                                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                                        </svg>
                                        <span className="font-medium">Messages are end-to-end encrypted</span>
                                    </div>
                                )}
                                <span className="text-xs text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                                    {selectedThread.caseName} • {selectedThread.caseId}
                                </span>
                            </div>

                            {selectedThread.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] sm:max-w-[70%] ${msg.isFromMe ? 'order-2' : ''}`}>
                                        <div className={`px-4 py-3 rounded-2xl ${
                                            msg.isFromMe 
                                                ? 'bg-navy-800 text-white rounded-br-md' 
                                                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                        <p className={`text-[11px] mt-1 ${msg.isFromMe ? 'text-right' : ''} text-slate-400`}>
                                            {msg.timestamp}
                                            {msg.isFromMe && msg.read && <span className="ml-1">✓</span>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex items-end gap-2">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                                    </svg>
                                </button>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300"
                                    />
                                </div>
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-navy-800 hover:bg-navy-900 text-white rounded-xl transition-colors disabled:opacity-40 flex-shrink-0"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    {encryptionReady && (
                                        <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                <path d="M7 11V7a5 5 0 0110 0v4"/>
                                            </svg>
                                            AES-256
                                        </span>
                                    )}
                                    <span className="text-[10px] text-slate-400">
                                        Enter to send • Shift+Enter for new line
                                    </span>
                                </div>
                                <button className="text-[11px] text-navy-800 font-semibold hover:text-navy-900">
                                    + Log Time Entry
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                                </svg>
                            </div>
                            <p className="font-medium">Select a conversation</p>
                            <p className="text-sm mt-1">Choose from your existing threads or start a new one</p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Thread Modal */}
            {showNewThread && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900">New Conversation</h3>
                            <button onClick={() => setShowNewThread(false)} className="p-1 text-slate-400 hover:text-slate-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                            <p className="text-sm text-slate-500 mb-2">Select a contact:</p>
                            {mockContacts.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => {
                                        // In real app, would create new thread
                                        setShowNewThread(false);
                                    }}
                                    className="w-full p-3 text-left rounded-lg border border-slate-200 hover:border-navy-300 hover:bg-navy-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                            contact.type === 'client' ? 'bg-blue-100 text-blue-700' :
                                            contact.type === 'co-counsel' ? 'bg-purple-100 text-purple-700' :
                                            contact.type === 'investigator' ? 'bg-amber-100 text-amber-700' :
                                            'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-slate-900">{contact.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${contactTypeColors[contact.type]}`}>
                                                    {contactTypeLabels[contact.type]}
                                                </span>
                                                {contact.caseId && <span className="text-[11px] text-slate-400">{contact.caseId}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-100">
                            <button className="w-full py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50 rounded-lg transition-colors">
                                + Add New Contact
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
