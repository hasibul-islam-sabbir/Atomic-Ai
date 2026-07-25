import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, User, Reflection } from '../../types';
import { storage } from '../../db/storage';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Award,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Heart,
  UserCheck,
  Send,
  MessageCircle,
} from 'lucide-react';

interface WeeklyReflectionScreenProps {
  user: User | null;
  habits: Habit[];
}

export const WeeklyReflectionScreen: React.FC<WeeklyReflectionScreenProps> = ({
  user,
  habits,
}) => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [currentAiInsight, setCurrentAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(false);
  const [identityCheckResponse, setIdentityCheckResponse] = useState<string>('');
  const [identityCheckSaved, setIdentityCheckSaved] = useState<boolean>(false);

  // Compute stats for last 7 days
  const last7Days = storage.getLast30DaysDates().slice(-7);
  const allCheckIns = storage.getCheckIns();

  const habitStats = habits.map((habit) => {
    const habitCheckIns = allCheckIns.filter(
      (c) => c.habitId === habit.id && last7Days.includes(c.date)
    );
    const doneCount = habitCheckIns.filter((c) => c.status === 'DONE').length;
    const consistencyRate = Math.round((doneCount / 7) * 100);

    return {
      habit,
      doneCount,
      consistencyRate,
    };
  });

  // Sort by consistency rate descending
  const sortedStats = [...habitStats].sort((a, b) => b.consistencyRate - a.consistencyRate);
  const topHabit = sortedStats.length > 0 ? sortedStats[0] : null;
  const bottomHabit = sortedStats.length > 1 ? sortedStats[sortedStats.length - 1] : null;

  const totalPossible = habits.length * 7;
  const totalDone = habitStats.reduce((acc, curr) => acc + curr.doneCount, 0);
  const overallCompletionRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  const weekStartDate = last7Days[0] || storage.getTodayDateStr();

  useEffect(() => {
    const storedReflections = storage.getReflections();
    setReflections(storedReflections);

    const currentWeekReflection = storedReflections.find((r) => r.weekStartDate === weekStartDate);
    if (currentWeekReflection) {
      setCurrentAiInsight(currentWeekReflection.aiInsight);
      if (currentWeekReflection.identityCheckResponse) {
        setIdentityCheckResponse(currentWeekReflection.identityCheckResponse);
        setIdentityCheckSaved(true);
      }
    } else {
      generateAiInsight();
    }
  }, [weekStartDate]);

  const generateAiInsight = async () => {
    setIsLoadingInsight(true);
    try {
      const res = await fetch('/api/mentor/weekly-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topHabit: topHabit ? `${topHabit.habit.name} (${topHabit.consistencyRate}%)` : '',
          bottomHabit: bottomHabit ? `${bottomHabit.habit.name} (${bottomHabit.consistencyRate}%)` : '',
          completionRate: overallCompletionRate,
          identityStatements: user?.identityStatements || [],
        }),
      });

      const data = await res.json();
      const insightText = data.insight || 'সাপ্তাহিক প্রোগ্রেস বজায় রাখতে পরিবেশ আরও সহজ করুন।';

      setCurrentAiInsight(insightText);

      const newReflection: Reflection = {
        id: Date.now(),
        weekStartDate,
        summary: `সাপ্তাহিক সাফল্য: ${overallCompletionRate}%, সেরা: ${topHabit?.habit.name || 'N/A'}`,
        aiInsight: insightText,
        identityCheckResponse,
      };

      storage.saveReflection(newReflection);
    } catch (error) {
      console.error('Error fetching reflection insight:', error);
      setCurrentAiInsight('ক্ষুদ্র পরিবেশগত পরিবর্তন এনে দুর্বল অভ্যাসের ঘর্ষণ (friction) কমিয়ে দিন।');
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleSaveIdentityCheck = () => {
    if (!identityCheckResponse.trim()) return;

    const existingReflection = reflections.find((r) => r.weekStartDate === weekStartDate);
    const updatedReflection: Reflection = {
      id: existingReflection ? existingReflection.id : Date.now(),
      weekStartDate,
      summary: existingReflection ? existingReflection.summary : `সাপ্তাহিক সাফল্য: ${overallCompletionRate}%`,
      aiInsight: currentAiInsight,
      monthlyIdentityCheckDone: true,
      identityCheckResponse: identityCheckResponse.trim(),
      identityCheckDate: storage.getTodayDateStr(),
    };

    storage.saveReflection(updatedReflection);
    setIdentityCheckSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] text-xs font-semibold mb-1 border border-[#2DD4BF]/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>সাপ্তাহিক রিফ্লেকশন (Weekly Reflection)</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F0F7F5]">
            সাপ্তাহিক আত্ম-মূল্যায়ন ও প্রোগ্রেস
          </h2>
          <p className="font-body text-xs text-[#A3C2BB] mt-0.5">
            সপ্তাহের সাফল্য ও ঘাটতি বিশ্লেষণ করে পরবর্তী সপ্তাহের জন্য প্রস্তুতি নিন।
          </p>
        </div>

        {/* Weekly Completion Rate */}
        <div className="flex items-center gap-3 bg-[#0F2623] p-3 rounded-xl border border-[#2B5852]/60 w-full md:w-auto">
          <Award className="w-8 h-8 text-[#2DD4BF]" />
          <div>
            <span className="text-[11px] text-[#A3C2BB] block font-medium">সাপ্তাহিক সার্বিক সাফল্য</span>
            <span className="font-heading text-xl font-bold text-[#2DD4BF]">{overallCompletionRate}%</span>
          </div>
        </div>
      </div>

      {/* Best & Lowest Consistency Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Performing Habit */}
        <div className="bg-[#173834] border border-[#2DD4BF]/40 rounded-2xl p-4 space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-1 rounded-full border border-[#2DD4BF]/30">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>সর্বোচ্চ ধারাবাহিকতা (Highest)</span>
            </span>
            <span className="text-xs font-extrabold text-[#2DD4BF]">
              {topHabit ? `${topHabit.consistencyRate}%` : '0%'}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
            {topHabit ? topHabit.habit.name : 'কোনো ডেটা পাওয়া যায়নি'}
          </h3>

          <p className="text-xs text-[#A3C2BB]">
            গত ৭ দিনের মধ্যে <strong className="text-[#2DD4BF]">{topHabit?.doneCount || 0} দিন</strong> সফলভাবে সম্পন্ন করা হয়েছে।
          </p>
        </div>

        {/* Lowest Consistency Habit */}
        <div className="bg-[#173834] border border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>সর্বনিম্ন ধারাবাহিকতা (Lowest)</span>
            </span>
            <span className="text-xs font-extrabold text-amber-400">
              {bottomHabit ? `${bottomHabit.consistencyRate}%` : '0%'}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
            {bottomHabit ? bottomHabit.habit.name : 'কোনো ঘাটতি নেই / একটি অভ্যাস'}
          </h3>

          <p className="text-xs text-[#A3C2BB]">
            {bottomHabit ? (
              <>
                গত ৭ দিনের মধ্যে <strong className="text-amber-400">{bottomHabit.doneCount} দিন</strong> সম্পন্ন হয়েছে। ২-মিনিট রুল প্রয়োগ করার সুযোগ রয়েছে।
              </>
            ) : (
              'অন্য সকল অভ্যাসই ভালো গতিতে চলছে।'
            )}
          </p>
        </div>
      </div>

      {/* AI Mentor One-Line Weekly Insight Card */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Lightbulb className="w-4 h-4 fill-amber-400/20" />
            <span>AI মেন্টরের এক-লাইন দিকনির্দেশনা (Weekly AI Insight)</span>
          </div>
          <button
            onClick={generateAiInsight}
            disabled={isLoadingInsight}
            className="text-xs text-[#2DD4BF] hover:underline flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingInsight ? 'animate-spin' : ''}`} />
            <span>পুনরায় তৈরি</span>
          </button>
        </div>

        <div className="bg-[#0F2623] p-3.5 rounded-xl border border-[#2B5852]/80 text-xs text-[#F0F7F5] leading-relaxed italic">
          {isLoadingInsight ? (
            <span className="text-[#A3C2BB] animate-pulse">
              AI মেন্টর সাপ্তাহিক বিশ্লেষণ প্রস্তুত করছে...
            </span>
          ) : (
            `"${currentAiInsight || 'ছোট পরিবর্তনই দীর্ঘমেয়াদে বড় ফল এনে দেয়।'}"`
          )}
        </div>
      </div>

      {/* Monthly Identity Check Prompt Section */}
      <div className="bg-[#173834] border border-[#2DD4BF]/50 rounded-2xl p-4 md:p-5 space-y-4 shadow-md relative">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#2DD4BF]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#2DD4BF] tracking-wider block">
              মাসের আত্ম-পরীক্ষা (Monthly Identity Check)
            </span>
            <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
              "তুমি কি সেই মানুষ হয়ে উঠছ যা হতে চেয়েছিলে?"
            </h3>
          </div>
        </div>

        {/* Show Onboarding Identity Reference */}
        {user && user.identityStatements.length > 0 && (
          <div className="bg-[#0F2623] p-3 rounded-xl border border-[#2B5852]/60 space-y-1.5">
            <span className="text-[11px] text-[#A3C2BB] font-semibold block">
              আপনার অনবোর্ডিং-এ সেট করা কাঙ্ক্ষিত পরিচয় (Identity Goal):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.identityStatements.map((stmt, idx) => (
                <span
                  key={`identity-${idx}-${stmt}`}
                  className="text-xs text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-1 rounded-lg border border-[#2DD4BF]/30 font-medium"
                >
                  ✨ {stmt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Response Textarea */}
        <div className="space-y-2">
          <label className="text-xs text-[#A3C2BB] font-medium block">
            গত এক মাসে আপনার অভ্যাসগুলো কি এই পরিচয়ের পক্ষে ভোট দিয়েছে? সংক্ষিপ্ত অভিজ্ঞতা লিখুন:
          </label>
          <textarea
            rows={3}
            value={identityCheckResponse}
            onChange={(e) => {
              setIdentityCheckResponse(e.target.value);
              setIdentityCheckSaved(false);
            }}
            placeholder="উদাহরণ: হ্যা, আমি প্রায় নিয়মিত সকালে ৩০ মিনিট কাজ করতে পেরেছি এবং নিজেকে একজন কর্মঠ ব্যক্তি বলে মনে হচ্ছে..."
            className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] text-[#F0F7F5] placeholder-[#608780] text-xs rounded-xl p-3 outline-none resize-none transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#A3C2BB]">
              {identityCheckSaved ? (
                <span className="text-[#2DD4BF] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> সংরক্ষণ করা হয়েছে
                </span>
              ) : (
                'মাসে একবার এই প্রশ্নটি নিজেকে করা প্রয়োজন।'
              )}
            </span>

            <button
              onClick={handleSaveIdentityCheck}
              disabled={!identityCheckResponse.trim()}
              className="py-2 px-4 bg-[#2DD4BF] hover:bg-[#26bba8] disabled:opacity-40 text-[#0F2623] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>সেভ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
