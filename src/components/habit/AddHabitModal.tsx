import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, LawFocus } from '../../types';
import { X, Sparkles, Layers, Clock, Eye, Check, Lightbulb } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: {
    id?: number;
    name: string;
    stackAnchor: string;
    twoMinuteVersion: string;
    environmentCue: string;
    lawFocus: LawFocus;
  }) => void;
  editingHabit?: Habit | null;
}

const PRESET_STACK_ANCHORS = [
  'সকালে ঘুম থেকে ওঠার পর',
  'ফজর / সকালের প্রার্থনার পর',
  'সকালের নাস্তা করার পর',
  'দাঁত ব্রাশ করার পর',
  'কাজের ডেস্কে বসার পর',
  'দুপুরের খাবার খাওয়ার পর',
  'সন্ধ্যায় বাসায় ফেরার পর',
  'রাতের খাবার খাওয়ার পর',
  'বিছানায় ঘুমাতে যাওয়ার আগে',
  'কাস্টম এঙ্কর লিখুন...',
];

const TWO_MINUTE_SUGGESTIONS: Record<string, string> = {
  পড়া: '১ পৃষ্ঠা বই পড়া',
  বই: '১ পৃষ্ঠা বই পড়া',
  ব্যায়াম: '২টি পুশআপ বা ১ মিনিট স্ট্রেচ করা',
  মেডিটেশন: '২ মিনিট চোখ বন্ধ করে শ্বাসের দিকে নজর দেওয়া',
  পড়াশোনা: '১টি পৃষ্ঠা বা ১টি প্যারাগ্রাফ পড়া',
  লেখা: 'মাত্র ১টি বাক্য লেখা',
  পানি: '১ গ্লাস বিশুদ্ধ পানি পান করা',
  হাঁটা: '২ মিনিট রুমে হাঁটা',
  কোডিং: '৫ লাইন কোড লেখা',
  কাজ: '১টি ছোট টাস্ক সম্পূর্ণ করা',
};

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHabit,
}) => {
  const [name, setName] = useState('');
  const [selectedAnchor, setSelectedAnchor] = useState(PRESET_STACK_ANCHORS[0]);
  const [customAnchor, setCustomAnchor] = useState('');
  const [twoMinuteVersion, setTwoMinuteVersion] = useState('');
  const [environmentCue, setEnvironmentCue] = useState('');
  const [lawFocus, setLawFocus] = useState<LawFocus>('OBVIOUS');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      if (editingHabit.stackAnchor && PRESET_STACK_ANCHORS.includes(editingHabit.stackAnchor)) {
        setSelectedAnchor(editingHabit.stackAnchor);
        setCustomAnchor('');
      } else if (editingHabit.stackAnchor) {
        setSelectedAnchor('কাস্টম এঙ্কর লিখুন...');
        setCustomAnchor(editingHabit.stackAnchor);
      }
      setTwoMinuteVersion(editingHabit.twoMinuteVersion || '');
      setEnvironmentCue(editingHabit.environmentCue || '');
      setLawFocus(editingHabit.lawFocus || 'OBVIOUS');
    } else {
      setName('');
      setSelectedAnchor(PRESET_STACK_ANCHORS[0]);
      setCustomAnchor('');
      setTwoMinuteVersion('');
      setEnvironmentCue('');
      setLawFocus('OBVIOUS');
    }
    setError(null);
  }, [editingHabit, isOpen]);

  // Dynamic 2-minute rule suggestion based on name keyword
  const getSuggestion = (inputName: string): string | null => {
    if (!inputName.trim()) return null;
    for (const [key, val] of Object.entries(TWO_MINUTE_SUGGESTIONS)) {
      if (inputName.includes(key)) {
        return val;
      }
    }
    return `২ মিনিটে ${inputName.trim()}-এর প্রথম ধাপটি শেষ করা`;
  };

  const activeSuggestion = getSuggestion(name);

  const applySuggestion = (sug: string) => {
    setTwoMinuteVersion(sug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('অভ্যাসের নাম আবশ্যক');
      return;
    }

    const finalAnchor =
      selectedAnchor === 'কাস্টম এঙ্কর লিখুন...'
        ? customAnchor.trim()
        : selectedAnchor;

    if (!finalAnchor) {
      setError('একটি স্ট্যাক এঙ্কর বেছে নিন বা লিখুন');
      return;
    }

    if (!twoMinuteVersion.trim()) {
      setError('২-মিনিট ভার্সন পূরণ করুন');
      return;
    }

    onSave({
      id: editingHabit ? editingHabit.id : undefined,
      name: name.trim(),
      stackAnchor: finalAnchor,
      twoMinuteVersion: twoMinuteVersion.trim(),
      environmentCue: environmentCue.trim() || 'পরিবেশ প্রস্তুত রাখা',
      lawFocus,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#173834] border border-[#2B5852] rounded-2xl w-full max-w-lg p-5 shadow-2xl my-8 text-[#E8F1EF] relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2B5852]/60 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-[#F0F7F5]">
                  {editingHabit ? 'অভ্যাস পরিবর্তন করুন' : 'নতুন ভালো অভ্যাস গড়ুন (BUILD)'}
                </h2>
                <p className="text-xs text-[#A3C2BB]">Atomic Habits-এর ৪টি নীতির আলোকে সেটআপ</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A3C2BB] hover:text-[#F0F7F5] rounded-lg hover:bg-[#23504B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Habit Name */}
            <div>
              <label className="block text-xs font-semibold text-[#A3C2BB] mb-1">
                ১. অভ্যাসের নাম (Habit Name) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="যেমন: বই পড়া, নিয়মিত ব্যায়াম করা, পানি খাওয়া"
                className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
              />
            </div>

            {/* 2. Habit Stacking Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#A3C2BB] mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#2DD4BF]" />
                ২. হ্যাবিট স্ট্যাকিং (Stack Anchor Routine) <span className="text-red-400">*</span>
              </label>
              <p className="text-[11px] text-[#81A8A0] mb-1.5">
                [বর্তমান অভ্যাস/রুটিন]-এর পর আমি [{name || 'নতুন অভ্যাস'}] করব।
              </p>
              <select
                value={selectedAnchor}
                onChange={(e) => setSelectedAnchor(e.target.value)}
                className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] rounded-xl px-3.5 py-2.5 text-sm transition-colors mb-2"
              >
                {PRESET_STACK_ANCHORS.map((anchor, idx) => (
                  <option key={idx} value={anchor} className="bg-[#0F2623] text-[#F0F7F5]">
                    {anchor}
                  </option>
                ))}
              </select>

              {selectedAnchor === 'কাস্টম এঙ্কর লিখুন...' && (
                <input
                  type="text"
                  value={customAnchor}
                  onChange={(e) => setCustomAnchor(e.target.value)}
                  placeholder="আপনার নিজস্ব রুটিন লিখুন (যেমন: সকালের চা খাওয়ার পর)"
                  className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors mt-1"
                />
              )}
            </div>

            {/* 3. 2-Minute Rule Wizard */}
            <div>
              <label className="block text-xs font-semibold text-[#A3C2BB] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                ৩. ২-মিনিট রুল ভার্সন (2-Minute Version) <span className="text-red-400">*</span>
              </label>

              {/* Wizard Prompt Box */}
              {activeSuggestion && (
                <div className="bg-[#0F2623] border border-[#2B5852] rounded-xl p-2.5 mb-2 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <span className="text-[#A3C2BB] block mb-1">
                      💡 <strong>২-মিনিট রুল উইজার্ড সাজেশন:</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => applySuggestion(activeSuggestion)}
                      className="text-[#2DD4BF] font-medium hover:underline text-left bg-[#173834] px-2 py-1 rounded border border-[#2B5852] inline-block"
                    >
                      "{activeSuggestion}" <u>[ক্লিক করে সিলেক্ট করুন]</u>
                    </button>
                  </div>
                </div>
              )}

              <input
                type="text"
                value={twoMinuteVersion}
                onChange={(e) => setTwoMinuteVersion(e.target.value)}
                placeholder="যেমন: মাত্র ১ পৃষ্ঠা পড়া বা ২ মিনিট চোখ বন্ধ রাখা"
                className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
              />
            </div>

            {/* 4. Environment Cue Input */}
            <div>
              <label className="block text-xs font-semibold text-[#A3C2BB] mb-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                ৪. পরিবেশ প্রস্তুতি (Environment Cue)
              </label>
              <input
                type="text"
                value={environmentCue}
                onChange={(e) => setEnvironmentCue(e.target.value)}
                placeholder="যেমন: বইটি রাতে বালিশের ওপর রেখে দেব / পানির বোতল টেবিলে রাখব"
                className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
              />
            </div>

            {/* 5. Law Focus Tag Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#A3C2BB] mb-1">
                ৫. মূল আইন ও ফোকাস ট্যাগ (Law Focus)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLawFocus('OBVIOUS')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    lawFocus === 'OBVIOUS'
                      ? 'bg-[#2DD4BF] text-[#0F2623] border-[#2DD4BF] font-bold shadow-md'
                      : 'bg-[#0F2623] text-[#A3C2BB] border-[#2B5852] hover:bg-[#1D443F]'
                  }`}
                >
                  ১ম আইন: স্পষ্ট করা (OBVIOUS)
                </button>
                <button
                  type="button"
                  onClick={() => setLawFocus('EASY')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    lawFocus === 'EASY'
                      ? 'bg-emerald-400 text-[#0F2623] border-emerald-400 font-bold shadow-md'
                      : 'bg-[#0F2623] text-[#A3C2BB] border-[#2B5852] hover:bg-[#1D443F]'
                  }`}
                >
                  ৩য় আইন: সহজ করা (EASY)
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center font-medium pt-1">
                {error}
              </p>
            )}

            {/* Submit & Cancel */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-[#2B5852] text-[#A3C2BB] hover:bg-[#23504B] text-xs font-semibold transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#2DD4BF]/20 transition-all active:scale-[0.99]"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{editingHabit ? 'আপডেট সেভ করুন' : 'অভ্যাস সেভ করুন'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
