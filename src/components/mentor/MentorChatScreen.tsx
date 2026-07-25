import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, MentorConversation, Message, User } from '../../types';
import { storage } from '../../db/storage';
import {
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  Search,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface MentorChatScreenProps {
  user: User | null;
  habits: Habit[];
  onPatternUpdated?: (pattern: string) => void;
}

export const MentorChatScreen: React.FC<MentorChatScreenProps> = ({
  user,
  habits,
  onPatternUpdated,
}) => {
  const todayStr = storage.getTodayDateStr();
  const [conversation, setConversation] = useState<MentorConversation | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzingPattern, setIsAnalyzingPattern] = useState<boolean>(false);
  const [detectedPattern, setDetectedPattern] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, isLoading]);

  // Load or Initialize today's MentorConversation
  useEffect(() => {
    const existing = storage.getMentorConversationForDate(todayStr);
    const storedPattern = storage.getDetectedPattern();
    if (storedPattern) {
      setDetectedPattern(storedPattern);
    }

    if (existing) {
      setConversation(existing);
      if (existing.detectedPattern) {
        setDetectedPattern(existing.detectedPattern);
      }
    } else {
      // First open of the day! Trigger auto-generated Daily Check-in
      initializeDailyCheckIn();
    }
  }, [todayStr]);

  // Auto-generate Daily Check-in from today's CheckIn data
  const initializeDailyCheckIn = async () => {
    setIsLoading(true);

    const checkIns = storage.getCheckIns();
    const todayCheckIns = checkIns.filter((c) => c.date === todayStr);

    const doneCount = habits.filter(
      (h) => todayCheckIns.find((c) => c.habitId === h.id)?.status === 'DONE'
    ).length;
    const missedCount = habits.filter(
      (h) => todayCheckIns.find((c) => c.habitId === h.id)?.status === 'MISSED'
    ).length;

    const habitDetails = habits.map((h) => ({
      name: h.name,
      type: h.type,
      status: todayCheckIns.find((c) => c.habitId === h.id)?.status || 'NOT_CHECKED',
    }));

    try {
      const res = await fetch('/api/mentor/auto-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todayDate: todayStr,
          doneCount,
          missedCount,
          totalHabits: habits.length,
          habitDetails,
          identityStatements: user?.identityStatements || [],
        }),
      });

      const data = await res.json();
      const initialReply = data.reply || 'আজকের দিনে আপনার অভ্যাসের সূচনা কেমন হচ্ছে?';

      const initialMessage: Message = {
        sender: 'AI',
        text: initialReply,
        timestamp: Date.now(),
      };

      const newConversation: MentorConversation = {
        id: Date.now(),
        date: todayStr,
        type: 'DAILY',
        messages: [initialMessage],
        detectedPattern: storage.getDetectedPattern(),
      };

      storage.saveMentorConversation(newConversation);
      setConversation(newConversation);
    } catch (error) {
      console.error('Error fetching auto checkin:', error);
      const fallbackMsg: Message = {
        sender: 'AI',
        text: `শুভ দিন! আজ আপনার মোট ${habits.length}টি অভ্যাসের মধ্যে ${doneCount}টি সম্পন্ন এবং ${missedCount}টি মিস হয়েছে। আপনার পরিবেশ বা সিস্টেম কেমন সাহায্য করছে?`,
        timestamp: Date.now(),
      };

      const fallbackConv: MentorConversation = {
        id: Date.now(),
        date: todayStr,
        type: 'DAILY',
        messages: [fallbackMsg],
        detectedPattern: storage.getDetectedPattern(),
      };

      storage.saveMentorConversation(fallbackConv);
      setConversation(fallbackConv);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading || !conversation) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Add user message to conversation
    const userMsg: Message = {
      sender: 'USER',
      text: userText,
      timestamp: Date.now(),
    };

    const updatedMessages = [...conversation.messages, userMsg];
    const updatedConv: MentorConversation = {
      ...conversation,
      messages: updatedMessages,
    };

    setConversation(updatedConv);
    storage.saveMentorConversation(updatedConv);
    setIsLoading(true);

    try {
      const checkIns = storage.getCheckIns();
      const todayCheckIns = checkIns.filter((c) => c.date === todayStr);

      const doneCount = habits.filter(
        (h) => todayCheckIns.find((c) => c.habitId === h.id)?.status === 'DONE'
      ).length;
      const missedCount = habits.filter(
        (h) => todayCheckIns.find((c) => c.habitId === h.id)?.status === 'MISSED'
      ).length;

      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userContext: {
            identityStatements: user?.identityStatements || [],
            todaySummary: {
              done: doneCount,
              missed: missedCount,
              total: habits.length,
            },
          },
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || 'আমি আপনার প্রশ্নের উত্তর দিতে প্রস্তুত।';

      const aiMsg: Message = {
        sender: 'AI',
        text: aiReply,
        timestamp: Date.now(),
      };

      const finalConv: MentorConversation = {
        ...updatedConv,
        messages: [...updatedMessages, aiMsg],
      };

      setConversation(finalConv);
      storage.saveMentorConversation(finalConv);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        sender: 'AI',
        text: 'দুঃখিত, সংযোগে কিছু সমস্যা হয়েছে। আপনি আপনার পরবর্তী ছোট পদক্ষেপটি চেষ্টা করতে পারেন।',
        timestamp: Date.now(),
      };
      const finalConv: MentorConversation = {
        ...updatedConv,
        messages: [...updatedMessages, errorMsg],
      };
      setConversation(finalConv);
      storage.saveMentorConversation(finalConv);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Weekly Pattern Recognition (Last 7 Days)
  const handleAnalyzePattern = async () => {
    setIsAnalyzingPattern(true);

    const allCheckIns = storage.getCheckIns();
    const dates = storage.getLast30DaysDates().slice(-7); // Last 7 days

    const checkInsLast7Days = dates.flatMap((date) => {
      return habits.map((h) => {
        const found = allCheckIns.find((c) => c.habitId === h.id && c.date === date);
        return {
          date,
          habitName: h.name,
          type: h.type,
          status: found ? found.status : 'NOT_CHECKED',
        };
      });
    });

    try {
      const res = await fetch('/api/mentor/pattern-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkInsLast7Days,
          habits: habits.map((h) => ({ name: h.name, type: h.type })),
        }),
      });

      const data = await res.json();
      const patternText = data.pattern || 'সাপ্তাহিক অভ্যাসে ইতিবাচক অগ্রগতি রয়েছে।';

      setDetectedPattern(patternText);
      storage.saveDetectedPattern(patternText);

      if (conversation) {
        const updatedConv = { ...conversation, detectedPattern: patternText };
        setConversation(updatedConv);
        storage.saveMentorConversation(updatedConv);
      }

      if (onPatternUpdated) {
        onPatternUpdated(patternText);
      }
    } catch (error) {
      console.error('Error generating pattern insight:', error);
    } finally {
      setIsAnalyzingPattern(false);
    }
  };

  return (
    <div className="bg-[#173834] border border-[#2B5852] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col h-[70vh] max-h-[650px] relative overflow-hidden">
      {/* Header Bar */}
      <div className="border-b border-[#2B5852]/80 pb-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2DD4BF] to-[#10B981] flex items-center justify-center text-[#0F2623] shadow-md shadow-[#2DD4BF]/20">
            <Bot className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg font-bold text-[#F0F7F5]">
                AtomicAI মেন্টর
              </h3>
              <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2DD4BF]/30">
                Socratic Coach
              </span>
            </div>
            <p className="text-xs text-[#A3C2BB]">
              Atomic Habits দর্শনে আপনার দৈনিক অভ্যাসের সিস্টেম কোচ
            </p>
          </div>
        </div>

        {/* Pattern Analysis Action Button */}
        <button
          onClick={handleAnalyzePattern}
          disabled={isAnalyzingPattern}
          className="py-1.5 px-3 bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-[#2DD4BF] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          title="গত ৭ দিনের ডেটা থেকে প্যাটার্ন ইনসাইট তৈরি করুন"
        >
          {isAnalyzingPattern ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">প্যাটার্ন ইনসাইট</span>
        </button>
      </div>

      {/* Detected Pattern Banner if present */}
      {detectedPattern && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 my-2 flex items-start gap-2 text-amber-200 text-xs shrink-0"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-amber-400 block">
              🔍 শনাক্তকৃত অভ্যাসের প্যাটার্ন (Pattern Insight):
            </span>
            <span className="text-xs">{detectedPattern}</span>
          </div>
        </motion.div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto my-3 space-y-4 pr-1">
        {conversation?.messages.map((msg, idx) => {
          const isAI = msg.sender === 'AI';
          return (
            <motion.div
              key={`msg-${msg.timestamp || idx}-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-7 h-7 rounded-lg bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                  isAI
                    ? 'bg-[#0F2623] border border-[#2B5852] text-[#F0F7F5] rounded-tl-none'
                    : 'bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-[#0F2623] font-medium rounded-tr-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1.5 opacity-60 ${
                    isAI ? 'text-[#A3C2BB]' : 'text-[#0F2623]'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString('bn-BD', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {!isAI && (
                <div className="w-7 h-7 rounded-lg bg-[#2DD4BF] flex items-center justify-center text-[#0F2623] font-bold text-xs shrink-0 mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#2DD4BF]">
            <div className="w-7 h-7 rounded-lg bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <span className="bg-[#0F2623] px-3 py-2 rounded-xl border border-[#2B5852] text-[11px] animate-pulse">
              AtomicAI মেন্টর উত্তর চিন্তা করছে...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Socratic Suggestion Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 shrink-0 no-scrollbar">
        <button
          type="button"
          onClick={() =>
            setInputMessage('আজকের অভ্যাস মিস করার কারণ কী মনে হয়?')
          }
          className="whitespace-nowrap bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-[#A3C2BB] hover:text-[#2DD4BF] text-[10px] px-2.5 py-1 rounded-full transition-all"
        >
          💡 মিস করার কারণ কী?
        </button>
        <button
          type="button"
          onClick={() =>
            setInputMessage('অভ্যাসটি আরও সহজ (Easy) করার উপায় বলুন।')
          }
          className="whitespace-nowrap bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-[#A3C2BB] hover:text-[#2DD4BF] text-[10px] px-2.5 py-1 rounded-full transition-all"
        >
          ⚡ অভ্যাস সহজ করা
        </button>
        <button
          type="button"
          onClick={() =>
            setInputMessage('পরিবেশে কী পরিবেশগত পরিবর্তন আনলে কাজ হবে?')
          }
          className="whitespace-nowrap bg-[#0F2623] hover:bg-[#1D443F] border border-[#2B5852] text-[#A3C2BB] hover:text-[#2DD4BF] text-[10px] px-2.5 py-1 rounded-full transition-all"
        >
          🌿 পরিবেশগত পরিবর্তন
        </button>
      </div>

      {/* Input Field & Submit */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 pt-2 border-t border-[#2B5852]/80 shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="মেন্টরকে প্রশ্ন করুন বা অভিজ্ঞতা শেয়ার করুন..."
          disabled={isLoading}
          className="flex-1 bg-[#0F2623] border border-[#2B5852] focus:border-[#2DD4BF] text-[#F0F7F5] placeholder-[#608780] text-xs rounded-xl py-2.5 px-3.5 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="bg-[#2DD4BF] hover:bg-[#26bba8] disabled:opacity-40 text-[#0F2623] p-2.5 rounded-xl font-bold transition-all active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
};
