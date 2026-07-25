import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppSettings, ThemeMode, User } from '../../types';
import { storage } from '../../db/storage';
import {
  Palette,
  Globe,
  Shield,
  BellRing,
  Smartphone,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  Bell,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SettingsScreenProps {
  user: User | null;
  onOpenAlarmModal: () => void;
  onResetOnboarding: () => void;
  onSettingsChanged?: (settings: AppSettings) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onOpenAlarmModal,
  onResetOnboarding,
  onSettingsChanged,
}) => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'Wisemind',
    language: 'BN',
    focusModeActive: false,
    cueRemindersEnabled: true,
    distractionBlockerEnabled: true,
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const current = storage.getSettings();
    setSettings(current);
  }, []);

  const handleThemeChange = (theme: ThemeMode) => {
    const updated = { ...settings, theme };
    setSettings(updated);
    storage.saveSettings(updated);
    if (onSettingsChanged) onSettingsChanged(updated);
    triggerSavedNotice();
  };

  const handleLanguageToggle = (language: 'BN' | 'EN') => {
    const updated = { ...settings, language };
    setSettings(updated);
    storage.saveSettings(updated);
    if (onSettingsChanged) onSettingsChanged(updated);
    triggerSavedNotice();
  };

  const handleToggleSetting = (key: keyof AppSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    storage.saveSettings(updated);
    if (onSettingsChanged) onSettingsChanged(updated);
    triggerSavedNotice();
  };

  const triggerSavedNotice = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const themes: { id: ThemeMode; name: string; desc: string; color: string; border: string }[] = [
    {
      id: 'Wisemind',
      name: 'Wisemind (Emerald)',
      desc: 'শান্ত ও গভীর এমারেল্ড গ্রিন থিম',
      color: 'bg-[#173834]',
      border: 'border-[#2DD4BF]',
    },
    {
      id: 'Sagegrove',
      name: 'Sagegrove (Sage Green)',
      desc: 'কোমল প্রাকৃতিক সবুজ থিম',
      color: 'bg-[#1A2E26]',
      border: 'border-[#34D399]',
    },
    {
      id: 'Nightscholar',
      name: 'Nightscholar (Midnight)',
      desc: 'গভীর রাতের স্টাডি থিম',
      color: 'bg-[#0F172A]',
      border: 'border-[#38BDF8]',
    },
    {
      id: 'Claymind',
      name: 'Claymind (Terracotta)',
      desc: 'উষ্ণ মাটির রঙের থিম',
      color: 'bg-[#2D1E1A]',
      border: 'border-[#F97316]',
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Settings Header */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#F0F7F5]">
            অ্যাপ সেটিংস ও কাস্টমাইজেশন
          </h2>
          <p className="font-body text-xs text-[#A3C2BB] mt-0.5">
            থিম, ভাষা, ডিস্ট্র্যাকশন কন্ট্রোল ও এলার্ম কনফিগারেশন করুন।
          </p>
        </div>

        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 bg-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#2DD4BF]/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>সংরক্ষিত!</span>
          </motion.div>
        )}
      </div>

      {/* Theme Switcher Section */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#2DD4BF]" />
          <div>
            <h3 className="font-heading text-base font-bold text-[#F0F7F5]">
              থিম সুইচার (Theme Mode)
            </h3>
            <p className="text-xs text-[#A3C2BB]">আপনার পছন্দসই ভিজ্যুয়াল মুড বেছে নিন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex items-center gap-3 ${
                settings.theme === t.id
                  ? `${t.border} bg-[#0F2623] shadow-md ring-1 ring-[#2DD4BF]/50`
                  : 'border-[#2B5852] bg-[#0F2623]/60 hover:bg-[#0F2623]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${t.color} border border-white/20 shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
                {t.id[0]}
              </div>
              <div className="flex-1">
                <span className="font-bold text-xs text-[#F0F7F5] block">{t.name}</span>
                <span className="text-[10px] text-[#A3C2BB]">{t.desc}</span>
              </div>
              {settings.theme === t.id && (
                <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Language Toggle Section */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#2DD4BF]" />
            <div>
              <h3 className="font-heading text-base font-bold text-[#F0F7F5]">
                ভাষা নির্বাচন (Language)
              </h3>
              <p className="text-xs text-[#A3C2BB]">ইন্টারফেসের জন্য ভাষা পছন্দ করুন</p>
            </div>
          </div>

          <div className="flex bg-[#0F2623] p-1 rounded-xl border border-[#2B5852]">
            <button
              onClick={() => handleLanguageToggle('BN')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                settings.language === 'BN'
                  ? 'bg-[#2DD4BF] text-[#0F2623]'
                  : 'text-[#A3C2BB] hover:text-[#F0F7F5]'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => handleLanguageToggle('EN')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                settings.language === 'EN'
                  ? 'bg-[#2DD4BF] text-[#0F2623]'
                  : 'text-[#A3C2BB] hover:text-[#F0F7F5]'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Distraction Control Settings */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#2B5852]/80 pb-3">
          <Shield className="w-5 h-5 text-[#2DD4BF]" />
          <div>
            <h3 className="font-heading text-base font-bold text-[#F0F7F5]">
              ডিস্ট্র্যাকশন কন্ট্রোল (Distraction Control)
            </h3>
            <p className="text-xs text-[#A3C2BB]">
              মনোযোগ ও অভ্যাস রক্ষার জন্য ডিজিটাল বাধার ফিল্টার
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Focus Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#0F2623] rounded-xl border border-[#2B5852]">
            <div className="flex items-center gap-2.5">
              <EyeOff className="w-4 h-4 text-[#2DD4BF]" />
              <div>
                <span className="text-xs font-bold text-[#F0F7F5] block">
                  ফোকাস মোড (Focus Mode)
                </span>
                <span className="text-[10px] text-[#A3C2BB]">
                  যে কোনো অতিরিক্ত ভিজ্যুয়াল মনোযোগ বিচ্যুতি দূর রাখে
                </span>
              </div>
            </div>

            <button
              onClick={() => handleToggleSetting('focusModeActive')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.focusModeActive ? 'bg-[#2DD4BF]' : 'bg-[#173834] border border-[#2B5852]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0F2623] transition-transform ${
                  settings.focusModeActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Cue Reminders Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#0F2623] rounded-xl border border-[#2B5852]">
            <div className="flex items-center gap-2.5">
              <BellRing className="w-4 h-4 text-[#2DD4BF]" />
              <div>
                <span className="text-xs font-bold text-[#F0F7F5] block">
                  পরিবেশগত কিউ নোটিফিকেশন (Environment Cue Reminders)
                </span>
                <span className="text-[10px] text-[#A3C2BB]">
                  অভ্যাস পালনের উপযুক্ত সময়ে পরিবেশগত সংকেত
                </span>
              </div>
            </div>

            <button
              onClick={() => handleToggleSetting('cueRemindersEnabled')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.cueRemindersEnabled ? 'bg-[#2DD4BF]' : 'bg-[#173834] border border-[#2B5852]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0F2623] transition-transform ${
                  settings.cueRemindersEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Distraction Blocker Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#0F2623] rounded-xl border border-[#2B5852]">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#2DD4BF]" />
              <div>
                <span className="text-xs font-bold text-[#F0F7F5] block">
                  বদঅভ্যাসের ট্রিগার ব্লকার (Distraction Blocker)
                </span>
                <span className="text-[10px] text-[#A3C2BB]">
                  বদঅভ্যাসের ক্রেভিং উঠলে স্ক্রোলিং থামানোর প্রোটেকশন
                </span>
              </div>
            </div>

            <button
              onClick={() => handleToggleSetting('distractionBlockerEnabled')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.distractionBlockerEnabled
                  ? 'bg-[#2DD4BF]'
                  : 'bg-[#173834] border border-[#2B5852]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0F2623] transition-transform ${
                  settings.distractionBlockerEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Smart Alarm Quick Entry */}
      <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-[#F0F7F5]">
              স্মার্ট এলার্ম মেকানিজম (Anti-Snooze)
            </h3>
            <p className="text-xs text-[#A3C2BB]">
              মাইক্রো-অ্যাকশন সম্পন্ন করে এলার্ম বন্ধের সেটিংস
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAlarmModal}
          className="py-2 px-4 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          এলার্ম খুলুন
        </button>
      </div>

      {/* Reset Data Option */}
      <div className="bg-[#173834]/60 border border-[#2B5852] rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#F0F7F5] block">
            ডেটা ও অনবোর্ডিং রিসেট (Reset Data)
          </span>
          <span className="text-[10px] text-[#A3C2BB]">
            অ্যাপ ডেটা রিসেট করে পুনরায় অনবোর্ডিং শুরু করুন
          </span>
        </div>

        <button
          onClick={onResetOnboarding}
          className="py-2 px-3 bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-red-400 hover:text-red-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>রিসেট করুন</span>
        </button>
      </div>
    </div>
  );
};
