import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, LawFocus } from '../../types';
import { AddHabitModal } from './AddHabitModal';
import {
  Plus,
  Sparkles,
  Layers,
  Clock,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Tag,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface HabitListScreenProps {
  habits: Habit[];
  onSaveHabit: (habitData: {
    id?: number;
    name: string;
    stackAnchor: string;
    twoMinuteVersion: string;
    environmentCue: string;
    lawFocus: LawFocus;
  }) => void;
  onDeleteHabit: (id: number) => void;
}

export const HabitListScreen: React.FC<HabitListScreenProps> = ({
  habits,
  onSaveHabit,
  onDeleteHabit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const buildHabits = habits.filter((h) => h.type === 'BUILD');

  const handleOpenAdd = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    onDeleteHabit(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Add Button */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1D443F] text-[#2DD4BF] text-xs font-semibold mb-1 border border-[#2B5852]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ভালো অভ্যাস ম্যানেজার (BUILD)</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F0F7F5]">
            আপনার গঠনমূলক অভ্যাসসমূহ
          </h2>
          <p className="font-body text-xs text-[#A3C2BB] mt-0.5">
            Atomic Habits-এর ২-মিনিট রুল এবং হ্যাবিট স্ট্যাকিং ফ্রেমওয়ার্ক দিয়ে তৈরি।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto py-2.5 px-4 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold rounded-xl shadow-lg shadow-[#2DD4BF]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-heading text-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>নতুন অভ্যাস গড়ুন</span>
        </button>
      </div>

      {/* Habit Cards Grid / List */}
      {buildHabits.length === 0 ? (
        <div className="bg-[#173834]/40 border border-dashed border-[#2B5852] rounded-2xl p-8 text-center my-4">
          <div className="w-12 h-12 rounded-full bg-[#1D443F] text-[#2DD4BF] flex items-center justify-center mx-auto mb-3 border border-[#2B5852]">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#F0F7F5] mb-1">
            এখনো কোনো ভালো অভ্যাস যোগ করেননি
          </h3>
          <p className="text-xs text-[#A3C2BB] max-w-sm mx-auto mb-4">
            ছোট ছোট পরিবর্তনের মাধ্যমে বড় সাফল্য অর্জন করুন। আজই আপনার প্রথম ২-মিনিট অভ্যাস তৈরি করুন।
          </p>
          <button
            onClick={handleOpenAdd}
            className="py-2 px-4 bg-[#2DD4BF] text-[#0F2623] text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>প্রথম অভ্যাস তৈরি করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {buildHabits.map((habit, idx) => (
              <motion.div
                key={`build-${habit.id}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#173834] border border-[#2B5852] hover:border-[#2DD4BF]/60 transition-all rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 relative group"
              >
                {/* Header: Name & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#F0F7F5] leading-snug">
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1D443F] text-[#2DD4BF] border border-[#2B5852]">
                        <Tag className="w-3 h-3" />
                        {habit.lawFocus === 'OBVIOUS' ? '১ম আইন: OBVIOUS' : '৩য় আইন: EASY'}
                      </span>
                    </div>
                  </div>

                  {/* Edit / Delete Buttons */}
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

                {/* Details Section */}
                <div className="space-y-2 bg-[#0F2623] p-3 rounded-xl border border-[#2B5852]/60 text-xs">
                  {/* Stack Anchor */}
                  {habit.stackAnchor && (
                    <div className="flex items-start gap-2 text-[#E8F1EF]">
                      <Layers className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#A3C2BB] font-medium block text-[10px]">হ্যাবিট স্ট্যাক (Anchor Routine):</span>
                        <span className="font-semibold text-[#F0F7F5]">
                          "{habit.stackAnchor}"-এর পর
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2-Minute Version */}
                  {habit.twoMinuteVersion && (
                    <div className="flex items-start gap-2 text-[#E8F1EF] pt-1 border-t border-[#2B5852]/40">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#A3C2BB] font-medium block text-[10px]">⚡ ২-মিনিট রুল ভার্সন:</span>
                        <span className="font-semibold text-amber-300">
                          {habit.twoMinuteVersion}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Environment Cue */}
                  {habit.environmentCue && (
                    <div className="flex items-start gap-2 text-[#E8F1EF] pt-1 border-t border-[#2B5852]/40">
                      <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#A3C2BB] font-medium block text-[10px]">🌱 পরিবেশ প্রস্তুতি (Cue):</span>
                        <span className="text-[#E8F1EF]">{habit.environmentCue}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Delete Overlay */}
                {deleteConfirmId === habit.id && (
                  <div className="absolute inset-0 bg-[#0F2623]/95 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center text-center z-10 space-y-3 border border-red-500/40">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <p className="text-xs text-[#F0F7F5] font-semibold">
                      আপনি কি নিশ্চিত যে "{habit.name}" অভ্যাসটি মুছে ফেলতে চান?
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

      {/* Modal Integration */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveHabit}
        editingHabit={editingHabit}
      />
    </div>
  );
};
