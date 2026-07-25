export type HabitType = 'BUILD' | 'BREAK';

export type LawFocus =
  | 'OBVIOUS'
  | 'ATTRACTIVE'
  | 'EASY'
  | 'SATISFYING'
  | 'INVISIBLE'
  | 'UNATTRACTIVE'
  | 'DIFFICULT'
  | 'UNSATISFYING';

export type CheckInStatus = 'DONE' | 'MISSED' | 'PARTIAL';

export type ConversationType = 'DAILY' | 'WEEKLY';

export type MessageSender = 'USER' | 'AI';

export interface Message {
  sender: MessageSender;
  text: string;
  timestamp: number;
}

export interface User {
  id: number;
  identityStatements: string[];
  createdAt: number;
}

export interface Habit {
  id: number;
  name: string;
  type: HabitType;
  stackAnchor?: string | null;
  twoMinuteVersion?: string;
  environmentCue?: string;
  lawFocus?: LawFocus;
  frictionPlan?: string;
  cravingRedirect?: string;
  accountabilityNote?: string;
}

export interface CheckIn {
  id: number;
  habitId: number;
  date: string; // YYYY-MM-DD
  status: CheckInStatus;
  note: String | null;
}

export interface MentorConversation {
  id: number;
  date: string;
  type: ConversationType;
  messages: Message[];
  detectedPattern: string | null;
}

export interface Reflection {
  id: number;
  weekStartDate: string; // YYYY-MM-DD
  summary: string;
  aiInsight: string;
  monthlyIdentityCheckDone?: boolean;
  identityCheckResponse?: string;
  identityCheckDate?: string;
}

export type ThemeMode = 'Wisemind' | 'Sagegrove' | 'Nightscholar' | 'Claymind';

export interface AppSettings {
  theme: ThemeMode;
  language: 'BN' | 'EN';
  focusModeActive: boolean;
  cueRemindersEnabled: boolean;
  distractionBlockerEnabled: boolean;
}

export interface SmartAlarm {
  id: number;
  time: string; // "06:30"
  label: string;
  enabled: boolean;
  microActionType: 'BREATHING' | 'STRETCH' | 'IDENTITY_TYPING';
  habitIdToTrigger?: number;
}

export interface ScorecardRoutineItem {
  id: string;
  title: string;
  rating: '+' | '-' | '=' | null;
}
