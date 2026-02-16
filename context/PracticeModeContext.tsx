"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PracticeMode = 'prose' | '18b' | 'private' | 'combined';

interface PracticeModeContextType {
  mode: PracticeMode;
  setMode: (mode: PracticeMode) => void;
  is18B: boolean;
  isAssigned: boolean;
  isPrivate: boolean;
  isProSe: boolean;
}

const PracticeModeContext = createContext<PracticeModeContextType | undefined>(undefined);

export function PracticeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PracticeMode>('18b');

  useEffect(() => {
    const userType = localStorage.getItem('acc_user_type');
    // Clients are always locked to prose mode
    if (userType === 'client') {
      setModeState('prose');
      localStorage.setItem('acc_practice_mode', 'prose');
      return;
    }
    const saved = localStorage.getItem('acc_practice_mode') as PracticeMode | null;
    if (saved && ['prose', '18b', 'private', 'combined'].includes(saved)) {
      setModeState(saved);
    }
  }, []);

  const setMode = (m: PracticeMode) => {
    // Clients can't change mode
    const userType = typeof window !== 'undefined' ? localStorage.getItem('acc_user_type') : null;
    if (userType === 'client') return;
    setModeState(m);
    localStorage.setItem('acc_practice_mode', m);
  };

  const is18B = mode === '18b' || mode === 'combined';
  const isAssigned = is18B;
  const isPrivate = mode === 'private' || mode === 'combined';
  const isProSe = mode === 'prose';

  return (
    <PracticeModeContext.Provider value={{ mode, setMode, is18B, isAssigned, isPrivate, isProSe }}>
      {children}
    </PracticeModeContext.Provider>
  );
}

export function usePracticeMode() {
  const context = useContext(PracticeModeContext);
  if (!context) throw new Error('usePracticeMode must be used within PracticeModeProvider');
  return context;
}
