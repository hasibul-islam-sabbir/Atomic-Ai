import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScorecardRoutineItem } from '../../types';
import { ArrowRight, ArrowLeft, CheckCircle2, ListFilter, Plus, Minus, Equal } from 'lucide-react';

interface HabitScorecardScreenProps {
  scorecard: ScorecardRoutineItem[];
  onNext: (scorecard: ScorecardRoutineItem[]) => void;
  onBack: () => void;
}

export const HabitScorecardScreen: React.FC<HabitScorecardScreenProps> = ({
  scorecard: initialScorecard,
  onNext,
  onBack,
}) => {
  const [items, setItems] = useState<ScorecardRoutineItem[]>(initialScorecard);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRatingChange = (id: string, rating: '+' | '-' | '=') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rating: item.rating === rating ? null : rating } : item
      )
    );
    if (errorMsg) setErrorMsg(null);
  };

  const ratedCount = items.filter((i) => i.rating !== null).length;
  const positiveCount = items.filter((i) => i.rating === '+').length;
  const negativeCount = items.filter((i) => i.rating === '-').length;
  const neutralCount = items.filter((i) => i.rating === '=').length;

  const handleNext = () => {
    if (ratedCount < 5) {
      setErrorMsg('কমপক্ষে ৫টি দৈনন্দিন অভ্যাসে (+) (-) বা (=) চিহ্নিত করুন');
      return;
    }
    onNext(items);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full max-w-xl mx-auto px-4 py-6"
    >
      {/* Top Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D443F] text-[#2DD4BF] text-xs font-medium mb-2.5 border border-[#2B5852]">
          <ListFilter className="w-3.5 h-3.5" />
          <span>ধাপ ২ অফ ৩: অভ্যাস পর্যবেক্ষণ</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#F0F7F5] mb-1.5">
          Habit Scorecard
        </h1>
        <p className="font-body text-[#A3C2BB] text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          আপনার বর্তমান দৈনন্দিন অভ্যাসের পাশে নির্বাচন করুন:
          <span className="text-emerald-400 font-semibold ml-1">(+) ভালো</span>,
          <span className="text-amber-400 font-semibold ml-1">(-) ক্ষতিকর</span>,
          <span className="text-slate-300 font-semibold ml-1">(=) নিউট্রাল</span>
        </p>
      </div>

      {/* Progress Bar & Summary Stats */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-xl p-3 mb-4 flex items-center justify-between text-xs text-[#A3C2BB]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
          <span>চিহ্নিত করা হয়েছে: <strong className="text-[#F0F7F5] font-bold">{ratedCount}</strong>/{items.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400"><Plus className="w-3 h-3" /> {positiveCount}</span>
          <span className="flex items-center gap-1 text-amber-400"><Minus className="w-3 h-3" /> {negativeCount}</span>
          <span className="flex items-center gap-1 text-slate-300"><Equal className="w-3 h-3" /> {neutralCount}</span>
        </div>
      </div>

      {/* Routine Item List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-6 max-h-[380px]">
        {items.map((item, index) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                item.rating === '+'
                  ? 'bg-[#123A33] border-emerald-500/50'
                  : item.rating === '-'
                  ? 'bg-[#2A2B20] border-amber-500/50'
                  : item.rating === '='
                  ? 'bg-[#1C2C29] border-slate-500/40'
                  : 'bg-[#173834]/80 border-[#2B5852]'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="text-xs font-semibold text-[#A3C2BB] w-5 shrink-0">
                  {index + 1}.
                </span>
                <span className="text-sm font-medium text-[#F0F7F5] leading-snug truncate">
                  {item.title}
                </span>
              </div>

              {/* Tappable Options: +, -, = */}
              <div className="flex items-center gap-1.5 shrink-0 bg-[#0F2623] p-1 rounded-lg border border-[#2B5852]">
                <button
                  type="button"
                  onClick={() => handleRatingChange(item.id, '+')}
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs transition-all ${
                    item.rating === '+'
                      ? 'bg-emerald-500 text-[#0F2623] shadow-md shadow-emerald-500/30 scale-105'
                      : 'text-emerald-400 hover:bg-[#1D443F]'
                  }`}
                  title="ভালো অভ্যাস"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleRatingChange(item.id, '-')}
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs transition-all ${
                    item.rating === '-'
                      ? 'bg-amber-500 text-[#0F2623] shadow-md shadow-amber-500/30 scale-105'
                      : 'text-amber-400 hover:bg-[#1D443F]'
                  }`}
                  title="ক্ষতিকর অভ্যাস"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleRatingChange(item.id, '=')}
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs transition-all ${
                    item.rating === '='
                      ? 'bg-slate-300 text-[#0F2623] shadow-md shadow-slate-300/30 scale-105'
                      : 'text-slate-300 hover:bg-[#1D443F]'
                  }`}
                  title="নিউট্রাল অভ্যাস"
                >
                  <Equal className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {errorMsg && (
        <p className="text-red-400 text-xs text-center font-medium mb-3">
          {errorMsg}
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          type="button"
          onClick={onBack}
          className="py-3 px-4 border border-[#2B5852] hover:bg-[#173834] text-[#A3C2BB] font-medium rounded-xl flex items-center gap-1.5 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পেছনে</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3.5 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold rounded-xl shadow-lg shadow-[#2DD4BF]/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-heading text-base"
        >
          <span>পরবর্তী ধাপ</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
