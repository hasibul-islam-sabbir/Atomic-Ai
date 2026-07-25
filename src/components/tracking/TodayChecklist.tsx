import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, CheckIn } from '../../types';
import { storage } from '../../db/storage';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Sparkles,
  ShieldAlert,
  Heart,
  RefreshCw,
  Lock,
  Compass,
  Zap,
} from 'lucide-react';

interface TodayChecklistProps {
  habits: Habit[];
  onOpenUrgeModal?: () => void;
}

export const TodayChecklist: React.FC<TodayChecklistProps> = ({
  habits,
  onOpenUrgeModal,
}) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const todayStr = storage.getTodayDateStr();

  // Load checkins
  const refreshCheckIns = () => {
    setCheckIns(storage.getCheckIns());
  };

  useEffect(() => {
    refreshCheckIns();
  }, []);

  const handleCheckIn = (habitId: number, status: 'DONE' | 'MISSED') => {
    storage.saveCheckIn(habitId, todayStr, status);
    refreshCheckIns();
  };

  const getStatusForToday = (habitId: number): 'DONE' | 'MISSED' | null => {
    const found = checkIns.find((c) => c.habitId === habitId && c.date === todayStr);
    return found ? found.status : null;
  };

  // Stats calculation for today
  const totalToday = habits.length;
  const doneToday = habits.filter((h) => getStatusForToday(h.id) === 'DONE').length;
  const missedToday = habits.filter((h) => getStatusForToday(h.id) === 'MISSED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] text-xs font-semibold mb-1 border border-[#2DD4BF]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>দৈনিক ট্র্যাকিং (Daily Checklist)</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F0F7F5]">
            আজকের অভ্যাস চেকলিস্ট
          </h2>
          <p className="font-body text-xs text-[#A3C2BB] mt-0.5">
            ছোট ছোট দৈনিক পদক্ষেপই দীর্ঘমেয়াদী অভ্যাস গড়ে তোলে।
          </p>
        </div>

        {/* Progress Stats Summary */}
        <div className="flex items-center gap-3 w-full md:w-auto bg-[#0F2623] p-3 rounded-xl border border-[#2B5852]/60">
          <div className="text-center px-2">
            <span className="text-xs text-[#A3C2BB] block font-medium">মোট অভ্যাস</span>
            <span className="font-heading text-lg font-bold text-[#F0F7F5]">{totalToday}</span>
          </div>
          <div className="h-8 w-[1px] bg-[#2B5852]" />
          <div className="text-center px-2">
            <span className="text-xs text-[#2DD4BF] block font-medium">সম্পন্ন</span>
            <span className="font-heading text-lg font-bold text-[#2DD4BF]">{doneToday}</span>
          </div>
          <div className="h-8 w-[1px] bg-[#2B5852]" />
          <div className="text-center px-2">
            <span className="text-xs text-amber-400 block font-medium">মিস হয়েছে</span>
            <span className="font-heading text-lg font-bold text-amber-400">{missedToday}</span>
          </div>
        </div>
      </div>

      {/* Habit Cards Checklist */}
      {habits.length === 0 ? (
        <div className="bg-[#173834]/40 border border-dashed border-[#2B5852] rounded-2xl p-8 text-center my-4">
          <Sparkles className="w-8 h-8 text-[#2DD4BF] mx-auto mb-2" />
          <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
            এখনো কোনো অভ্যাস যোগ করা হয়নি
          </h3>
          <p className="text-xs text-[#A3C2BB] max-w-sm mx-auto mt-1">
            ভালো অভ্যাস তৈরি অথবা বদঅভ্যাস রোধ করতে 'অভ্যাস তালিকা' ট্যাবে যান।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {habits.map((habit, idx) => {
              const currentStatus = getStatusForToday(habit.id);
              const yesterdayMissed = storage.wasYesterdayMissed(habit.id);
              const streak = storage.calculateStreak(habit.id);

              return (
                <motion.div
                  key={`checklist-${habit.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-[#173834] border rounded-2xl p-4 shadow-sm space-y-3 relative transition-all ${
                    currentStatus === 'DONE'
                      ? 'border-[#2DD4BF]/60 bg-[#173834]/90'
                      : currentStatus === 'MISSED'
                      ? 'border-amber-500/40 bg-[#173834]/80'
                      : yesterdayMissed
                      ? 'border-amber-400/80 ring-1 ring-amber-400/30'
                      : 'border-[#2B5852] hover:border-[#2DD4BF]/40'
                  }`}
                >
                  {/* "Never Miss Twice" Highlighting Banner */}
                  {yesterdayMissed && currentStatus !== 'DONE' && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-start gap-2 text-amber-300 text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-400 block">
                          ⚠️ "Never miss twice" সংকেত!
                        </span>
                        <span>
                          গতকাল এটি মিস হয়েছিল। নিয়ম অনুযায়ী আজ অবশ্যই অন্তত ২-মিনিটের ভার্সনটুকু পূর্ণ করুন।
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Main Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            habit.type === 'BUILD'
                              ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {habit.type === 'BUILD' ? (
                            <>
                              <Sparkles className="w-3 h-3" /> BUILD
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-3 h-3" /> BREAK
                            </>
                          )}
                        </span>

                        {/* Streak Badge */}
                        {streak.currentStreak > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Flame className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{streak.currentStreak} দিন স্ট্রিক</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
                        {habit.name}
                      </h3>

                      {/* Micro-Details */}
                      {habit.type === 'BUILD' ? (
                        <p className="text-xs text-[#A3C2BB]">
                          ⚡ ২-মিনিট ভার্সন: <span className="text-[#2DD4BF] font-semibold">{habit.twoMinuteVersion || 'সহজ ভার্সন'}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-[#A3C2BB]">
                          ⚡ রিডাইরেক্ট: <span className="text-amber-300 font-semibold">{habit.cravingRedirect || '৬০ সেকেন্ড সচেতন থাকা'}</span>
                        </p>
                      )}
                    </div>

                    {/* Check-In Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* DONE Button */}
                      <button
                        onClick={() => handleCheckIn(habit.id, 'DONE')}
                        className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                          currentStatus === 'DONE'
                            ? 'bg-[#2DD4BF] text-[#0F2623] shadow-md shadow-[#2DD4BF]/20 ring-2 ring-[#2DD4BF]'
                            : 'bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-[#2DD4BF]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>DONE</span>
                      </button>

                      {/* MISSED Button */}
                      <button
                        onClick={() => handleCheckIn(habit.id, 'MISSED')}
                        className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                          currentStatus === 'MISSED'
                            ? 'bg-amber-500 text-[#0F2623] shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                            : 'bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-amber-400/80'
                        }`}
                      >
                        <XCircle className="w-4 h-4 stroke-[2.5]" />
                        <span>MISSED</span>
                      </button>
                    </div>
                  </div>

                  {/* Supportive Non-Guilt Message when MISSED */}
                  {currentStatus === 'MISSED' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#0F2623] border border-amber-500/30 p-3 rounded-xl text-xs space-y-1 mt-2 text-amber-200"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-amber-400">
                        <Heart className="w-4 h-4 fill-amber-400" />
                        <span>সহায়ক বার্তা:</span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#F0F7F5]">
                        {habit.type === 'BUILD' ? (
                          <>
                            ঠিক আছে, কাল আবার চেষ্টা করি — এই ২-মিনিট ভার্সনটা মনে আছে তো: <strong className="text-[#2DD4BF]">"{habit.twoMinuteVersion || habit.name}"</strong>?
                          </>
                        ) : (
                          <>
                            ঠিক আছে, কাল আবার চেষ্টা করি — তাড়না এলেই ক্র্যাভিং রিডাইরেক্ট প্রয়োগ করুন: <strong className="text-amber-300">"{habit.cravingRedirect || habit.name}"</strong>!
                          </>
                        )}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
