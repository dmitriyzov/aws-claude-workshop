import { useState, useCallback } from 'react';
import type { LeaderboardEntry } from '../types/game';

const STORAGE_KEY = '2048-leaderboard';
const MAX_ENTRIES = 10;

const loadEntries = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
};

const persistEntries = (entries: LeaderboardEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore storage errors (e.g. private browsing quota)
  }
};

/**
 * Hook for managing the game leaderboard backed by localStorage.
 * Keeps the top MAX_ENTRIES scores sorted descending.
 */
export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(loadEntries);

  const saveScore = useCallback((score: number) => {
    if (score <= 0) return;

    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      score,
      date: new Date().toLocaleDateString(),
    };

    setEntries((prev) => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES);
      persistEntries(updated);
      return updated;
    });
  }, []);

  const clearLeaderboard = useCallback(() => {
    persistEntries([]);
    setEntries([]);
  }, []);

  return { entries, saveScore, clearLeaderboard };
};
