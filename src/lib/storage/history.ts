/**
 * ARCANA — Reading History Storage Abstraction
 * Persists user readings locally with versioned JSON storage.
 */

import { ReadingSessionRecord } from "@/types/reading";

const HISTORY_STORAGE_KEY = "arcana_readings_history_v1";
const MAX_SAVED_READINGS = 50;

export interface StorageAdapter {
  getReadings(): ReadingSessionRecord[];
  getReading(id: string): ReadingSessionRecord | null;
  saveReading(record: ReadingSessionRecord): void;
  deleteReading(id: string): void;
  clearHistory(): void;
}

class LocalStorageAdapter implements StorageAdapter {
  private isAvailable(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  getReadings(): ReadingSessionRecord[] {
    if (!this.isAvailable()) return [];
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (e) {
      console.error("[Storage Error] Failed to read readings history", e);
      return [];
    }
  }

  getReading(id: string): ReadingSessionRecord | null {
    const list = this.getReadings();
    return list.find((item) => item.readingId === id) || null;
  }

  saveReading(record: ReadingSessionRecord): void {
    if (!this.isAvailable()) return;
    try {
      const list = this.getReadings();
      // Avoid duplicate readingId
      const filtered = list.filter((item) => item.readingId !== record.readingId);
      // Prepend newest first
      const updated = [record, ...filtered].slice(0, MAX_SAVED_READINGS);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("[Storage Error] Failed to save reading", e);
    }
  }

  deleteReading(id: string): void {
    if (!this.isAvailable()) return;
    try {
      const list = this.getReadings();
      const updated = list.filter((item) => item.readingId !== id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("[Storage Error] Failed to delete reading", e);
    }
  }

  clearHistory(): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error("[Storage Error] Failed to clear history", e);
    }
  }
}

export const historyStorage: StorageAdapter = new LocalStorageAdapter();
