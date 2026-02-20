export interface GameState {
  time: string;
  location: string;
  atmosphere: string;
  targets: TargetProfile[];
  player: PlayerProfile;
  narrative: LogEntry[];
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'narrative' | 'system' | 'dialogue';
  timestamp: string;
}

export interface TargetProfile {
  name: string;
  occupation: string;
  difficulty: 'S' | 'A' | 'B' | 'C' | 'D';
  relationship: string;
  surfaceEmotion: string;
  resistanceIndex: number; // 0-100
  submissionLevel: number; // -100 to 100
  affection: number; // 0-100
  fetishes: string[];
  partnerStatus: string; // "None" or details
  tempStatus: string[];
  permStatus: string[];
  isPregnant: boolean;
  avatarUrl?: string;
}

export interface PlayerProfile {
  name: string;
  identity: string;
  gender: string;
  level: 'S' | 'A' | 'B' | 'C' | 'D';
  xp: number;
  maxXp: number;
  currentTask: string;
  points: number;
  items: string[];
  tempBuffs: string[];
  permTraits: string[];
}

export interface ActionOption {
  id: string;
  label: string;
  icon?: unknown;
  cost?: number;
  type: 'interaction' | 'move' | 'item' | 'system';
  description?: string;
}
