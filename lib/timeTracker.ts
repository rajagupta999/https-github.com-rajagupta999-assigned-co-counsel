// Time tracking with localStorage persistence

export interface TimeEntry {
  id: string;
  caseId?: string;
  caseName?: string;
  description: string;
  startTime: string; // ISO
  endTime?: string; // ISO
  durationMs: number;
  status: 'running' | 'paused' | 'stopped';
  pausedDurationMs: number; // total time spent paused
  pausedAt?: string; // ISO, when last paused
}

const STORAGE_KEY = 'acc_time_entries';
const ACTIVE_KEY = 'acc_time_active';

function getEntries(): TimeEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveEntries(entries: TimeEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getActiveEntry(): TimeEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveActive(entry: TimeEntry | null) {
  if (entry) {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(entry));
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
}

export function startTimer(description: string, caseId?: string, caseName?: string): TimeEntry {
  // Stop any existing timer first
  const existing = getActiveEntry();
  if (existing && existing.status !== 'stopped') {
    stopTimer();
  }

  const entry: TimeEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    caseId,
    caseName,
    description,
    startTime: new Date().toISOString(),
    durationMs: 0,
    status: 'running',
    pausedDurationMs: 0,
  };
  saveActive(entry);
  return entry;
}

export function pauseTimer(): TimeEntry | null {
  const entry = getActiveEntry();
  if (!entry || entry.status !== 'running') return entry;
  entry.status = 'paused';
  entry.pausedAt = new Date().toISOString();
  // Update duration up to now
  entry.durationMs = calcRunningDuration(entry);
  saveActive(entry);
  return entry;
}

export function resumeTimer(): TimeEntry | null {
  const entry = getActiveEntry();
  if (!entry || entry.status !== 'paused') return entry;
  // Add paused duration
  if (entry.pausedAt) {
    entry.pausedDurationMs += Date.now() - new Date(entry.pausedAt).getTime();
    delete entry.pausedAt;
  }
  entry.status = 'running';
  saveActive(entry);
  return entry;
}

export function stopTimer(): TimeEntry | null {
  const entry = getActiveEntry();
  if (!entry) return null;
  
  entry.status = 'stopped';
  entry.endTime = new Date().toISOString();
  entry.durationMs = calcRunningDuration(entry);
  
  // If paused, add remaining pause time
  if (entry.pausedAt) {
    entry.pausedDurationMs += Date.now() - new Date(entry.pausedAt).getTime();
    delete entry.pausedAt;
  }

  // Save to log
  const entries = getEntries();
  entries.unshift(entry);
  saveEntries(entries);
  saveActive(null);
  return entry;
}

export function calcRunningDuration(entry: TimeEntry): number {
  if (entry.status === 'stopped') return entry.durationMs;
  if (entry.status === 'paused') return entry.durationMs;
  // Running: elapsed minus paused time
  const elapsed = Date.now() - new Date(entry.startTime).getTime();
  return elapsed - entry.pausedDurationMs;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatHoursMinutes(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export function getTimeLog(): TimeEntry[] {
  return getEntries();
}

export function deleteTimeEntry(id: string): void {
  const entries = getEntries().filter(e => e.id !== id);
  saveEntries(entries);
}

export function getTodayTotal(): number {
  const today = new Date().toDateString();
  return getEntries()
    .filter(e => new Date(e.startTime).toDateString() === today)
    .reduce((sum, e) => sum + e.durationMs, 0);
}

export function getWeekTotal(): number {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return getEntries()
    .filter(e => new Date(e.startTime) >= weekAgo)
    .reduce((sum, e) => sum + e.durationMs, 0);
}
