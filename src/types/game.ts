export type PlayerSlot = 'p1' | 'p2';

export interface Player {
  id: string;
  name: string;
  slot: PlayerSlot;
  connected: boolean;
  lastActive: number;
}

export type SceneType = 
  | 'narrative' 
  | 'choice' 
  | 'riddle' 
  | 'prediction' 
  | 'asymmetric' 
  | 'reflection' 
  | 'secret_letter' 
  | 'grand_puzzle' 
  | 'ending';

export interface SceneOption {
  id: string;
  label: string;
  sublabel?: string;
  tag?: string;
  theme?: 'adventure' | 'heart' | 'secrets';
}

export interface AsymmetricInfo {
  p1Clue: string;
  p2Clue: string;
  solution: string;
  hint: string;
}

export interface Scene {
  id: string;
  chapterId: number;
  order: number;
  title: string;
  subtitle: string;
  backgroundMood: 'night' | 'library' | 'city' | 'garden' | 'sanctum';
  narrativeText: string[];
  type: SceneType;
  promptText: string;
  p1Prompt?: string;
  p2Prompt?: string;
  options?: SceneOption[];
  allowCustomAnswer?: boolean;
  isOptional?: boolean;
  puzzleAnswer?: string | string[];
  puzzleHint?: string;
  asymmetric?: AsymmetricInfo;
  revealDialogue: {
    bothSame?: string;
    divergent?: string;
    general: string;
  };
  rewardClueId?: string;
  rewardAchievementId?: string;
  points: number;
  nextSceneId?: string;
}

export interface Chapter {
  id: number;
  numberArabic: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  sceneIds: string[];
}

export interface InventoryItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  chapter: number;
  discoveredAt?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: number;
}

export interface PrivateLetter {
  id: string;
  senderSlot: PlayerSlot;
  senderName: string;
  content: string;
  createdAt: number;
  revealed: boolean;
}

export interface RoomAnswer {
  sceneId: string;
  p1Answer: string | null;
  p2Answer: string | null;
  p1Submitted: boolean;
  p2Submitted: boolean;
  p1SubmittedAt: number | null;
  p2SubmittedAt: number | null;
  status: 'waiting' | 'revealed';
  narrativeReaction?: string;
  pointsAwarded?: number;
}

export interface RoomState {
  roomId: string;
  roomCode: string;
  createdAt: number;
  updatedAt: number;
  currentChapterId: number;
  currentSceneId: string;
  status: 'waiting_for_partner' | 'ready' | 'in_scene' | 'scene_revealed' | 'chapter_completed' | 'game_finished';
  endingType?: 'adventurers' | 'heart_mind' | 'little_secrets';
  players: {
    p1: Player | null;
    p2: Player | null;
  };
  answers: Record<string, RoomAnswer>;
  inventory: InventoryItem[];
  achievements: Achievement[];
  messages: PrivateLetter[];
  decisions: Record<string, string>;
  points: number;
}

export type SafeRoomState = Omit<RoomState, 'answers'> & {
  answers: Record<string, {
    sceneId: string;
    p1Submitted: boolean;
    p2Submitted: boolean;
    p1Answer: string | null;
    p2Answer: string | null;
    status: 'waiting' | 'revealed';
    narrativeReaction?: string;
    pointsAwarded?: number;
  }>;
  mySlot: PlayerSlot | null;
  myName: string | null;
  partnerName: string | null;
  partnerConnected: boolean;
};
