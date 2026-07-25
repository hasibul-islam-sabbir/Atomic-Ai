import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Habit, ScorecardRoutineItem, LawFocus, AppSettings } from '../types';
import { TodayChecklist } from './tracking/TodayChecklist';
import { HeatmapTracker } from './tracking/HeatmapTracker';
import { HabitListScreen } from './habit/HabitListScreen';
import { BadHabitListScreen } from './habit/BadHabitListScreen';
import { UrgeTimerModal } from './habit/UrgeTimerModal';
import { MentorChatScreen } from './mentor/MentorChatScreen';
import { WeeklyReflectionScreen } from './reflection/WeeklyReflectionScreen';
import { SettingsScreen } from './settings/SettingsScreen';
import { TabType } from './navigation/BottomNavigation';
import { storage } from '../db/storage';
import {
  Sparkles,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Flame,
  CheckSquare,
  BarChart2,
  SlidersHorizontal,
  Bot,
  Lightbulb,
  ArrowRight,
  Calendar,
  Settings,
} from 'lucide-react';

interface HomeScreenPlaceholderProps {
  user: User | null;
  habits: Habit[];
  scorecard: ScorecardRoutineItem[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAlarmModal: () => void;
  onResetOnboarding: () => void;
  onSaveHabit: (habitData: {
    id?: number;
    name: string;
    stackAnchor: string;
    twoMinuteVersion: string;
    environmentCue: string;
    lawFocus: LawFocus;
  }) => void;
  onSaveBadHabit: (badHabitData: {
    id?: number;
    name: string;
    frictionPlan: string;
    cravingRedirect: string;
    accountabilityNote: string;
  }) => void;
  onDeleteHabit: (id: number) => void;
  onSettingsChanged?: (settings: AppSettings) => void;
}

export const HomeScreenPlaceholder: React.FC<HomeScreenPlaceholderProps> = ({
  user,
  habits,
  scorecard,
  activeTab,
  onTabChange,
  onOpenAlarmModal,
  onResetOnboarding,
  onSaveHabit,
  onSaveBadHabit,
  onDeleteHabit,
  onSettingsChanged,
}) => {
  const [habitSubTab, setHabitSubTab] = useState<'BUILD' | 'BREAK'>('BUILD');
  const [isUrgeModalOpen, setIsUrgeModalOpen] = useState(false);
  const [detectedPattern, setDetectedPattern] = useState<string | null>(null);

  const badHabits = habits.filter((h) => h.type === 'BREAK');

  // Load detected pattern on mount or tab change
  useEffect(() => {
    const pattern = storage.getDetectedPattern();
    if (pattern) {
      setDetectedPattern(pattern);
    }
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto px-4 py-4 flex flex-col min-h-[85vh] space-y-5 relative pb-20"
    >
      {/* Top AI Detected Pattern Insight Banner */}
      {detectedPattern && activeTab === 'HOME' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/20 via-[#173834] to-[#173834] border border-amber-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Lightbulb className="w-4 h-4 fill-amber-400/20" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                🔍 AI Pattern Insight (সাপ্তাহিক ইনসাইট)
              </span>
              <p className="text-xs text-[#F0F7F5] font-medium mt-0.5">
                "{detectedPattern}"
              </p>
            </div>
          </div>

          <button
            onClick={() => onTabChange('MENTOR')}
            className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-[#0F2623] text-xs font-bold rounded-xl flex items-center gap-1 shrink-0 transition-all active:scale-95 shadow-sm"
          >
            <span>মেন্টর চ্যাট</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Main Tab Views */}
      {activeTab === 'HOME' && (
        <div className="space-y-5">
          {/* Top Quick Actions Bar */}
          <div className="flex items-center justify-between gap-2 bg-[#173834] p-2 rounded-2xl border border-[#2B5852]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHabitSubTab('BUILD')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  habitSubTab === 'BUILD'
                    ? 'bg-[#2DD4BF] text-[#0F2623]'
                    : 'text-[#A3C2BB] hover:text-[#F0F7F5]'
                }`}
              >
                আজকের অভ্যাস
              </button>
              <button
                onClick={() => setHabitSubTab('BREAK')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  habitSubTab === 'BREAK'
                    ? 'bg-amber-400 text-[#0F2623]'
                    : 'text-[#A3C2BB] hover:text-[#F0F7F5]'
                }`}
              >
                বদঅভ্যাস রোধ
              </button>
            </div>

            <button
              onClick={() => setIsUrgeModalOpen(true)}
              className="py-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-400 text-[#0F2623] font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 fill-[#0F2623]" />
              <span>⚡ Urge Surfing</span>
            </button>
          </div>

          {habitSubTab === 'BUILD' ? (
            <TodayChecklist
              habits={habits}
              onOpenUrgeModal={() => setIsUrgeModalOpen(true)}
            />
          ) : (
            <BadHabitListScreen
              habits={habits}
              onSaveBadHabit={onSaveBadHabit}
              onDeleteHabit={onDeleteHabit}
            />
          )}

          {/* Quick Habit Add Drawer Link */}
          <div className="pt-2 border-t border-[#2B5852]/60 flex items-center justify-between">
            <span className="text-xs text-[#A3C2BB]">অভ্যাস তালিকা এডিট বা নতুন যোগ করতে চান?</span>
            <button
              onClick={() => onTabChange('SETTINGS')}
              className="text-xs font-bold text-[#2DD4BF] hover:underline"
            >
              সেটিংস ও এলার্ম ম্যানেজমেন্ট →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'TRACKER' && <HeatmapTracker habits={habits} />}

      {activeTab === 'MENTOR' && (
        <MentorChatScreen
          user={user}
          habits={habits}
          onPatternUpdated={(pattern) => setDetectedPattern(pattern)}
        />
      )}

      {activeTab === 'REFLECTION' && (
        <WeeklyReflectionScreen user={user} habits={habits} />
      )}

      {activeTab === 'SETTINGS' && (
        <div className="space-y-6">
          <SettingsScreen
            user={user}
            onOpenAlarmModal={onOpenAlarmModal}
            onResetOnboarding={onResetOnboarding}
            onSettingsChanged={onSettingsChanged}
          />

          {/* Habit Management inside Settings */}
          <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 space-y-4">
            <h3 className="font-heading text-lg font-bold text-[#F0F7F5] border-b border-[#2B5852]/80 pb-2">
              অভ্যাস কনফিগারেশন (Manage Habits)
            </h3>
            <HabitListScreen
              habits={habits}
              onSaveHabit={onSaveHabit}
              onDeleteHabit={onDeleteHabit}
            />
          </div>
        </div>
      )}

      {/* Global Urge Surfing Timer Modal */}
      <UrgeTimerModal
        isOpen={isUrgeModalOpen}
        onClose={() => setIsUrgeModalOpen(false)}
        badHabits={badHabits}
        onOpenAddBadHabit={() => {
          onTabChange('HOME');
          setHabitSubTab('BREAK');
        }}
      />
    </motion.div>
  );
};
