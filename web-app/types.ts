
export enum Intent {
  LEARNING = 'learning',
  RESEARCH = 'research',
  SHOPPING = 'shopping',
  WORK = 'work',
  ENTERTAINMENT = 'entertainment'
}

export interface User {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  autoDetectSessions: boolean;
  proactiveSuggestions: boolean;
  importanceThreshold: number;
}

export interface UserStats {
  totalMemories: number;
  newThisWeek: number;
  averageImportance: number;
  topCategory: string;
}

export interface Memory {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  summary: string;
  userNotes?: string;
  importance: number;
  tags: string[];
  intent: Intent;
  capturedAt: string;
  similarity?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Memory[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
