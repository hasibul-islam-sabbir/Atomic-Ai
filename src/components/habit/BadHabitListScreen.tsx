import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit } from '../../types';
import { AddBadHabitModal } from './AddBadHabitModal';
import { UrgeTimerModal } from './UrgeTimerModal';
import {
  Plus,
  ShieldAlert,
  Flame,
  Lock,
  Compass,
  AlertTriangle,
  Pencil,
  Trash2,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface BadHabitListScreenProps {
  habits: Habit[];
  onSaveBadHabit: (badHabitData: {
    id?: number;
    name: string;
    frictionPlan: string;
    cravingRedirect: string;
    accountabilityNote: string;
  }) => void;
  onDeleteHabit: (id: number) => void;
}

export const BadHabitListScreen: React.FC<BadHabitListScreenProps> = ({
  habits,
  onSaveBadHabit,
  onDeleteHabit,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUrgeModalOpen, setIsUrgeModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const badHabits = habits.filter((h) => h.type === 'BREAK');

  const handleOpenAdd = () => {
    setEditingHabit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: number) => {
    onDeleteHabit(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Urge / Add Action Bar */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-1 border border-amber-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>বদঅভ্যাস রোধ মডিউল (BREAK)</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F0F7F5]">
            আপনার প্রতিরোধমূলক অভ্যাসসমূহ
          </h2>
          <p className="font-body text-xs text-[#A3C2BB] mt-0.5">
            ফ্রিকশন প্ল্যান এবং ৬০-সেকেন্ডের ক্র্যাভিং রিডাইরেক্ট দিয়ে ক্ষতিকর অভ্যাস রোধ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Urge Button */}
          <button
            onClick={() => setIsUrgeModalOpen(true)}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#0F2623] font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] font-heading text-xs"
          >
            <Flame className="w-4 h-4 fill-[#0F2623]" />
            <span>⚡ Urge বাটন</span>
          </button>

          {/* Add Bad Habit Button */}
          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-3 bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-[#F0F7F5] font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-[#2DD4BF]" />
            <span>নতুন যোগ</span>
          </button>
        </div>
      </div>

      {/* Bad Habit Cards Grid */}
      {badHabits.length === 0 ? (
        <div className="bg-[#173834]/40 border border-dashed border-[#2B5852] rounded-2xl p-8 text-center my-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#F0F7F5] mb-1">
            কোনো বদঅভ্যাস লিস্ট করা হয়নি
          </h3>
          <p className="text-xs text-[#A3C2BB] max-w-sm mx-auto mb-4">
            যে অভ্যাসগুলো আপনি ত্যাগ করতে চান, সেগুলোর জন্য ফ্রিকশন প্ল্যান এবং ক্র্যাভিং রিডাইরেক্ট তৈরি করে রাখুন।
          </p>
          <button
            onClick={handleOpenAdd}
            className="py-2 px-4 bg-amber-400 text-[#0F2623] text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>বদঅভ্যাস যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {badHabits.map((habit, idx) => (
              <motion.div
                key={`break-${habit.id}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#173834] border border-[#2B5852] hover:border-amber-400/60 transition-all rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 relative group"
              >
                {/* Header: Name & Action Buttons */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#F0F7F5] leading-snug">
                      {habit.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 mt-1">
                      <ShieldAlert className="w-3 h-3" />
                      BREAK TYPE
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(habit)}
                      className="p-1.5 text-[#A3C2BB] hover:text-[#2DD4BF] bg-[#0F2623]/80 hover:bg-[#0F2623] border border-[#2B5852] rounded-lg transition-colors"
                      title="এডিট করুন"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(habit.id)}
                      className="p-1.5 text-[#A3C2BB] hover:text-red-400 bg-[#0F2623]/80 hover:bg-[#0F2623] border border-[#2B5852] rounded-lg transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bad Habit Strategy Details */}
                <div className="space-y-2 bg-[#0F2623] p-3 rounded-xl border border-[#2B5852]/60 text-xs">
                  {/* Friction Plan */}
                  {habit.frictionPlan && (
                    <div className="flex items-start gap-2 text-[#E8F1EF]">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#A3C2BB] font-medium block text-[10px]">🔒 ফ্রিকশন প্ল্যান (Friction):</span>
                        <span className="font-medium text-[#F0F7F5]">
                          {habit.frictionPlan}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Craving Redirect */}
                  {habit.cravingRedirect && (
                    <div className="flex items-start gap-2 text-[#E8F1EF] pt-1 border-t border-[#2B5852]/40">
                      <Compass className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#A3C2BB] font-medium block text-[10px]">⚡ ক্র্যাভিং রিডাইরেক্ট (Urge Action):</span>
                        <span className="font-bold text-[#2DD4BF]">
                          {habit.cravingRedirect}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Accountability Note */}
                  {habit.accountabilityNote && (
                    <div className="flex items-start gap-2 text-[#E8F1EF] pt-1 border-t border-[#2B5852]/40">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#A3C2BB] font-medium block text-[10px]">⚖️ অ্যাকাউন্টেবিলিটি নোট:</span>
                        <span className="text-[#E8F1EF]">{habit.accountabilityNote}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Delete Overlay */}
                {deleteConfirmId === habit.id && (
                  <div className="absolute inset-0 bg-[#0F2623]/95 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center text-center z-10 space-y-3 border border-red-500/40">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <p className="text-xs text-[#F0F7F5] font-semibold">
                      আপনি কি নিশ্চিত যে "{habit.name}" বদঅভ্যাসটি মুছে ফেলতে চান?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="py-1.5 px-3 bg-[#173834] border border-[#2B5852] text-[#A3C2BB] text-xs rounded-lg font-medium"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={() => handleDelete(habit.id)}
                        className="py-1.5 px-3 bg-red-500 text-white text-xs rounded-lg font-bold shadow-sm"
                      >
                        হ্যাঁ, ডিলিট করুন
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AddBadHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onSaveBadHabit}
        editingHabit={editingHabit}
      />

      <UrgeTimerModal
        isOpen={isUrgeModalOpen}
        onClose={() => setIsUrgeModalOpen(false)}
        badHabits={badHabits}
        onOpenAddBadHabit={handleOpenAdd}
      />
    </div>
  );
};
