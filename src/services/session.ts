import { PlayerSlot } from '../types/game';

export interface SavedSession {
  roomCode: string;
  playerId: string;
  playerSlot: PlayerSlot;
  playerName: string;
}

const STORAGE_KEY = 'mashaer_active_session';

export function saveSession(session: SavedSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Local storage quota or disabled
  }
}

export function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
