import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, ArrowLeft, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface BadHabitSelectionScreenProps {
  initialBadHabits?: string[];
  onFinish: (badHabits: string[]) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export const BadHabitSelectionScreen: React.FC<BadHabitSelectionScreenProps> = ({
  initialBadHabits = [],
  onFinish,
  onBack,
  isSubmitting = false,
}) => {
  const [badHabits, setBadHabits] = useState<string[]>(
    initialBadHabits.length > 0
      ? initialBadHabits
      : [
          'কাজের মাঝে বারবার সোশ্যাল মিডিয়া চেক করা',
          'রাতে ঘুমানোর আগে অতিরিক্ত মোবাইল ব্যবহার',
          'অসময়ে আনহেলদি ফাস্টফুড খাওয়া',
        ]
  );

  const [inputError, setInputError] = useState<string | null>(null);

  const handleHabitChange = (index: number, value: string) => {
    const updated = [...badHabits];
    updated[index] = value;
    setBadHabits(updated);
    if (inputError) setInputError(null);
  };

  const handleAddHabit = () => {
    if (badHabits.length >= 5) {
      setInputError('সর্বোচ্চ ৫টি বদঅভ্যাস যোগ করতে পারবেন');
      return;
    }
    setBadHabits([...badHabits, '']);
  };

  const handleRemoveHabit = (index: number) => {
    if (badHabits.length <= 1) {
      setInputError('কমপক্ষে ১টি অভ্যাস থাকা আবশ্যক');
      return;
    }
    const updated = badHabits.filter((_, i) => i !== index);
    setBadHabits(updated);
  };

  const handleQuickAdd = (habitName: string) => {
    if (badHabits.length >= 5) {
      setInputError('সর্বোচ্চ ৫টি বদঅভ্যাস যোগ করতে পারবেন');
      return;
    }
    if (!badHabits.includes(habitName)) {
      if (badHabits.length === 1 && badHabits[0].trim() === '') {
        setBadHabits([habitName]);
      } else {
        setBadHabits([...badHabits, habitName]);
      }
    }
  };

  const handleSubmit = () => {
    const validHabits = badHabits.map((h) => h.trim()).filter((h) => h.length > 0);
    if (validHabits.length < 3) {
      setInputError('অনুগ্রহ করে ৩ থেকে ৫টি বদঅভ্যাস লিখুন');
      return;
    }
    onFinish(validHabits);
  };

  const presetSuggestions = [
    'দেরিতে রাতে ঘুমাতে যাওয়া',
    'গুরুত্বপূর্ণ কাজ জমিয়ে রাখা (Procrastination)',
    'অতিরিক্ত চা/কফি খাওয়া',
    'ব্যায়াম না করে অলস বসে থাকা',
    'পড়াশোনা বা কাজে মনোযোগ না দেওয়া',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full max-w-xl mx-auto px-4 py-6"
    >
      {/* Top Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D443F] text-[#2DD4BF] text-xs font-medium mb-3 border border-[#2B5852]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>ধাপ ৩ অফ ৩: বদঅভ্যাস চিহ্নিতকরণ</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#F0F7F5] mb-2">
          যে অভ্যাসগুলো বাদ দিতে চাও
        </h1>
        <p className="font-body text-[#A3C2BB] text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          Atomic Habits এর বিপরীত ৪টি সূত্র অনুযায়ী আমরা আপনার এই বদঅভ্যাসগুলো ভাঙতে এবং ইনভার্স ট্র্যাক সাজাতে সাহায্য করব।
        </p>
      </div>

      {/* Input List */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs text-[#A3C2BB]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            বদঅভ্যাসের তালিকা ({badHabits.length}/৫)
          </span>
          <span>৩-৫টি ফ্রি-টেক্সটে লিখুন</span>
        </div>

        {badHabits.map((habit, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-[#173834] border border-[#2B5852] flex items-center justify-center text-amber-400 font-semibold text-xs shrink-0">
              {idx + 1}
            </div>
            <input
              type="text"
              value={habit}
              onChange={(e) => handleHabitChange(idx, e.target.value)}
              placeholder={`উদাহরণ: "${idx === 0 ? 'সোশ্যাল মিডিয়ায় সময় নষ্ট করা' : 'অসময়ে জাঙ্কফুড খাওয়া'}"`}
              className="flex-1 bg-[#173834] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
            />
            {badHabits.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveHabit(idx)}
                className="p-2 text-[#A3C2BB] hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors shrink-0"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}

        {badHabits.length < 5 && (
          <button
            type="button"
            onClick={handleAddHabit}
            className="w-full py-2.5 border border-dashed border-[#2B5852] hover:border-[#2DD4BF] text-[#2DD4BF] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors bg-[#173834]/40 hover:bg-[#173834]"
          >
            <Plus className="w-4 h-4" />
            নতুন বদঅভ্যাস যোগ করুন
          </button>
        )}

        {inputError && (
          <p className="text-red-400 text-xs text-center font-medium mt-1">
            {inputError}
          </p>
        )}
      </div>

      {/* Preset Bad Habit Chips */}
      <div className="bg-[#173834]/60 border border-[#2B5852] rounded-xl p-3.5 mb-8">
        <p className="text-xs font-semibold text-[#A3C2BB] mb-2 flex items-center gap-1">
          📌 সচরাচর থাকা অভ্যাস থেকে যোগ করতে পারেন:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {presetSuggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickAdd(s)}
              className="text-xs bg-[#0F2623] hover:bg-[#23504B] border border-[#2B5852] text-[#E8F1EF] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>+</span> {s}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="py-3.5 px-4 border border-[#2B5852] hover:bg-[#173834] text-[#A3C2BB] font-medium rounded-xl flex items-center gap-1.5 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পেছনে</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3.5 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold rounded-xl shadow-lg shadow-[#2DD4BF]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-heading text-base disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>সেভ করা হচ্ছে...</span>
          ) : (
            <>
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>শেষ করো</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
