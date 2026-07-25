import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmartAlarm, User } from '../../types';
import { storage } from '../../db/storage';
import {
  Bell,
  Plus,
  Trash2,
  X,
  Volume2,
  Wind,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SmartAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const SmartAlarmModal: React.FC<SmartAlarmModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [alarms, setAlarms] = useState<SmartAlarm[]>([]);
  const [activeRingingAlarm, setActiveRingingAlarm] = useState<SmartAlarm | null>(null);

  // Micro action state
  const [breathCount, setBreathCount] = useState<number>(0);
  const [stretchTimer, setStretchTimer] = useState<number>(10);
  const [isStretchActive, setIsStretchActive] = useState<boolean>(false);
  const [typedIdentity, setTypedIdentity] = useState<string>('');

  // New Alarm Form state
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newTime, setNewTime] = useState<string>('07:00');
  const [newLabel, setNewLabel] = useState<string>('সকালের অভ্যাস সংকেত');
  const [newMicroAction, setNewMicroAction] = useState<'BREATHING' | 'STRETCH' | 'IDENTITY_TYPING'>('BREATHING');

  useEffect(() => {
    if (isOpen) {
      setAlarms(storage.getAlarms());
    }
  }, [isOpen]);

  // Handle stretch countdown
  useEffect(() => {
    let interval: any = null;
    if (isStretchActive && stretchTimer > 0) {
      interval = setInterval(() => {
        setStretchTimer((prev) => prev - 1);
      }, 1000);
    } else if (stretchTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isStretchActive, stretchTimer]);

  const handleToggleAlarm = (id: number) => {
    const updated = alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
    setAlarms(updated);
    storage.saveAlarms(updated);
  };

  const handleDeleteAlarm = (id: number) => {
    const updated = alarms.filter((a) => a.id !== id);
    setAlarms(updated);
    storage.saveAlarms(updated);
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SmartAlarm = {
      id: Date.now(),
      time: newTime,
      label: newLabel.trim() || 'স্মার্ট অভ্যাস এলার্ম',
      enabled: true,
      microActionType: newMicroAction,
    };

    const updated = [...alarms, created];
    setAlarms(updated);
    storage.saveAlarms(updated);

    setIsAddingNew(false);
    setNewLabel('');
  };

  const startTestRinging = (alarm: SmartAlarm) => {
    setActiveRingingAlarm(alarm);
    setBreathCount(0);
    setStretchTimer(10);
    setIsStretchActive(false);
    setTypedIdentity('');
  };

  const requiredIdentityText =
    user?.identityStatements[0] || 'আমি প্রতিদিন ক্ষুদ্র পদে এগিয়ে চলি';

  const isMicroActionCompleted = () => {
    if (!activeRingingAlarm) return false;
    switch (activeRingingAlarm.microActionType) {
      case 'BREATHING':
        return breathCount >= 5;
      case 'STRETCH':
        return stretchTimer === 0;
      case 'IDENTITY_TYPING':
        return typedIdentity.trim().toLowerCase() === requiredIdentityText.trim().toLowerCase();
      default:
        return true;
    }
  };

  const dismissActiveAlarm = () => {
    if (!isMicroActionCompleted()) return;
    setActiveRingingAlarm(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-[#0000] z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#173834] border border-[#2B5852] rounded-2xl w-full max-w-lg p-5 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#2B5852]/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
                  Smart Alarm & Anti-Snooze
                </h3>
                <p className="text-xs text-[#A3C2BB]">
                  স্নুজ বন্ধ করতে মাইক্রো-অ্যাকশন সম্পন্ন করতে হবে
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#A3C2BB] hover:text-[#F0F7F5] bg-[#0F2623] rounded-lg border border-[#2B5852]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Ringing Alarm View (Anti-Snooze Simulation) */}
          {activeRingingAlarm ? (
            <div className="py-6 space-y-5 text-center my-auto">
              <div className="animate-bounce inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border-2 border-amber-400/50 shadow-lg shadow-amber-500/30">
                <Volume2 className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="text-2xl font-bold font-heading text-[#F0F7F5] block">
                  ⏰ {activeRingingAlarm.time} - {activeRingingAlarm.label}
                </span>
                <p className="text-xs text-amber-300 font-medium mt-1">
                  এলার্ম বন্ধ করতে নিচের মাইক্রো-অ্যাকশনটি সম্পন্ন করুন:
                </p>
              </div>

              {/* Micro Action Specific Controls */}
              {activeRingingAlarm.microActionType === 'BREATHING' && (
                <div className="bg-[#0F2623] border border-[#2B5852] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#2DD4BF]">
                    <Wind className="w-4 h-4" />
                    <span>৫ বার গভীর শ্বাস নিন ও ছাডুন</span>
                  </div>

                  <div className="text-2xl font-bold text-[#F0F7F5]">
                    {breathCount} / 5
                  </div>

                  <button
                    onClick={() => setBreathCount((prev) => Math.min(5, prev + 1))}
                    disabled={breathCount >= 5}
                    className="py-2.5 px-6 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold text-xs rounded-xl shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {breathCount >= 5 ? 'সমাপ্ত! ✅' : 'গভীর শ্বাস গ্রহণ করলাম 🌬️'}
                  </button>
                </div>
              )}

              {activeRingingAlarm.microActionType === 'STRETCH' && (
                <div className="bg-[#0F2623] border border-[#2B5852] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#2DD4BF]">
                    <Activity className="w-4 h-4" />
                    <span>১০ সেকেন্ড বডি স্ট্রেচ করুন</span>
                  </div>

                  <div className="text-3xl font-extrabold text-[#F0F7F5]">
                    {stretchTimer}s
                  </div>

                  {!isStretchActive ? (
                    <button
                      onClick={() => setIsStretchActive(true)}
                      className="py-2.5 px-6 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold text-xs rounded-xl shadow-md active:scale-95"
                    >
                      স্ট্রেচিং শুরু করুন
                    </button>
                  ) : (
                    <span className="text-xs text-[#A3C2BB] block font-medium animate-pulse">
                      হাত ও শরীর প্রসারিত করে রাখুন...
                    </span>
                  )}
                </div>
              )}

              {activeRingingAlarm.microActionType === 'IDENTITY_TYPING' && (
                <div className="bg-[#0F2623] border border-[#2B5852] p-4 rounded-2xl space-y-3 text-left">
                  <label className="text-xs text-[#A3C2BB] font-medium block text-center">
                    নিচের পরিচয় বার্তাটি টাইপ করে মিলান:
                  </label>
                  <div className="bg-[#173834] p-2.5 rounded-xl text-center text-xs text-[#2DD4BF] font-semibold border border-[#2B5852]">
                    "{requiredIdentityText}"
                  </div>

                  <input
                    type="text"
                    value={typedIdentity}
                    onChange={(e) => setTypedIdentity(e.target.value)}
                    placeholder="হুবহু টাইপ করুন..."
                    className="w-full bg-[#173834] border border-[#2B5852] focus:border-[#2DD4BF] text-[#F0F7F5] text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>
              )}

              {/* Dismiss Button */}
              <button
                onClick={dismissActiveAlarm}
                disabled={!isMicroActionCompleted()}
                className="w-full py-3 bg-[#2DD4BF] hover:bg-[#26bba8] disabled:opacity-40 text-[#0F2623] font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                {isMicroActionCompleted() ? 'এলার্ম বন্ধ করুন ✅' : 'মাইক্রো-অ্যাকশন অসমাপ্ত 🔒'}
              </button>
            </div>
          ) : (
            /* Alarm List & Form */
            <div className="overflow-y-auto space-y-4 py-4 flex-1 pr-1">
              {/* Existing Alarms */}
              <div className="space-y-3">
                {alarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className="bg-[#0F2623] border border-[#2B5852] rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-lg font-bold text-[#F0F7F5]">
                          {alarm.time}
                        </span>
                        <span className="text-[10px] bg-[#173834] text-[#2DD4BF] px-2 py-0.5 rounded-md border border-[#2B5852]">
                          {alarm.microActionType === 'BREATHING' && '🌬️ ৫ শ্বাস'}
                          {alarm.microActionType === 'STRETCH' && '🧘 ১০s স্ট্রেচ'}
                          {alarm.microActionType === 'IDENTITY_TYPING' && '✍️ আইডেন্টিটি টাইপিং'}
                        </span>
                      </div>
                      <p className="text-xs text-[#A3C2BB]">{alarm.label}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startTestRinging(alarm)}
                        className="py-1 px-2.5 bg-[#173834] hover:bg-[#23504B] text-[#2DD4BF] text-[10px] font-bold rounded-lg border border-[#2B5852]"
                        title="এলার্ম ট্রিগার টেস্ট করুন"
                      >
                        টেস্ট ট্রিগার
                      </button>

                      {/* Toggle switch */}
                      <button
                        onClick={() => handleToggleAlarm(alarm.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          alarm.enabled ? 'bg-[#2DD4BF]' : 'bg-[#173834] border border-[#2B5852]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-[#0F2623] transition-transform ${
                            alarm.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleDeleteAlarm(alarm.id)}
                        className="p-1.5 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create New Alarm Form Toggle */}
              {isAddingNew ? (
                <form
                  onSubmit={handleCreateAlarm}
                  className="bg-[#0F2623] border border-[#2B5852] rounded-xl p-4 space-y-3"
                >
                  <h4 className="text-xs font-bold text-[#2DD4BF] uppercase">
                    নতুন স্মার্ট এলার্ম যোগ করুন
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#A3C2BB] block mb-1">সময়:</label>
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full bg-[#173834] border border-[#2B5852] text-[#F0F7F5] text-xs rounded-xl p-2.5 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#A3C2BB] block mb-1">লেবেল:</label>
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="যেমন: পড়ার অভ্যাস"
                        className="w-full bg-[#173834] border border-[#2B5852] text-[#F0F7F5] text-xs rounded-xl p-2.5 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#A3C2BB] block mb-1">
                      Anti-Snooze মাইক্রো-অ্যাকশন টাইপ:
                    </label>
                    <select
                      value={newMicroAction}
                      onChange={(e: any) => setNewMicroAction(e.target.value)}
                      className="w-full bg-[#173834] border border-[#2B5852] text-[#F0F7F5] text-xs rounded-xl p-2.5 outline-none"
                    >
                      <option value="BREATHING">🌬️ ৫ বার গভীর শ্বাস গ্রহণ (Breathing)</option>
                      <option value="STRETCH">🧘 ১০ সেকেন্ড শারীরিক স্ট্রেচিং (Stretch)</option>
                      <option value="IDENTITY_TYPING">✍️ কাঙ্ক্ষিত পরিচয় বাক্য টাইপিং (Identity)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="py-2 px-3 text-xs text-[#A3C2BB]"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-[#2DD4BF] text-[#0F2623] font-bold text-xs rounded-xl"
                    >
                      সেভ করুন
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="w-full py-3 bg-[#0F2623] hover:bg-[#173834] border border-dashed border-[#2B5852] hover:border-[#2DD4BF] text-[#2DD4BF] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন এলার্ম যোগ করুন</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
