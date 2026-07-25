import React from 'react';
import { motion } from 'motion/react';
import {
  CheckSquare,
  BarChart2,
  Bot,
  Calendar,
  Settings,
  Flame,
} from 'lucide-react';

export type TabType = 'HOME' | 'TRACKER' | 'MENTOR' | 'REFLECTION' | 'SETTINGS';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenUrgeModal: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenUrgeModal,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'HOME', label: 'Home', icon: CheckSquare },
    { id: 'TRACKER', label: 'Tracker', icon: BarChart2 },
    { id: 'MENTOR', label: 'Mentor', icon: Bot },
    { id: 'REFLECTION', label: 'Reflection', icon: Calendar },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F2623]/95 backdrop-blur-md border-t border-[#2B5852] py-2 px-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive ? 'text-[#2DD4BF]' : 'text-[#A3C2BB] hover:text-[#F0F7F5]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-[#2DD4BF]/10 rounded-xl border border-[#2DD4BF]/30"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 stroke-[2] ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* Quick Urge Surfing Floating Quick Trigger */}
        <button
          onClick={onOpenUrgeModal}
          className="absolute -top-12 right-2 bg-gradient-to-r from-amber-500 to-amber-400 text-[#0F2623] font-extrabold px-3 py-2 rounded-full shadow-lg shadow-amber-500/30 border border-amber-300 flex items-center gap-1 text-[11px] uppercase transition-all active:scale-95"
          title="Urge Surfing টাইমার সক্রিয় করুন"
        >
          <Flame className="w-4 h-4 fill-[#0F2623]" />
          <span>⚡ Urge</span>
        </button>
      </div>
    </div>
  );
};
