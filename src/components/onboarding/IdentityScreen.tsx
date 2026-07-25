import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

interface IdentityScreenProps {
  initialStatements: string[];
  onNext: (statements: string[]) => void;
}

export const IdentityScreen: React.FC<IdentityScreenProps> = ({
  initialStatements,
  onNext,
}) => {
  const [statements, setStatements] = useState<string[]>(
    initialStatements.length > 0
      ? initialStatements
      : [
          'আমি একজন স্বাস্থ্য সচেতন ও কর্মঠ মানুষ',
          'আমি একজন শৃঙ্খলিত ও প্রোডাক্টভ ব্যক্তি',
          'আমি একজন নিয়মিত পাঠক ও আজীবন শিক্ষার্থী',
        ]
  );

  const [inputError, setInputError] = useState<string | null>(null);

  const handleStatementChange = (index: number, value: string) => {
    const updated = [...statements];
    updated[index] = value;
    setStatements(updated);
    if (inputError) setInputError(null);
  };

  const handleAddStatement = () => {
    if (statements.length >= 5) {
      setInputError('সর্বোচ্চ ৫টি আইডেন্টিটি স্টেটমেন্ট যোগ করতে পারবেন');
      return;
    }
    setStatements([...statements, '']);
  };

  const handleRemoveStatement = (index: number) => {
    if (statements.length <= 1) {
      setInputError('কমপক্ষে ১টি স্টেটমেন্ট থাকা আবশ্যক');
      return;
    }
    const updated = statements.filter((_, i) => i !== index);
    setStatements(updated);
  };

  const handleQuickAdd = (example: string) => {
    if (statements.length >= 5) {
      setInputError('সর্বোচ্চ ৫টি আইডেন্টিটি স্টেটমেন্ট যোগ করতে পারবেন');
      return;
    }
    if (!statements.includes(example)) {
      if (statements.length === 1 && statements[0].trim() === '') {
        setStatements([example]);
      } else {
        setStatements([...statements, example]);
      }
    }
  };

  const handleNext = () => {
    const validStatements = statements.map((s) => s.trim()).filter((s) => s.length > 0);
    if (validStatements.length < 3) {
      setInputError('অনুগ্রহ করে কমপক্ষে ৩টি আইডেন্টিটি স্টেটমেন্ট লিখুন');
      return;
    }
    onNext(validStatements);
  };

  const suggestions = [
    'আমি একজন ফিট ও সুস্বাস্থ্যের অধিকারী মানুষ',
    'আমি একজন মনযোগী ও শান্ত মনের অধিকারী',
    'আমি সময়ের সদ্ব্যবহারকারী সফল ব্যক্তি',
    'আমি একজন নিয়মনিষ্ঠ লেখক/কন্টেন্ট ক্রিয়েটর',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full max-w-xl mx-auto px-4 py-6"
    >
      {/* Top Tag & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D443F] text-[#2DD4BF] text-xs font-medium mb-3 border border-[#2B5852]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ধাপ ১ অফ ৩: আত্মপরিচয়</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#F0F7F5] mb-2">
          তুমি কে হতে চাও?
        </h1>
        <p className="font-body text-[#A3C2BB] text-sm md:text-base max-w-md mx-auto leading-relaxed">
          <span className="text-[#2DD4BF] font-semibold">Atomic Habits</span> এর মূলনীতি হলো: অভ্যাস পরিবর্তন করতে হলে আগে নিজের পরিচয় ও মানসিকতা পরিবর্তন করতে হয়।
        </p>
      </div>

      {/* Input List */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs text-[#A3C2BB]">
          <span className="flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
            আইডেন্টিটি স্টেটমেন্টসমূহ ({statements.length}/৫)
          </span>
          <span>কমপক্ষে ৩টি পূরণ করুন</span>
        </div>

        {statements.map((statement, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-[#173834] border border-[#2B5852] flex items-center justify-center text-[#2DD4BF] font-semibold text-xs shrink-0">
              {idx + 1}
            </div>
            <input
              type="text"
              value={statement}
              onChange={(e) => handleStatementChange(idx, e.target.value)}
              placeholder={`উদাহরণ: "আমি একজন ${idx === 0 ? 'নিয়মিত ব্যায়ামকারী' : 'বইপ্রেমী'} মানুষ"`}
              className="flex-1 bg-[#173834] border border-[#2B5852] focus:border-[#2DD4BF] focus:outline-none text-[#F0F7F5] placeholder-[#608780] rounded-xl px-3.5 py-2.5 text-sm transition-colors"
            />
            {statements.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveStatement(idx)}
                className="p-2 text-[#A3C2BB] hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors shrink-0"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}

        {statements.length < 5 && (
          <button
            type="button"
            onClick={handleAddStatement}
            className="w-full py-2.5 border border-dashed border-[#2B5852] hover:border-[#2DD4BF] text-[#2DD4BF] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors bg-[#173834]/40 hover:bg-[#173834]"
          >
            <Plus className="w-4 h-4" />
            নতুন স্টেটমেন্ট যোগ করুন
          </button>
        )}

        {inputError && (
          <p className="text-red-400 text-xs text-center font-medium mt-1">
            {inputError}
          </p>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="bg-[#173834]/60 border border-[#2B5852] rounded-xl p-3.5 mb-8">
        <p className="text-xs font-semibold text-[#A3C2BB] mb-2 flex items-center gap-1">
          💡 আইডিয়া বা পরামর্শ থেকে বেছে নিন:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
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

      {/* Footer Navigation Button */}
      <div className="mt-auto">
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 bg-[#2DD4BF] hover:bg-[#26bba8] text-[#0F2623] font-bold rounded-xl shadow-lg shadow-[#2DD4BF]/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-heading text-base"
        >
          <span>পরবর্তী ধাপ</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
