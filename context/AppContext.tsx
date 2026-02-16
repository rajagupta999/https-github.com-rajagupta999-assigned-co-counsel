
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCases, mockTasks } from '@/lib/mockData';

// Types
export interface Case {
    id: string;
    client: string;
    charges: string;
    county: string;
    status: string;
    nextCourtDate: string;
}

interface AppState {
    cases: Case[];
    currentCase: Case | null;
    setCurrentCase: (c: Case | null) => void;
    addCase: (newCase: Case) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [cases, setCases] = useState<Case[]>([]);
    const [currentCase, setCurrentCase] = useState<Case | null>(null);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedCases = localStorage.getItem('acc_cases');
        const savedCurrentCaseId = localStorage.getItem('acc_current_case_id');

        if (savedCases) {
            const parsed = JSON.parse(savedCases) as Case[];
            setCases(parsed);
            if (savedCurrentCaseId) {
                const found = parsed.find(c => c.id === savedCurrentCaseId) || null;
                setCurrentCase(found);
            }
        } else {
            // Initialize with mock data if empty
            setCases(mockCases);
            setCurrentCase(mockCases[0] || null);
        }
    }, []);

    // Sync to LocalStorage
    useEffect(() => {
        if (cases.length > 0) {
            localStorage.setItem('acc_cases', JSON.stringify(cases));
        }
    }, [cases]);

    useEffect(() => {
        if (currentCase?.id) {
            localStorage.setItem('acc_current_case_id', currentCase.id);
        }
    }, [currentCase]);

    const addCase = (newCase: Case) => {
        setCases((prev) => [newCase, ...prev]);
        // default to newly created case
        setCurrentCase(newCase);
    };

    return (
        <AppContext.Provider value={{ cases, currentCase, setCurrentCase, addCase }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
