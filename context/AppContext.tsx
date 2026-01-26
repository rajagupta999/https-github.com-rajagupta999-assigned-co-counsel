
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
    addCase: (newCase: Case) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [cases, setCases] = useState<Case[]>([]);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedCases = localStorage.getItem('acc_cases');
        if (savedCases) {
            setCases(JSON.parse(savedCases));
        } else {
            // Initialize with mock data if empty
            setCases(mockCases);
        }
    }, []);

    // Sync to LocalStorage
    useEffect(() => {
        if (cases.length > 0) {
            localStorage.setItem('acc_cases', JSON.stringify(cases));
        }
    }, [cases]);

    const addCase = (newCase: Case) => {
        setCases((prev) => [newCase, ...prev]);
    };

    return (
        <AppContext.Provider value={{ cases, addCase }}>
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
