import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit } from '../../types';
import {
  Flame,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Wind,
  Heart,
  Award,
  ChevronRight,
} from 'lucide-react';

interface UrgeTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  badHabits: Habit[];
  onOpenAddBadHabit?: () => void;
}

export const UrgeTimerModal: React.FC<UrgeTimerModalProps> = ({
  isOpen,
  onClose,
  badHabits,
  onOpenAddBadHabit,
}) => {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      if (badHabits.length > 0 && !selectedHabit) {
        setSelectedHabit(badHabits[0]);
      }
      setTimeLeft(60);
      setIsActive(false);
      setIsCompleted(false);
    }
  }, [isOpen, badHabits]);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = (habit: Habit) => {
    setSelectedHabit(habit);
    setTimeLeft(60);
    setIsActive(true);
    setIsCompleted(false);
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(60);
    setIsActive(false);
    setIsCompleted(false);
  };

  const handleFinishEarly = () => {
    setIsActive(false);
    setIsCompleted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-[#E8F1EF] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#173834] border border-[#2B5852] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative my-auto overflow-hidden"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#A3C2BB] hover:text-[#F0F7F5] bg-[#0F2623] border border-[#2B5852] rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {!selectedHabit || badHabits.length === 0 ? (
            /* STEP 0: Empty bad habit state */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#F0F7F5]">
                কোনো বদঅভ্যাস লিস্ট করা নেই
              </h3>
              <p className="text-xs text-[#A3C2BB] max-w-xs mx-auto">
                তাড়না (Urge) আসায় এই বাটন চেপেছেন? প্রথমে একটি বদঅভ্যাস ও ক্র্যাভিং রিডাইরেক্ট তৈরি করুন।
              </p>
              {onOpenAddBadHabit && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddBadHabit();
                  }}
                  className="py-2.5 px-5 bg-amber-400 text-[#0F2623] font-bold text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>বদঅভ্যাস যোগ করুন</span>
                </button>
              )}
            </div>
          ) : !isActive && !isCompleted && timeLeft === 60 ? (
            /* STEP 1: Select Habit to Surf the Urge */
            <div className="space-y-5">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>URGE SURFING - তাড়না জয় করার সেশন</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-[#F0F7F5]">
                  কোন বদঅভ্যাসের তাড়না পাচ্ছেন?
                </h2>
                <p className="text-xs text-[#A3C2BB]">
                  তাড়না একটি সাময়িক অনুভূতি। ৬০ সেকেন্ড নিজেকে রিডাইরেক্ট করলে ইচ্ছার তীব্রতা কমে যাবে।
                </p>
              </div>

              {/* Bad Habits Selector */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {badHabits.map((habit, idx) => (
                  <button
                    key={`urge-${habit.id}-${idx}`}
                    onClick={() => startTimer(habit)}
                    className="w-full bg-[#0F2623] hover:bg-[#13312D] border border-[#2B5852] hover:border-[#2DD4BF] p-3.5 rounded-2xl flex items-center justify-between text-left transition-all group"
                  >
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#F0F7F5] group-hover:text-[#2DD4BF]">
                        {habit.name}
                      </h4>
                      <p className="text-xs text-amber-300 font-medium mt-0.5">
                        ⚡ {habit.cravingRedirect || '৬০ সেকেন্ড গভীর শ্বাসের ব্যায়াম'}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-[#173834] group-hover:bg-[#2DD4BF] text-[#2DD4BF] group-hover:text-[#0F2623] transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : isCompleted ? (
            /* STEP 3: Victory Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-[#2DD4BF]/20 border-2 border-[#2DD4BF] text-[#2DD4BF] flex items-center justify-center mx-auto shadow-xl shadow-[#2DD4BF]/20 animate-bounce">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2DD4BF] uppercase tracking-wider">
                  🎉 তাড়নাকে জয় করেছেন!
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#F0F7F5]">
                  অভিনন্দন, আপনি সফল!
                </h2>
                <p className="text-xs text-[#A3C2BB] max-w-sm mx-auto leading-relaxed pt-1">
                  আপনি <strong className="text-[#F0F7F5]">"{selectedHabit.name}"</strong>-এর প্রলোভন সামলে নিয়েছেন। প্রতিবার যখন আপনি এভাবে তাড়না নিয়ন্ত্রণ করেন, আপনার মস্তিষ্ক শক্তিশালী নিউরাল ডিসিপ্লিন তৈরি করে।
                </p>
              </div>

              <div className="bg-[#0F2623] p-3.5 rounded-2xl border border-[#2B5852] text-xs text-left space-y-1">
                <span className="text-[#A3C2BB] block font-medium">আপনার অ্যাকাউন্টেবিলিটি স্মারক:</span>
                <span className="text-[#F0F7F5] font-semibold">
                  "{selectedHabit.accountabilityNote || 'সচেতন থাকার সুন্দর চেষ্টা'}"
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold rounded-2xl text-sm shadow-lg shadow-[#2DD4BF]/20 transition-all"
              >
                পর্দায় ফিরে যান
              </button>
            </motion.div>
          ) : (
            /* STEP 2: 60-Second Fullscreen Active Timer */
            <div className="text-center space-y-6 py-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 inline-block mb-1">
                  {selectedHabit.name} - এর তাড়না সামলানো হচ্ছে
                </span>
                <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
                  {selectedHabit.cravingRedirect || '৬০ সেকেন্ড গভীর শ্বাসের ব্যায়াম'}
                </h3>
              </div>

              {/* Big Circular Countdown Display */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                {/* SVG Ring Background */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="78"
                    stroke="#0F2623"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="78"
                    stroke="#2DD4BF"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={490}
                    strokeDashoffset={490 - (490 * (60 - timeLeft)) / 60}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
                  <span className="font-heading text-4xl font-extrabold text-[#F0F7F5] tracking-tight">
                    {timeLeft}
                  </span>
                  <span className="text-[11px] font-semibold text-[#2DD4BF]">সেকেন্ড বাকি</span>
                </div>
              </div>

              {/* Breathing / Encouragement Prompt */}
              <div className="bg-[#0F2623] p-3 rounded-2xl border border-[#2B5852] text-xs text-[#A3C2BB] flex items-center justify-center gap-2">
                <Wind className="w-4 h-4 text-[#2DD4BF] animate-pulse" />
                <span>
                  {timeLeft > 40
                    ? 'ধীরে নিঃশ্বাস নিন... তাড়না ক্ষণস্থায়ী।'
                    : timeLeft > 20
                    ? 'আপনি দারুণ করছেন! আর কিছু মুহূর্ত...'
                    : 'প্রায় শেষ! বিজয়ের দ্বারপ্রান্তে...'}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetTimer}
                  className="p-3 bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-[#A3C2BB] hover:text-[#F0F7F5] rounded-xl transition-colors"
                  title="রিসেট"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePause}
                  className="py-3 px-6 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-[#2DD4BF]/20 transition-all"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 fill-[#0F2623]" />
                      <span>পজ করুন</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-[#0F2623]" />
                      <span>শুরু করুন</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleFinishEarly}
                  className="py-3 px-4 bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-[#2DD4BF] font-semibold rounded-xl text-xs"
                >
                  সম্পূর্ণ হয়েছে
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
