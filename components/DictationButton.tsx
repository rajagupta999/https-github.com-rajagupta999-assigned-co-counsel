"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface DictationButtonProps {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

// Extend Window for webkitSpeechRecognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

export default function DictationButton({ 
  onTranscript, 
  onInterim,
  className = '', 
  size = 'md',
  variant = 'icon'
}: DictationButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    const supported = typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setIsSupported(supported);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    finalTranscriptRef.current = '';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (final) {
        finalTranscriptRef.current += final;
        onTranscript(finalTranscriptRef.current);
      }

      if (interim) {
        setInterimText(interim);
        onInterim?.(finalTranscriptRef.current + interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in your browser settings.');
      }
      stopListening();
    };

    recognition.onend = () => {
      // Deliver final transcript if we have accumulated text
      if (finalTranscriptRef.current) {
        onTranscript(finalTranscriptRef.current);
      }
      setIsListening(false);
      setInterimText('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, onTranscript, onInterim, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!isSupported) return null;

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'button') {
    return (
      <button
        onClick={toggleListening}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isListening 
            ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' 
            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
        } ${className}`}
        title={isListening ? 'Stop dictating' : 'Start dictation'}
      >
        <MicIcon className={iconSizes[size]} />
        {isListening ? 'Stop' : 'Dictate'}
      </button>
    );
  }

  return (
    <button
      onClick={toggleListening}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all ${
        isListening 
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
      } ${className}`}
      title={isListening ? 'Stop dictating (click or just stop talking)' : 'Start dictation'}
    >
      {isListening ? (
        <StopIcon className={iconSizes[size]} />
      ) : (
        <MicIcon className={iconSizes[size]} />
      )}
    </button>
  );
}

function MicIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  );
}

function StopIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
