import { User, Habit, HabitType, LawFocus, ScorecardRoutineItem, CheckIn, CheckInStatus, MentorConversation, Reflection, AppSettings, SmartAlarm } from '../types';

const STORAGE_KEYS = {
  USER: 'atomicai_user',
  HABITS: 'atomicai_habits',
  SCORECARD: 'atomicai_scorecard',
  ONBOARDING_COMPLETE: 'atomicai_onboarding_complete',
  CHECKINS: 'atomicai_checkins',
  CONVERSATIONS: 'atomicai_conversations',
  DETECTED_PATTERN: 'atomicai_detected_pattern',
  REFLECTIONS: 'atomicai_reflections',
  SETTINGS: 'atomicai_settings',
  ALARMS: 'atomicai_alarms',
};

export const defaultPresetRoutines: ScorecardRoutineItem[] = [
  { id: '1', title: 'সকালে নির্দিষ্ট সময়ে ঘুম থেকে ওঠা', rating: null },
  { id: '2', title: 'বিছানায় শুয়ে ১ ঘণ্টা ফোন চেক করা', rating: null },
  { id: '3', title: 'এক গ্লাস বিশুদ্ধ পানি পান করা', rating: null },
  { id: '4', title: 'পুষ্টিকর প্রাতরাশ/নাস্তা করা', rating: null },
  { id: '5', title: '১৫ মিনিট ব্যায়াম বা মেডিটেশন', rating: null },
  { id: '6', title: 'কাজে বসার আগে সোশ্যাল মিডিয়া স্ক্রোলিং', rating: null },
  { id: '7', title: 'দিনের গুরুত্বপূর্ণ ৩টি কাজের পরিকল্পনা করা', rating: null },
  { id: '8', title: 'অতিরিক্ত চা বা কফি পান করা', rating: null },
  { id: '9', title: 'রাত জেগে ভিডিও দেখা বা গেম খেলা', rating: null },
  { id: '10', title: 'ঠিক সময়ে রাতে ঘুমাতে যাওয়া', rating: null },
];

export const storage = {
  getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveUser(identityStatements: string[]): User {
    const newUser: User = {
      id: Date.now(),
      identityStatements,
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  },

  getHabits(): Habit[] {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!data) return [];
    try {
      const habits: Habit[] = JSON.parse(data);
      const seenIds = new Set<number>();
      let modified = false;
      let maxId = habits.reduce((max, h) => (h.id && typeof h.id === 'number' ? Math.max(max, h.id) : max), 0);

      const deduplicated = habits.map((h) => {
        if (!h.id || seenIds.has(h.id)) {
          maxId += 1;
          modified = true;
          return { ...h, id: maxId };
        }
        seenIds.add(h.id);
        return h;
      });

      if (modified) {
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(deduplicated));
      }
      return deduplicated;
    } catch {
      return [];
    }
  },

  saveHabit(habit: Omit<Habit, 'id'>): Habit {
    const habits = this.getHabits();
    const maxId = habits.reduce((max, h) => (h.id && typeof h.id === 'number' ? Math.max(max, h.id) : max), 0);
    const newHabit: Habit = {
      ...habit,
      id: Math.max(Date.now(), maxId + 1),
    };
    habits.push(newHabit);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    return newHabit;
  },

  updateHabit(habit: Habit): void {
    const habits = this.getHabits();
    const updated = habits.map((h) => (h.id === habit.id ? habit : h));
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(updated));
  },

  deleteHabit(id: number): void {
    const habits = this.getHabits();
    const filtered = habits.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(filtered));
  },

  saveBadHabits(badHabitNames: string[]): Habit[] {
    const saved: Habit[] = [];
    badHabitNames.forEach((name) => {
      if (name.trim()) {
        const habit = this.saveHabit({
          name: name.trim(),
          type: 'BREAK',
          stackAnchor: null,
          twoMinuteVersion: '১ মিনিট সচেতন থাকা',
          environmentCue: 'অনুভূতির দিকে খেয়াল রাখা',
          lawFocus: 'INVISIBLE',
        });
        saved.push(habit);
      }
    });
    return saved;
  },

  saveScorecard(scorecard: ScorecardRoutineItem[]): void {
    localStorage.setItem(STORAGE_KEYS.SCORECARD, JSON.stringify(scorecard));

    // Convert negative rated routines into bad habits automatically or save scorecard
    scorecard.forEach((item) => {
      if (item.rating === '-') {
        // check if already saved
        const habits = this.getHabits();
        if (!habits.some((h) => h.name === item.title)) {
          this.saveHabit({
            name: item.title,
            type: 'BREAK',
            stackAnchor: null,
            twoMinuteVersion: '১ মিনিটের জন্য বিরতি নেওয়া',
            environmentCue: 'ট্রিগার চেনা',
            lawFocus: 'INVISIBLE',
          });
        }
      }
    });
  },

  getScorecard(): ScorecardRoutineItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.SCORECARD);
    return data ? JSON.parse(data) : defaultPresetRoutines;
  },

  isOnboardingComplete(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
  },

  setOnboardingComplete(complete: boolean): void {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete ? 'true' : 'false');
  },

  resetOnboardingData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.SCORECARD);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    localStorage.removeItem(STORAGE_KEYS.CHECKINS);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.DETECTED_PATTERN);
  },

  getTodayDateStr(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getYesterdayDateStr(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getLast30DaysDates(): string[] {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  },

  getCheckIns(): CheckIn[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    if (!data) return [];
    try {
      const checkIns: CheckIn[] = JSON.parse(data);
      const seenIds = new Set<number>();
      let modified = false;
      let maxId = checkIns.reduce((max, c) => (c.id && typeof c.id === 'number' ? Math.max(max, c.id) : max), 0);

      const deduplicated = checkIns.map((c) => {
        if (!c.id || seenIds.has(c.id)) {
          maxId += 1;
          modified = true;
          return { ...c, id: maxId };
        }
        seenIds.add(c.id);
        return c;
      });

      if (modified) {
        localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(deduplicated));
      }
      return deduplicated;
    } catch {
      return [];
    }
  },

  getCheckInsForHabit(habitId: number): CheckIn[] {
    const all = this.getCheckIns();
    return all.filter((c) => c.habitId === habitId);
  },

  saveCheckIn(habitId: number, date: string, status: CheckInStatus, note: string | null = null): CheckIn {
    const checkIns = this.getCheckIns();
    const existingIndex = checkIns.findIndex((c) => c.habitId === habitId && c.date === date);

    let updatedCheckIn: CheckIn;
    if (existingIndex >= 0) {
      updatedCheckIn = {
        ...checkIns[existingIndex],
        status,
        note: note || checkIns[existingIndex].note,
      };
      checkIns[existingIndex] = updatedCheckIn;
    } else {
      const maxId = checkIns.reduce((max, c) => (c.id && typeof c.id === 'number' ? Math.max(max, c.id) : max), 0);
      updatedCheckIn = {
        id: Math.max(Date.now(), maxId + 1),
        habitId,
        date,
        status,
        note,
      };
      checkIns.push(updatedCheckIn);
    }

    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkIns));
    return updatedCheckIn;
  },

  wasYesterdayMissed(habitId: number): boolean {
    const yesterday = this.getYesterdayDateStr();
    const checkIns = this.getCheckInsForHabit(habitId);
    const yesterdayCheckIn = checkIns.find((c) => c.date === yesterday);
    return yesterdayCheckIn ? yesterdayCheckIn.status === 'MISSED' : false;
  },

  calculateStreak(habitId: number): { currentStreak: number; longestStreak: number } {
    const checkIns = this.getCheckInsForHabit(habitId);
    if (checkIns.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // Sort check-ins by date ascending
    const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
    
    // Map of date -> status
    const dateMap = new Map<string, CheckInStatus>();
    sorted.forEach((c) => dateMap.set(c.date, c.status));

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;

    // Iterate through sorted records
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].status === 'DONE') {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else if (sorted[i].status === 'MISSED') {
        tempStreak = 0;
      }
    }

    // Calculate current streak backwards from today or yesterday
    const todayStr = this.getTodayDateStr();
    const yesterdayStr = this.getYesterdayDateStr();

    let currentStreak = 0;
    let checkDate = new Date();

    // If today is DONE, start from today. If today is not done yet, start checking from yesterday
    const todayStatus = dateMap.get(todayStr);
    if (todayStatus === 'DONE') {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (todayStatus === 'MISSED') {
      currentStreak = 0;
    } else {
      // Not checked in today yet, check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    if (todayStatus !== 'MISSED') {
      while (true) {
        const year = checkDate.getFullYear();
        const month = String(checkDate.getMonth() + 1).padStart(2, '0');
        const day = String(checkDate.getDate()).padStart(2, '0');
        const dStr = `${year}-${month}-${day}`;

        const status = dateMap.get(dStr);
        if (status === 'DONE') {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
    };
  },

  getMentorConversations(): MentorConversation[] {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  },

  getMentorConversationForDate(date: string): MentorConversation | null {
    const conversations = this.getMentorConversations();
    return conversations.find((c) => c.date === date) || null;
  },

  saveMentorConversation(conversation: MentorConversation): MentorConversation {
    const conversations = this.getMentorConversations();
    const existingIdx = conversations.findIndex((c) => c.date === conversation.date);

    if (existingIdx >= 0) {
      conversations[existingIdx] = conversation;
    } else {
      conversations.push(conversation);
    }

    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    return conversation;
  },

  getDetectedPattern(): string | null {
    return localStorage.getItem(STORAGE_KEYS.DETECTED_PATTERN) || null;
  },

  saveDetectedPattern(pattern: string): void {
    localStorage.setItem(STORAGE_KEYS.DETECTED_PATTERN, pattern);
  },

  getReflections(): Reflection[] {
    const data = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    return data ? JSON.parse(data) : [];
  },

  saveReflection(reflection: Reflection): Reflection {
    const reflections = this.getReflections();
    const idx = reflections.findIndex((r) => r.id === reflection.id || r.weekStartDate === reflection.weekStartDate);
    if (idx >= 0) {
      reflections[idx] = reflection;
    } else {
      reflections.push(reflection);
    }
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflections));
    return reflection;
  },

  getSettings(): AppSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
    const defaultSettings: AppSettings = {
      theme: 'Wisemind',
      language: 'BN',
      focusModeActive: false,
      cueRemindersEnabled: true,
      distractionBlockerEnabled: true,
    };
    return defaultSettings;
  },

  saveSettings(settings: AppSettings): AppSettings {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  },

  getAlarms(): SmartAlarm[] {
    const data = localStorage.getItem(STORAGE_KEYS.ALARMS);
    if (data) {
      return JSON.parse(data);
    }
    const defaultAlarms: SmartAlarm[] = [
      {
        id: 1,
        time: '06:30',
        label: 'সকালের ২-মিনিট অভ্যাস এলার্ম',
        enabled: true,
        microActionType: 'BREATHING',
      },
      {
        id: 2,
        time: '22:00',
        label: 'রাতের রিফ্লেকশন এলার্ম',
        enabled: false,
        microActionType: 'IDENTITY_TYPING',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ALARMS, JSON.stringify(defaultAlarms));
    return defaultAlarms;
  },

  saveAlarms(alarms: SmartAlarm[]): SmartAlarm[] {
    localStorage.setItem(STORAGE_KEYS.ALARMS, JSON.stringify(alarms));
    return alarms;
  },
};
