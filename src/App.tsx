import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { IdentityScreen } from './components/onboarding/IdentityScreen';
import { HabitScorecardScreen } from './components/onboarding/HabitScorecardScreen';
import { BadHabitSelectionScreen } from './components/onboarding/BadHabitSelectionScreen';
import { HomeScreenPlaceholder } from './components/HomeScreenPlaceholder';
import { BottomNavigation, TabType } from './components/navigation/BottomNavigation';
import { SmartAlarmModal } from './components/alarm/SmartAlarmModal';
import { storage } from './db/storage';
import { User, Habit, ScorecardRoutineItem, LawFocus, AppSettings, ThemeMode } from './types';
import { Flame, Sparkles, RefreshCw, Bell, Settings } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [identityStatements, setIdentityStatements] = useState<string[]>([]);
  const [scorecard, setScorecard] = useState<ScorecardRoutineItem[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // App Navigation & Modals
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState<boolean>(false);
  const [isGlobalUrgeOpen, setIsGlobalUrgeOpen] = useState<boolean>(false);

  // App Settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'Wisemind',
    language: 'BN',
    focusModeActive: false,
    cueRemindersEnabled: true,
    distractionBlockerEnabled: true,
  });

  // Load existing data or check onboarding state
  useEffect(() => {
    const completed = storage.isOnboardingComplete();
    setIsCompleted(completed);
    setSettings(storage.getSettings());

    if (completed) {
      setUser(storage.getUser());
      setHabits(storage.getHabits());
      setScorecard(storage.getScorecard());
    } else {
      setScorecard(storage.getScorecard());
    }
  }, []);

  // Theme styling map
  const themeClassMap: Record<ThemeMode, { bg: string; text: string; headerBg: string; accent: string }> = {
    Wisemind: {
      bg: 'bg-[#0F2623]',
      text: 'text-[#E8F1EF]',
      headerBg: 'bg-[#0B1E1C]/90',
      accent: '#2DD4BF',
    },
    Sagegrove: {
      bg: 'bg-[#13231D]',
      text: 'text-[#E2F1EB]',
      headerBg: 'bg-[#0B1814]/90',
      accent: '#34D399',
    },
    Nightscholar: {
      bg: 'bg-[#090D16]',
      text: 'text-[#E0E8F6]',
      headerBg: 'bg-[#05080E]/90',
      accent: '#38BDF8',
    },
    Claymind: {
      bg: 'bg-[#1C120F]',
      text: 'text-[#F5ECE8]',
      headerBg: 'bg-[#120B09]/90',
      accent: '#F97316',
    },
  };

  const currentTheme = themeClassMap[settings.theme] || themeClassMap.Wisemind;

  // Handler Step 1 -> Step 2
  const handleIdentityNext = (statements: string[]) => {
    setIdentityStatements(statements);
    setStep(2);
  };

  // Handler Step 2 -> Step 3
  const handleScorecardNext = (updatedScorecard: ScorecardRoutineItem[]) => {
    setScorecard(updatedScorecard);
    setStep(3);
  };

  // Handler Step 3 -> Complete & Save to DB
  const handleFinishOnboarding = (badHabits: string[]) => {
    setIsSubmitting(true);

    try {
      const savedUser = storage.saveUser(identityStatements);
      storage.saveScorecard(scorecard);
      storage.saveBadHabits(badHabits);
      storage.setOnboardingComplete(true);

      setUser(savedUser);
      setHabits(storage.getHabits());
      setIsCompleted(true);
      setActiveTab('HOME');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Habit CRUD Handlers
  const handleSaveHabit = (habitData: {
    id?: number;
    name: string;
    stackAnchor: string;
    twoMinuteVersion: string;
    environmentCue: string;
    lawFocus: LawFocus;
  }) => {
    if (habitData.id) {
      storage.updateHabit({
        id: habitData.id,
        name: habitData.name,
        type: 'BUILD',
        stackAnchor: habitData.stackAnchor,
        twoMinuteVersion: habitData.twoMinuteVersion,
        environmentCue: habitData.environmentCue,
        lawFocus: habitData.lawFocus,
      });
    } else {
      storage.saveHabit({
        name: habitData.name,
        type: 'BUILD',
        stackAnchor: habitData.stackAnchor,
        twoMinuteVersion: habitData.twoMinuteVersion,
        environmentCue: habitData.environmentCue,
        lawFocus: habitData.lawFocus,
      });
    }
    setHabits(storage.getHabits());
  };

  const handleSaveBadHabit = (badHabitData: {
    id?: number;
    name: string;
    frictionPlan: string;
    cravingRedirect: string;
    accountabilityNote: string;
  }) => {
    if (badHabitData.id) {
      storage.updateHabit({
        id: badHabitData.id,
        name: badHabitData.name,
        type: 'BREAK',
        frictionPlan: badHabitData.frictionPlan,
        cravingRedirect: badHabitData.cravingRedirect,
        accountabilityNote: badHabitData.accountabilityNote,
        lawFocus: 'INVISIBLE',
      });
    } else {
      storage.saveHabit({
        name: badHabitData.name,
        type: 'BREAK',
        frictionPlan: badHabitData.frictionPlan,
        cravingRedirect: badHabitData.cravingRedirect,
        accountabilityNote: badHabitData.accountabilityNote,
        lawFocus: 'INVISIBLE',
      });
    }
    setHabits(storage.getHabits());
  };

  const handleDeleteHabit = (id: number) => {
    storage.deleteHabit(id);
    setHabits(storage.getHabits());
  };

  // Reset Onboarding Flow
  const handleReset = () => {
    storage.resetOnboardingData();
    setIsCompleted(false);
    setStep(1);
    setIdentityStatements([]);
    setScorecard(storage.getScorecard());
    setUser(null);
    setHabits([]);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} font-body flex flex-col justify-between transition-colors duration-300`}>
      {/* Top Header Bar */}
      <header className={`border-b border-white/10 ${currentTheme.headerBg} backdrop-blur-md sticky top-0 z-50`}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            onClick={() => isCompleted && setActiveTab('HOME')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2DD4BF] to-[#10B981] flex items-center justify-center text-[#0F2623] font-black shadow-md shadow-[#2DD4BF]/20">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-[#F0F7F5] tracking-wide block leading-none">
                Atomic<span className="text-[#2DD4BF]">AI</span>
              </span>
              <span className="text-[10px] text-[#A3C2BB] font-medium tracking-wider uppercase block">
                Atomic Habits System
              </span>
            </div>
          </div>

          {!isCompleted && (
            <div className="flex items-center gap-1.5 text-xs text-[#A3C2BB] bg-[#173834] px-3 py-1 rounded-full border border-[#2B5852]">
              <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>ধাপ {step}/৩</span>
            </div>
          )}

          {isCompleted && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAlarmModalOpen(true)}
                className="p-2 bg-[#173834] hover:bg-[#23504B] text-[#2DD4BF] rounded-xl border border-[#2B5852] transition-colors relative"
                title="Smart Alarm Settings"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              </button>

              <button
                onClick={() => setActiveTab('SETTINGS')}
                className="p-2 bg-[#173834] hover:bg-[#23504B] text-[#A3C2BB] hover:text-[#F0F7F5] rounded-xl border border-[#2B5852] transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Onboarding Progress Line */}
        {!isCompleted && (
          <div className="w-full bg-[#173834] h-1">
            <div
              className="bg-gradient-to-r from-[#2DD4BF] to-[#10B981] h-1 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center pb-16">
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <HomeScreenPlaceholder
              key="home"
              user={user}
              habits={habits}
              scorecard={scorecard}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenAlarmModal={() => setIsAlarmModalOpen(true)}
              onResetOnboarding={handleReset}
              onSaveHabit={handleSaveHabit}
              onSaveBadHabit={handleSaveBadHabit}
              onDeleteHabit={handleDeleteHabit}
              onSettingsChanged={setSettings}
            />
          ) : step === 1 ? (
            <IdentityScreen
              key="step1"
              initialStatements={identityStatements}
              onNext={handleIdentityNext}
            />
          ) : step === 2 ? (
            <HabitScorecardScreen
              key="step2"
              scorecard={scorecard}
              onNext={handleScorecardNext}
              onBack={() => setStep(1)}
            />
          ) : (
            <BadHabitSelectionScreen
              key="step3"
              onFinish={handleFinishOnboarding}
              onBack={() => setStep(2)}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Unified Bottom Navigation (when onboarding complete) */}
      {isCompleted && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenUrgeModal={() => setIsGlobalUrgeOpen(true)}
        />
      )}

      {/* Smart Alarm Modal */}
      <SmartAlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        user={user}
      />
    </div>
  );
}
