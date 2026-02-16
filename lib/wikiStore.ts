'use client';

import { WikiEntry, DEFAULT_WIKI_ENTRIES } from './wikiData';

const STORAGE_KEY = 'legal-wiki-entries';
const VERSION_KEY = 'legal-wiki-version';
const CURRENT_VERSION = '2';

export function getWikiEntries(): WikiEntry[] {
  if (typeof window === 'undefined') return DEFAULT_WIKI_ENTRIES;
  try {
    const version = localStorage.getItem(VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || version !== CURRENT_VERSION) {
      // First load or version upgrade — seed with defaults
      saveWikiEntries(DEFAULT_WIKI_ENTRIES);
      return DEFAULT_WIKI_ENTRIES;
    }
    return JSON.parse(stored) as WikiEntry[];
  } catch {
    return DEFAULT_WIKI_ENTRIES;
  }
}

export function saveWikiEntries(entries: WikiEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch (err) {
    console.error('Failed to save wiki entries:', err);
  }
}

export function getWikiEntry(slug: string): WikiEntry | undefined {
  return getWikiEntries().find(e => e.slug === slug);
}

export function saveWikiEntry(entry: WikiEntry): void {
  const entries = getWikiEntries();
  const idx = entries.findIndex(e => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.unshift(entry);
  }
  saveWikiEntries(entries);
}

export function deleteWikiEntry(id: string): void {
  const entries = getWikiEntries().filter(e => e.id !== id);
  saveWikiEntries(entries);
}

export function exportWikiJSON(): string {
  return JSON.stringify(getWikiEntries(), null, 2);
}

export function importWikiJSON(json: string): WikiEntry[] {
  const entries = JSON.parse(json) as WikiEntry[];
  saveWikiEntries(entries);
  return entries;
}

export function searchWikiEntries(query: string, category?: string): WikiEntry[] {
  const entries = getWikiEntries();
  const q = query.toLowerCase();
  return entries.filter(entry => {
    const matchesCat = !category || category === 'all' || entry.category === category;
    if (!matchesCat) return false;
    if (!q) return true;
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q) ||
      entry.citations.some(c => c.toLowerCase().includes(q)) ||
      entry.category.toLowerCase().includes(q)
    );
  });
}

export function resetWikiToDefaults(): void {
  saveWikiEntries(DEFAULT_WIKI_ENTRIES);
}
