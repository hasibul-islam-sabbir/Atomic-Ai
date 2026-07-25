import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit } from '../../types';
import { X, ShieldAlert, Zap, AlertTriangle, Check, Lock, Compass } from 'lucide-react';

interface AddBadHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (badHabitData: {
    id?: number;
    name: string;
    frictionPlan: string;
    cravingRedirect: string;
    accountabilityNote: string;
  }) => void;
  editingHabit?: Habit | null;
}

const PRESET_CRAVING_REDIRECTS = [
  '৬০ সেকেন্ড গভীর শ্বাসের ব্যায়াম',
  '১ মিনিট দ্রুত হাঁটা বা স্ট্রেচিং',
  '১ গ্লাস ঠাণ্ডা পানি ধীরগতিতে খাওয়া',
  'নিজের Identity Statement সশব্দে পড়া',
  'কাস্টম অ্যাকশন লিখুন...',
];

export const AddBadHabitModal: React.FC<AddBadHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHabit,
}) => {
  const [name, setName] = useState('');
  const [frictionPlan, setFrictionPlan] = useState('');
  const [selectedRedirect, setSelectedRedirect] = useState(PRESET_CRAVING_REDIRECTS[0]);
  const [customRedirect, setCustomRedirect] = useState('');
  const [accountabilityNote, setAccountabilityNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name || '');
      setFrictionPlan(editingHabit.frictionPlan || '');
      if (editingHabit.cravingRedirect && PRESET_CRAVING_REDIRECTS.includes(editingHabit.cravingRedirect)) {
        setSelectedRedirect(editingHabit.cravingRedirect);
        setCustomRedirect('');
      } else if (editingHabit.cravingRedirect) {
        setSelectedRedirect('কাস্টম অ্যাকশন লিখুন...');
        setCustomRedirect(editingHabit.cravingRedirect);
      } else {
        setSelectedRedirect(PRESET_CRAVING_REDIRECTS[0]);
        setCustomRedirect('');
      }
      setAccountabilityNote(editingHabit.accountabilityNote || '');
    } else {
      setName('');
      setFrictionPlan('');
      setSelectedRedirect(PRESET_CRAVING_REDIRECTS[0]);
      setCustomRedirect('');
      setAccountabilityNote('');
    }
    setError(null);
  }, [editingHabit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('বদঅভ্যাসের নাম আবশ্যক');
      return;
    }

    const finalRedirect =
      selectedRedirect === 'কাস্টম অ্যাকশন লিখুন...'
        ? customRedirect.trim()
        : selectedRedirect;

    if (!finalRedirect) {
      setError('একটি Craving Redirect নির্বাচন বা টাইপ করুন');
      return;
    }

    onSave({
      id: editingHabit ? editingHabit.id : undefined,
      name: name.trim(),
      frictionPlan: frictionPlan.trim() || 'ট্রিগার এড়িয়ে চলা ও বাধা সৃষ্টি করা',
      cravingRedirect: finalRedirect,
      accountabilityNote: accountabilityNote.trim() || 'সচেতন হয়ে পুনরায় ট্র্যাকে ফেরা',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#173834] border border-[#2B5852] rounded-2xl w-full max-w-lg p-5 shadow-2xl my-8 text-[#E8F1EF] relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2B5852]/60 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-[#F0F7F5]">
                  {editingHabit ? 'বদঅভ্যাস ফ্লো এডিট' : 'বদঅভ্যাস রোধ ফ্লো (BREAK)'}
                </h2>
                <p className="text-xs text-[#A3C2BB]">Atomic Habits: ৩য় আইন - কঠিন করা (Make it Difficult)</p>
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
                ১. বদঅভ্যাসের নাম (Bad Habit Name) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="যেমন: গভীর রাতে ফোন চালানো, অতিরিক্ত মিষ্টি খাওয়া"
                className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-amber-400 focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
              />
            </div>

            {/* 2. Friction Plan Input */}
            <div>
              <label className="block text-xs font-semibold text-[#A3C2BB] mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                ২. ফ্রিকশন প্ল্যান (Friction Plan)
              </label>
              <p className="text-[11px] text-[#81A8A0] mb-1.5">
                এই অভ্যাসের ট্রিগার কমাতে কী কঠিন করবেন? (Increase Friction)
              </p>
              <input
                type="text"
                value={frictionPlan}
                onChange={(e) => setFrictionPlan(e.target.value)}
                placeholder="যেমন: ফোন ঘুমানোর ২ ঘণ্টা আগে অন্য রুমে চার্জে রেখে দেব"
                className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-amber-400 focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
              />
            </div>

            {/* 3. Craving Redirect Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#A3C2BB] mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#2DD4BF]" />
                ৩. ক্র্যাভিং রিডাইরেক্ট (Craving Redirect) <span className="text-red-400">*</span>
              </label>
              <p className="text-[11px] text-[#81A8A0] mb-1.5">
                ইচ্ছা বা তাড়না (Urge) উঠলে ইনস্ট্যান্ট কী মাইক্রো-অ্যাকশন করবেন?
              </p>
              <select
                value={selectedRedirect}
                onChange={(e) => setSelectedRedirect(e.target.value)}
                className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] rounded-xl px-3.5 py-2.5 text-sm transition-colors mb-2"
              >
                {PRESET_CRAVING_REDIRECTS.map((item, idx) => (
                  <option key={idx} value={item} className="bg-[#0F2623] text-[#F0F7F5]">
                    {item}
                  </option>
                ))}
              </select>

              {selectedRedirect === 'কাস্টম অ্যাকশন লিখুন...' && (
                <input
                  type="text"
                  value={customRedirect}
                  onChange={(e) => setCustomRedirect(e.target.value)}
                  placeholder="যেমন: ২০বার হাত দিয়ে ঠান্ডা পানি মুখে দেব"
                  className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
                />
              )}
            </div>

            {/* 4. Accountability Note */}
            <div>
              <label className="block text-xs font-semibold text-[#A3C2BB] mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                ৪. অ্যাকাউন্টেবিলিটি নোট (Accountability Note)
              </label>
              <input
                type="text"
                value={accountabilityNote}
                onChange={(e) => setAccountabilityNote(e.target.value)}
                placeholder="যদি অভ্যাসটি ভেঙে ফেলো তবে কী দায়বদ্ধতা নেবে? (যেমন: ১০টি পুশআপ দেব)"
                className="w-full bg-[#0F2623] border border-[#2B5852] focus:border-red-400 focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
              />
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
                className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-[#0F2623] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 transition-all active:scale-[0.99]"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{editingHabit ? 'আপডেট সেভ করুন' : 'বদঅভ্যাস রোধ ফ্লো সেভ করুন'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
