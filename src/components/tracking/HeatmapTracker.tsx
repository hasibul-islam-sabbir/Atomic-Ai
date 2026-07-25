import React from 'react';
import { motion } from 'motion/react';
import { Habit, CheckInStatus } from '../../types';
import { storage } from '../../db/storage';
import {
  Flame,
  Award,
  Calendar,
  Sparkles,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

interface HeatmapTrackerProps {
  habits: Habit[];
}

export const HeatmapTracker: React.FC<HeatmapTrackerProps> = ({ habits }) => {
  const dates = storage.getLast30DaysDates(); // 30 days array [29 days ago ... today]
  const allCheckIns = storage.getCheckIns();

  // Helper to format date string YYYY-MM-DD to short display date (e.g. "Jul 25" / "25 Jul")
  const formatShortDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return dateObj.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Tracker Header */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-1 border border-amber-500/30">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>৩০ দিনের প্রোগ্রেস ও হিটম্যাপ</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F0F7F5]">
            অভ্যাসের হিটম্যাপ ও স্ট্রিক ট্র্যাকার
          </h2>
          <p className="font-body text-xs text-[#A3C2BB] mt-0.5">
            ধারাবাহিকতা বজায় রাখার জন্য GitHub-স্টাইল ৩০ দিনের কন্ট্রিবিউশন গ্রিড।
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-[#0F2623] px-3 py-2 rounded-xl border border-[#2B5852]/60 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#2DD4BF] inline-block" />
            <span className="text-[#A3C2BB]">সম্পন্ন</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
            <span className="text-[#A3C2BB]">মিস</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#0F2623] border border-[#2B5852] inline-block" />
            <span className="text-[#A3C2BB]">তথ্য নেই</span>
          </div>
        </div>
      </div>

      {/* Habit Heatmap Cards */}
      {habits.length === 0 ? (
        <div className="bg-[#173834]/40 border border-dashed border-[#2B5852] rounded-2xl p-8 text-center my-4">
          <BarChart3 className="w-8 h-8 text-[#2DD4BF] mx-auto mb-2" />
          <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
            ট্র্যাক করার মতো কোনো অভ্যাস পাওয়া যায়নি
          </h3>
          <p className="text-xs text-[#A3C2BB] max-w-sm mx-auto mt-1">
            নতুন অভ্যাস তৈরি করে ৩০ দিনের প্রোগ্রেস ট্র্যাকিং শুরু করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit, habitIdx) => {
            const habitCheckIns = allCheckIns.filter((c) => c.habitId === habit.id);
            const streak = storage.calculateStreak(habit.id);

            // Map date -> status for this habit
            const statusMap = new Map<string, CheckInStatus>();
            habitCheckIns.forEach((c) => statusMap.set(c.date, c.status));

            // Count done in last 30 days
            const doneIn30Days = dates.filter((d) => statusMap.get(d) === 'DONE').length;
            const completionPercent = Math.round((doneIn30Days / 30) * 100);

            return (
              <motion.div
                key={`heatmap-${habit.id}-${habitIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 shadow-sm space-y-4"
              >
                {/* Header: Habit Title & Streaks */}
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
                      <span className="text-xs font-semibold text-[#A3C2BB]">
                        ৩০ দিনে সাফল্য: {completionPercent}%
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
                      {habit.name}
                    </h3>
                  </div>

                  {/* Streaks Counters */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Current Streak */}
                    <div className="bg-[#0F2623] border border-[#2B5852] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <div>
                        <span className="text-[10px] text-[#A3C2BB] block leading-none">চলতি স্ট্রিক</span>
                        <span className="font-heading text-xs font-bold text-amber-400">
                          {streak.currentStreak} দিন
                        </span>
                      </div>
                    </div>

                    {/* Longest Streak */}
                    <div className="bg-[#0F2623] border border-[#2B5852] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#2DD4BF]" />
                      <div>
                        <span className="text-[10px] text-[#A3C2BB] block leading-none">সর্বোচ্চ স্ট্রিক</span>
                        <span className="font-heading text-xs font-bold text-[#2DD4BF]">
                          {streak.longestStreak} দিন
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 30-Day GitHub Style Heatmap Grid */}
                <div className="bg-[#0F2623] p-3.5 rounded-xl border border-[#2B5852]/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#A3C2BB] font-medium px-1">
                    <span>{formatShortDate(dates[0])} (৩০ দিন পূর্বে)</span>
                    <span>আজ ({formatShortDate(dates[dates.length - 1])})</span>
                  </div>

                  {/* Heatmap Squares Grid */}
                  <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5 pt-1">
                    {dates.map((dateStr, idx) => {
                      const status = statusMap.get(dateStr);
                      const isToday = idx === dates.length - 1;

                      let bgClass = 'bg-[#173834] border border-[#2B5852]/80';
                      let labelStatus = 'তথ্য নেই';

                      if (status === 'DONE') {
                        bgClass = 'bg-[#2DD4BF] text-[#0F2623] shadow-sm shadow-[#2DD4BF]/30';
                        labelStatus = 'সম্পন্ন (DONE)';
                      } else if (status === 'MISSED') {
                        bgClass = 'bg-amber-500 text-[#0F2623] shadow-sm';
                        labelStatus = 'মিস (MISSED)';
                      }

                      return (
                        <div
                          key={dateStr}
                          title={`${formatShortDate(dateStr)}: ${labelStatus}`}
                          className={`aspect-square rounded-md transition-all hover:scale-125 cursor-pointer relative group flex items-center justify-center ${bgClass} ${
                            isToday ? 'ring-2 ring-white/60' : ''
                          }`}
                        >
                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-[#0F2623] border border-[#2B5852] text-[#F0F7F5] text-[10px] py-1 px-2 rounded-lg whitespace-nowrap shadow-xl pointer-events-none">
                            <span className="font-bold text-[#2DD4BF] block">{formatShortDate(dateStr)}</span>
                            <span>{labelStatus}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
