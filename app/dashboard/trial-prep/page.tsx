"use client";

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import DictationButton from '@/components/DictationButton';
import {
  processDocument as ragProcessDoc, generateTopicSummaries, buildMasterIndex,
  routeQuery, searchChunks, addVulnerability, calculateLetterGrade, getGradeColor,
  buildPrepStats, saveMasterIndex, loadMasterIndex, saveProcessedDocs,
  type RagDocument, type TopicSummary, type MasterIndex, type PrepStats,
} from '@/lib/ragProcessor';

const FUNCTIONS_BASE = 'https://us-central1-assigned-co-counsel.cloudfunctions.net';

type ExamMode = 'cross' | 'direct' | 'deposition';
type Role = 'opposing' | 'your-counsel';
type Message = {
  id: string;
  role: 'system' | 'examiner' | 'witness';
  content: string;
  timestamp: number;
  feedback?: string;
  score?: number;
};

interface PrepSession {
  id: string;
  caseId: string;
  caseName: string;
  mode: ExamMode;
  role: Role;
  opposingPersona: string;
  witnessName: string;
  messages: Message[];
  documents: UploadedDoc[];
  startedAt: number;
  score?: number;
}

interface UploadedDoc {
  id: string;
  name: string;
  text: string;
  size: number;
}

const MODE_CONFIG = {
  cross: {
    label: 'Cross-Examination',
    icon: '⚔️',
    description: 'AI plays opposing counsel and cross-examines you. Practice staying composed under aggressive questioning.',
    color: 'from-red-600 to-red-800',
    badge: 'bg-red-100 text-red-700',
    tips: [
      'Answer only what is asked — don\'t volunteer information',
      'If you don\'t remember, say so',
      'Don\'t argue with the examiner',
      'Stay calm and consistent',
      'Listen to the full question before answering',
    ],
  },
  direct: {
    label: 'Direct Examination',
    icon: '🎯',
    description: 'AI plays your attorney and walks you through direct examination. Practice telling your story clearly.',
    color: 'from-blue-600 to-blue-800',
    badge: 'bg-blue-100 text-blue-700',
    tips: [
      'Answer in full sentences when appropriate',
      'Make eye contact with the jury (in real life)',
      'Speak clearly and at a measured pace',
      'Tell the truth — the full truth',
      'Let your attorney guide you through the narrative',
    ],
  },
  deposition: {
    label: 'Deposition Prep',
    icon: '📝',
    description: 'AI simulates a deposition environment. Practice giving clear, concise answers under oath.',
    color: 'from-amber-600 to-amber-800',
    badge: 'bg-amber-100 text-amber-700',
    tips: [
      'Wait for the full question before answering',
      'Answer verbally — no head nods (it\'s on record)',
      'If you don\'t understand, ask for clarification',
      'Don\'t guess — "I don\'t know" is acceptable',
      'Take your time — there\'s no rush',
    ],
  },
};

export default function TrialPrepPage() {
  const { cases, currentCase } = useAppContext();
  const [selectedCase, setSelectedCase] = useState(currentCase?.id || '');
  const [mode, setMode] = useState<ExamMode>('cross');
  const [opposingName, setOpposingName] = useState('');
  const [witnessName, setWitnessName] = useState('');
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [ragDocs, setRagDocs] = useState<RagDocument[]>([]);
  const [masterIndex, setMasterIndex] = useState<MasterIndex | null>(null);
  const [isProcessingRag, setIsProcessingRag] = useState(false);
  const [ragStatus, setRagStatus] = useState<string>('');
  const [prepStats, setPrepStats] = useState<PrepStats | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [session, setSession] = useState<PrepSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [sessionHistory, setSessionHistory] = useState<PrepSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load session history
  useEffect(() => {
    const saved = localStorage.getItem('acc_trial_prep_sessions');
    if (saved) setSessionHistory(JSON.parse(saved));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);

    for (const file of Array.from(files)) {
      try {
        let text = '';
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          text = await file.text();
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          // For PDF, we'll extract text client-side (basic approach)
          text = await extractPdfText(file);
        } else {
          // Try reading as text
          text = await file.text();
        }

        if (text.trim()) {
          setDocuments(prev => [...prev, {
            id: `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            text: text.slice(0, 50000), // Cap at 50k chars per doc
            size: file.size,
          }]);
        }
      } catch (err) {
        console.error('Failed to read file:', file.name, err);
      }
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Process documents into RAG
  const processRag = async () => {
    if (documents.length === 0) return;
    setIsProcessingRag(true);

    try {
      // Step 1: Chunk and index documents
      setRagStatus('Chunking and indexing documents...');
      const processed = documents.map(doc => ragProcessDoc(doc));
      setRagDocs(processed);

      // Step 2: Generate topic summaries
      setRagStatus(`Analyzing ${documents.length} documents — generating topic summaries...`);
      const caseObj = cases.find(c => c.id === selectedCase);
      const caseName = caseObj ? `${caseObj.client} — ${caseObj.charges}` : 'Case Preparation';
      const caseType = caseObj?.charges?.toLowerCase().includes('custody') || caseObj?.charges?.toLowerCase().includes('family') ? 'family' : 'criminal';
      
      const topics = await generateTopicSummaries(processed, caseName, caseType as any);

      // Step 3: Build master index
      setRagStatus('Building master index...');
      const index = buildMasterIndex(selectedCase || 'general', caseName, processed, topics);
      setMasterIndex(index);

      // Save to localStorage
      saveMasterIndex(index);
      saveProcessedDocs(selectedCase || 'general', processed);

      setRagStatus(`✅ RAG ready — ${index.totalDocs} docs, ${index.totalChunks} chunks, ${index.topics.length} topic summaries`);
    } catch (err) {
      console.error('RAG processing error:', err);
      setRagStatus('⚠️ RAG processing failed — will use raw documents');
    } finally {
      setIsProcessingRag(false);
    }
  };

  // Auto-process RAG when documents change
  useEffect(() => {
    if (documents.length > 0 && !isProcessingRag && !masterIndex) {
      processRag();
    }
  }, [documents.length]);

  // Basic PDF text extraction (works for text-based PDFs)
  const extractPdfText = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

    // Try to extract text between BT and ET markers (PDF text objects)
    const textParts: string[] = [];
    const btRegex = /BT[\s\S]*?ET/g;
    let match;
    while ((match = btRegex.exec(text)) !== null) {
      const block = match[0];
      // Extract text from Tj and TJ operators
      const tjRegex = /\(([^)]*)\)\s*Tj/g;
      let tj;
      while ((tj = tjRegex.exec(block)) !== null) {
        textParts.push(tj[1]);
      }
    }

    if (textParts.length > 0) {
      return textParts.join(' ');
    }

    // Fallback: just return readable ASCII portions
    return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 50000);
  };

  const removeDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Start a prep session
  const startSession = async () => {
    const caseObj = cases.find(c => c.id === selectedCase);
    const caseName = caseObj ? `${caseObj.client} — ${caseObj.charges}` : 'General Preparation';

    const newSession: PrepSession = {
      id: `prep-${Date.now()}`,
      caseId: selectedCase,
      caseName,
      mode,
      role: mode === 'direct' ? 'your-counsel' : 'opposing',
      opposingPersona: opposingName || 'Opposing Counsel',
      witnessName: witnessName || 'the witness',
      messages: [],
      documents,
      startedAt: Date.now(),
    };

    setSession(newSession);
    setShowTips(false);

    // Generate opening question
    await generateExaminerMessage(newSession, true);
  };

  // Generate AI examiner message
  const generateExaminerMessage = async (currentSession: PrepSession, isOpening: boolean) => {
    setIsThinking(true);

    // Build smart context using RAG: topic summaries + relevant chunks
    let docContext = '';
    
    if (masterIndex && masterIndex.topics.length > 0) {
      // Use topic summaries for broad context
      const topicContext = masterIndex.topics.map(t => 
        `## ${t.label}\n${t.content}`
      ).join('\n\n');
      docContext = `\n\nTOPIC SUMMARIES (pre-analyzed from ${masterIndex.totalDocs} case documents, ${masterIndex.totalChunks} chunks):\n${topicContext}`;

      // If we have a specific question context, add relevant chunks
      if (!isOpening && currentSession.messages.length > 0) {
        const lastExaminerMsg = [...currentSession.messages].reverse().find(m => m.role === 'examiner');
        if (lastExaminerMsg && ragDocs.length > 0) {
          const relevantTopics = routeQuery(lastExaminerMsg.content, masterIndex);
          if (relevantTopics.length > 0) {
            docContext += `\n\nMOST RELEVANT TOPICS FOR CURRENT LINE OF QUESTIONING:\n${relevantTopics.map(t => t.content).join('\n\n')}`;
          }
          const relevantChunks = searchChunks(lastExaminerMsg.content, ragDocs, 3);
          if (relevantChunks.length > 0) {
            docContext += `\n\nRELEVANT DOCUMENT EXCERPTS:\n${relevantChunks.map(c => `[${c.docName}]: ${c.text.slice(0, 1000)}`).join('\n\n')}`;
          }
        }
      }
    } else if (currentSession.documents.length > 0) {
      // Fallback: raw document text
      docContext = `\n\nCASE DOCUMENTS:\n${currentSession.documents.map(d => `--- ${d.name} ---\n${d.text.slice(0, 15000)}`).join('\n\n')}`;
    }

    const messageHistory = currentSession.messages.map(m =>
      `${m.role === 'examiner' ? currentSession.opposingPersona : currentSession.witnessName}: ${m.content}`
    ).join('\n');

    let systemPrompt = '';
    if (currentSession.mode === 'cross') {
      systemPrompt = `You are ${currentSession.opposingPersona}, an experienced opposing counsel conducting cross-examination in a legal proceeding. Your goal is to challenge the witness's testimony, find inconsistencies, and weaken their credibility.

RULES:
- Ask ONE question at a time
- Be aggressive but professional — lock into yes/no before springing follow-ups
- Reference specific details from the case documents when possible
- Try to trap the witness in contradictions
- Use leading questions (answerable with yes/no)
- Use the witness's own documents, depositions, and prior statements against them
- If the witness gives a good answer, acknowledge it briefly then move to another angle
- After each witness answer, provide brief FEEDBACK in brackets: [FEEDBACK: Assessment of the answer, what was good/bad, score X/10]

COACHING FORMULA (teach the witness):
- The ideal answer pattern is: "Yes." [half-beat] "Because ___." [one sentence max]
- Penalize answers that: volunteer too much, use inflammatory language, argue with the examiner, or are evasive
- Reward answers that: are concise, own the facts, and redirect positively
- Grade on a curve: 8+ = good witness behavior, 6-7 = acceptable but improvable, <6 = would hurt at trial

Case: ${currentSession.caseName}
Witness: ${currentSession.witnessName}${docContext}`;
    } else if (currentSession.mode === 'direct') {
      systemPrompt = `You are ${currentSession.opposingPersona}, the defense attorney conducting direct examination of your own witness/client. Your goal is to help the witness tell their story clearly and persuasively to the jury.

RULES:
- Ask open-ended questions (who, what, when, where, why, how)
- Guide the witness through the narrative chronologically
- Don't lead — let the witness provide the substance
- Reference specific case documents to prompt memory
- After each witness answer, provide brief FEEDBACK in brackets: [FEEDBACK: Assessment of the answer, suggestions for improvement, score X/10]

Case: ${currentSession.caseName}
Witness: ${currentSession.witnessName}${docContext}`;
    } else {
      systemPrompt = `You are ${currentSession.opposingPersona}, a litigation attorney conducting a deposition. The witness is under oath. Your goal is to gather information, pin down testimony, and explore all relevant facts.

RULES:
- Ask ONE question at a time
- Mix open-ended and specific questions
- Follow up on vague answers
- Reference documents ("I'm showing you what's been marked as Exhibit A...")
- Be thorough but not unnecessarily combative
- After each witness answer, provide brief FEEDBACK in brackets: [FEEDBACK: Assessment of the answer, what was effective/problematic, score X/10]

Case: ${currentSession.caseName}
Witness: ${currentSession.witnessName}${docContext}`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    if (isOpening) {
      messages.push({ role: 'user', content: `Begin the ${currentSession.mode === 'cross' ? 'cross-examination' : currentSession.mode === 'direct' ? 'direct examination' : 'deposition'}. Start with your first question.` });
    } else {
      // Add conversation history
      for (const msg of currentSession.messages) {
        messages.push({
          role: msg.role === 'examiner' ? 'assistant' : 'user',
          content: msg.content,
        });
      }
    }

    try {
      const response = await fetch(`${FUNCTIONS_BASE}/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'cerebras',
          task: 'analysis',
          messages,
          options: { maxTokens: 1000, temperature: 0.8 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.content || data.choices?.[0]?.message?.content || '';

        // Parse feedback and score from the response
        let feedback = '';
        let score: number | undefined;
        let cleanContent = content;

        const feedbackMatch = content.match(/\[FEEDBACK:\s*([\s\S]*?)\]/);
        if (feedbackMatch) {
          feedback = feedbackMatch[1].trim();
          cleanContent = content.replace(feedbackMatch[0], '').trim();
          const scoreMatch = feedback.match(/(\d+)\/10/);
          if (scoreMatch) score = parseInt(scoreMatch[1]);
        }

        const examinerMsg: Message = {
          id: `msg-${Date.now()}`,
          role: 'examiner',
          content: cleanContent,
          timestamp: Date.now(),
          feedback: !isOpening ? feedback : undefined,
          score: !isOpening ? score : undefined,
        };

        // Track vulnerabilities for low scores
        if (!isOpening && score && score < 6 && currentSession.messages.length > 0) {
          const lastWitnessMsg = [...currentSession.messages].reverse().find(m => m.role === 'witness');
          const lastExaminerMsg = [...currentSession.messages].reverse().find(m => m.role === 'examiner');
          if (lastWitnessMsg && lastExaminerMsg) {
            addVulnerability({
              id: `vuln-${Date.now()}`,
              topic: 'general',
              question: lastExaminerMsg.content,
              badAnswer: lastWitnessMsg.content,
              feedback,
              score,
              sessionId: currentSession.id,
              timestamp: Date.now(),
              resolved: false,
            });
          }
        }

        setSession(prev => {
          if (!prev) return prev;
          const updated = { ...prev, messages: [...prev.messages, examinerMsg] };
          return updated;
        });
      }
    } catch (err) {
      console.error('Error generating examiner message:', err);
    } finally {
      setIsThinking(false);
    }
  };

  // Submit witness answer
  const submitAnswer = async () => {
    if (!userInput.trim() || !session) return;

    const witnessMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'witness',
      content: userInput.trim(),
      timestamp: Date.now(),
    };

    const updatedSession = { ...session, messages: [...session.messages, witnessMsg] };
    setSession(updatedSession);
    setUserInput('');

    // Generate next examiner question with feedback
    await generateExaminerMessage(updatedSession, false);
  };

  // End session and save
  const endSession = () => {
    if (!session) return;

    // Calculate overall score and letter grade
    const scores = session.messages.filter(m => m.score).map(m => m.score!);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10 : undefined;
    const grade = avgScore ? calculateLetterGrade(avgScore) : undefined;

    const finalSession = { ...session, score: avgScore, grade };

    // Save to history
    const history = [...sessionHistory, finalSession].slice(-50); // Keep last 50
    setSessionHistory(history);
    localStorage.setItem('acc_trial_prep_sessions', JSON.stringify(history));

    setSession(null);
  };

  const config = MODE_CONFIG[mode];
  const openCases = cases.filter(c => c.status === 'Open');

  // Active session view
  if (session) {
    const sessionConfig = MODE_CONFIG[session.mode];
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
        {/* Session Header */}
        <div className={`bg-gradient-to-r ${sessionConfig.color} text-white px-4 py-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{sessionConfig.icon}</span>
              <div>
                <h2 className="text-sm font-bold">{sessionConfig.label}</h2>
                <p className="text-xs opacity-80">{session.caseName} • {session.opposingPersona} examining {session.witnessName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {session.messages.filter(m => m.score).length > 0 && (() => {
                const avg = session.messages.filter(m => m.score).reduce((a, m) => a + (m.score || 0), 0) / session.messages.filter(m => m.score).length;
                const grade = calculateLetterGrade(avg);
                return (
                  <div className="bg-white/20 rounded-lg px-3 py-1 flex items-center gap-2">
                    <span className="text-lg font-black">{grade}</span>
                    <span className="text-xs opacity-80">{avg.toFixed(1)}/10</span>
                  </div>
                );
              })()}
              <span className="text-xs opacity-60">{session.messages.filter(m => m.role === 'witness').length} answers</span>
              <button onClick={endSession} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors">
                End Session
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {session.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'witness' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'witness' ? '' : ''}`}>
                {/* Role label */}
                <div className={`text-[10px] font-bold mb-1 ${msg.role === 'witness' ? 'text-right text-blue-600' : 'text-red-600'}`}>
                  {msg.role === 'examiner' ? `${session.opposingPersona}` : session.witnessName}
                </div>

                {/* Message bubble */}
                <div className={`rounded-xl px-4 py-3 ${
                  msg.role === 'witness'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Feedback (shown below examiner messages, about the PREVIOUS witness answer) */}
                {msg.feedback && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-amber-700">📋 Feedback</span>
                      {msg.score && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          msg.score >= 8 ? 'bg-emerald-100 text-emerald-700' :
                          msg.score >= 6 ? 'bg-blue-100 text-blue-700' :
                          msg.score >= 4 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {msg.score}/10
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">{msg.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-slate-400">{session.opposingPersona} is formulating a question...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Answer Input */}
        <div className="bg-white border-t border-slate-200 px-4 py-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
                placeholder={`Answer as ${session.witnessName}... (Enter to submit, Shift+Enter for new line)`}
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 resize-none"
                disabled={isThinking}
              />
            </div>
            <div className="flex flex-col gap-1">
              <DictationButton onTranscript={text => setUserInput(prev => prev + ' ' + text)} size="md" />
              <button
                onClick={submitAnswer}
                disabled={isThinking || !userInput.trim()}
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors"
              >
                Answer
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-slate-400">💡 Tip: {MODE_CONFIG[session.mode].tips[Math.floor(session.messages.length / 2) % MODE_CONFIG[session.mode].tips.length]}</span>
          </div>
        </div>
      </div>
    );
  }

  // Setup view
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-slate-900">Trial & Deposition Prep</h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-powered practice sessions using your actual case documents. The AI takes the persona of opposing counsel and examines you (or your client) to prepare for depositions and trial.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.entries(MODE_CONFIG) as [ExamMode, typeof MODE_CONFIG.cross][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                mode === key
                  ? 'border-navy-600 bg-white shadow-lg ring-2 ring-navy-100'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <span className="text-2xl">{cfg.icon}</span>
              <h3 className="font-bold text-slate-900 mt-2">{cfg.label}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cfg.description}</p>
              {mode === key && (
                <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Setup Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className={`bg-gradient-to-r ${config.color} px-5 py-4 text-white`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{config.icon}</span>
              <div>
                <h2 className="font-bold">{config.label} Setup</h2>
                <p className="text-xs opacity-80">Configure your practice session</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Case Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Select Case</label>
              <select
                value={selectedCase}
                onChange={e => setSelectedCase(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20"
              >
                <option value="">General Preparation (no specific case)</option>
                {openCases.map(c => (
                  <option key={c.id} value={c.id}>{c.client} — {c.charges} ({c.county})</option>
                ))}
              </select>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  {mode === 'direct' ? 'Your Attorney Name' : 'Opposing Counsel Name'}
                </label>
                <input
                  value={opposingName}
                  onChange={e => setOpposingName(e.target.value)}
                  placeholder={mode === 'direct' ? 'e.g., Jane Smith, Esq.' : 'e.g., Shannon Simpson, ADA'}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Witness / Client Name</label>
                <input
                  value={witnessName}
                  onChange={e => setWitnessName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                />
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Case Documents <span className="text-xs text-slate-400 font-normal">(uploaded docs feed the AI&apos;s questions)</span>
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-navy-300 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx,.md"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Processing...' : '📁 Upload Case Documents'}
                </button>
                <p className="text-xs text-slate-400 mt-2">
                  Upload discovery, pleadings, depositions, police reports, etc. (.txt, .pdf, .doc)
                </p>
              </div>

              {/* RAG Processing Status */}
              {ragStatus && (
                <div className={`mt-2 p-3 rounded-lg text-xs ${ragStatus.startsWith('✅') ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : ragStatus.startsWith('⚠️') ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-indigo-50 border border-indigo-200 text-indigo-700'}`}>
                  <div className="flex items-center gap-2">
                    {isProcessingRag && <div className="w-3 h-3 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>}
                    <span>{ragStatus}</span>
                  </div>
                </div>
              )}

              {/* Topic Summaries Preview */}
              {masterIndex && masterIndex.topics.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Topic Summaries Generated:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {masterIndex.topics.map(t => (
                      <span key={t.id} className="text-[10px] px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded documents list */}
              {documents.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm">📄</span>
                        <span className="text-xs font-medium text-slate-700 truncate">{doc.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {(doc.size / 1024).toFixed(0)}KB • {doc.text.length.toLocaleString()} chars
                        </span>
                      </div>
                      <button onClick={() => removeDoc(doc.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            {showTips && (
              <div className={`${config.badge} bg-opacity-30 rounded-xl p-4`}>
                <h4 className="text-xs font-bold mb-2">💡 Tips for {config.label}</h4>
                <ul className="space-y-1">
                  {config.tips.map((tip, i) => (
                    <li key={i} className="text-xs flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={startSession}
              className={`w-full py-3 bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-bold rounded-xl text-sm transition-opacity flex items-center justify-center gap-2`}
            >
              {config.icon} Start {config.label} Session
            </button>
          </div>
        </div>

        {/* Session History */}
        {sessionHistory.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">📊</span>
                <h3 className="text-sm font-bold text-slate-700">Past Sessions ({sessionHistory.length})</h3>
              </div>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showHistory && (
              <div className="divide-y divide-slate-100">
                {sessionHistory.slice().reverse().map(s => {
                  const cfg = MODE_CONFIG[s.mode];
                  return (
                    <div key={s.id} className="px-5 py-3 flex items-center gap-3">
                      <span className="text-lg">{cfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{s.caseName}</p>
                        <p className="text-[10px] text-slate-400">
                          {cfg.label} • {s.messages.filter(m => m.role === 'witness').length} answers • {new Date(s.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {s.score && (
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-black px-2 py-0.5 rounded-lg ${getGradeColor(calculateLetterGrade(s.score))}`}>
                            {calculateLetterGrade(s.score)}
                          </span>
                          <span className="text-[10px] text-slate-400">{s.score}/10</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
