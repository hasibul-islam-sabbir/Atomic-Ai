import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily or safely
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_PROMPT = `তুমি AtomicAi অ্যাপের AI মেন্টর। Atomic Habits বইয়ের দর্শন অনুসরণ করো। সরাসরি উপদেশ দেওয়ার বদলে প্রশ্ন করে ইউজারকে নিজে সমাধান খুঁজতে সাহায্য করো (Socratic coaching)। গোল মিস হলে সমালোচনা না করে system/environment ঠিক আছে কিনা জিজ্ঞেস করো। টোন উষ্ণ কিন্তু honest, cheerleader না, mentor। বাংলা এবং ইংরেজি দুই ভাষাতেই স্বাভাবিকভাবে কথা বলতে পারবে, ইউজার যে ভাষায় লেখে সেই ভাষায় উত্তর দাও।`;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/mentor/chat', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      // Fallback Socratic response if key is not available
      return res.json({
        reply: 'শুভ দিন! আজ আপনার অভ্যাসের কি পরিবেশগত বা সিস্টেমিক কোনো বাধা অনুভব করছেন? (মডেল রেসপন্স তৈরি করতে API Key আবশ্যক।)',
      });
    }

    // Convert conversation history into contents array for Gemini
    const contents: any[] = [];

    // Add user context if provided
    let contextHeader = '';
    if (userContext) {
      if (userContext.identityStatements?.length) {
        contextHeader += `ইউজারের পরিচয়পত্র (Identities): ${userContext.identityStatements.join(', ')}\n`;
      }
      if (userContext.todaySummary) {
        contextHeader += `আজকের অগ্রগতি: সম্পন্ন: ${userContext.todaySummary.done}, মিস: ${userContext.todaySummary.missed}, মোট: ${userContext.todaySummary.total}\n`;
      }
    }

    if (contextHeader) {
      contents.push({
        role: 'user',
        parts: [{ text: `[ইউজার কন্টেক্সট: ${contextHeader}]` }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'ধন্যবাদ, আমি আপনার ব্যাকগ্রাউন্ড ও আজকের অগ্রগতি বুঝতে পেরেছি।' }],
      });
    }

    // Append conversation history
    if (Array.isArray(messages)) {
      messages.forEach((msg: { sender: 'USER' | 'AI'; text: string }) => {
        contents.push({
          role: msg.sender === 'USER' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'আমি দুঃখিত, আপনার বার্তাটি বুঝতে সমস্যা হয়েছে। আপনার আজকের ছোট পদক্ষেপ কী ছিল?';
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/mentor/chat:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      reply: 'কোনো কারিগরি ত্রুটি ঘটেছে। আপনি কি আপনার আজকের অভ্যাস সংক্রান্ত কোনো চ্যালেঞ্জ শেয়ার করতে চান?',
    });
  }
});

// Daily Check-in Auto Generation endpoint
app.post('/api/mentor/auto-checkin', async (req, res) => {
  try {
    const { todayDate, doneCount, missedCount, totalHabits, habitDetails, identityStatements } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      const fallbackMsg = `শুভ দিন! আজ আপনার মোট ${totalHabits || 0}টি অভ্যাসের মধ্যে ${doneCount || 0}টি সম্পন্ন এবং ${missedCount || 0}টি মিস হয়েছে। আজ কোনো পরিবেশগত বাধা ছিল কি?`;
      return res.json({ reply: fallbackMsg });
    }

    const promptText = `আজকের তারিখ: ${todayDate}. ইউজারের আজকের অভ্যাস অগ্রগতি: মোট ${totalHabits}টি, সম্পন্ন: ${doneCount}, মিস হয়েছে: ${missedCount}.
অভ্যাসের বিবরণ: ${JSON.stringify(habitDetails || [])}.
ইউজারের লক্ষ্য পরিচয়: ${JSON.stringify(identityStatements || [])}.

উপরে দেওয়া তথ্যের ওপর ভিত্তি করে ইউজারের জন্য একটি সংক্ষিপ্ত (২-৩ বাক্যের) দৈনিক চেক-ইন ও অনুপ্রেরণামূলক সাক্রেটিক প্রশ্ন তৈরি করুন। শুভকামনা জানান এবং আজকের সিস্টেম বা এনভায়রনমেন্ট সম্পর্কে প্রশ্ন করুন।`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const replyText = response.text || `আজ আপনার ${doneCount}টি অভ্যাস সম্পন্ন এবং ${missedCount}টি মিস হয়েছে। কোনো অভ্যাস সহজ করতে সিস্টেমে কী পরিবর্তন আনা যায়?`;
    return res.json({ reply: replyText });
  } catch (error) {
    console.error('Error in /api/mentor/auto-checkin:', error);
    return res.json({
      reply: 'আজকের দিনে আপনার অভ্যাসের সূচনা কেমন হচ্ছে? ছোট পদক্ষেপের জন্য আপনি কীভাবে পরিবেশ তৈরি করছেন?',
    });
  }
});

// Pattern Recognition Insight endpoint (Last 7 Days)
app.post('/api/mentor/pattern-insight', async (req, res) => {
  try {
    const { checkInsLast7Days, habits } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        pattern: 'গত ৭ দিনের ট্র্যাকিং অনুযায়ী সাপ্তাহিক ধারাবাহিকতা ভালো বজায় থাকছে।',
      });
    }

    const promptText = `ইউজারের গত ৭ দিনের অভ্যাস চেক-ইন ডেটা:
${JSON.stringify(checkInsLast7Days || [], null, 2)}

ইউজারের অভ্যাস তালিকা:
${JSON.stringify(habits || [], null, 2)}

উপরের গত ৭ দিনের ডেটা বিশ্লেষণ করে একটি মাত্র সংক্ষিপ্ত ১-লাইনের বাংলা প্যাটার্ন ইনসাইট (pattern insight) দিন। যেমন: "শুক্রবার রাতে ব্যায়াম বেশি মিস হচ্ছে" অথবা "টানা ৪ দিন সকালে পানি পানের অভ্যাস অক্ষুণ্ণ রেখেছেন"।
শুধু মাত্র ১-লাইনের ইনসাইট টেক্সটটিই দিন, অন্য কোনো কথা বা কোট ছাড়া।`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: 'তুমি একজন দক্ষ ডেটা প্যাটার্ন বিশ্লেষণকারী ও Atomic Habits মেন্টর। উত্তরটি সবসময় ঠিক ১ লাইনে বাংলায় দাও।',
        temperature: 0.5,
      },
    });

    let patternText = (response.text || '').trim();
    if (!patternText) {
      patternText = 'গত ৭ দিনে সাপ্তাহিক অভ্যাসের ধারাবাহিকতায় অগ্রগতি দেখা যাচ্ছে।';
    }

    return res.json({ pattern: patternText });
  } catch (error) {
    console.error('Error in /api/mentor/pattern-insight:', error);
    return res.json({
      pattern: 'সাপ্তাহিক অভ্যাসে ছোট ছোট পরিবর্তনের মাধ্যমে ভালো ধারাবাহিকতা তৈরি হচ্ছে।',
    });
  }
});

// Weekly Reflection AI Insight endpoint
app.post('/api/mentor/weekly-reflection', async (req, res) => {
  try {
    const { topHabit, bottomHabit, completionRate, identityStatements } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        insight: 'সাপ্তাহিক ধারাবাহিকতা বজায় রাখার জন্য সবচেয়ে কম সফল অভ্যাসে ২-মিনিট রুল প্রয়োগ করুন।',
      });
    }

    const promptText = `ইউজারের সাপ্তাহিক অভ্যাসের ডেটা:
- সর্বোচ্চ ধারাবাহিকতা: ${topHabit || 'তথ্য নেই'}
- সবচেয়ে কম ধারাবাহিকতা: ${bottomHabit || 'তথ্য নেই'}
- সাপ্তাহিক সার্বিক সাফল্য: ${completionRate}%
- ইউজারের কাঙ্ক্ষিত পরিচয়: ${JSON.stringify(identityStatements || [])}

Atomic Habits দর্শনে ইউজারের জন্য ঠিক ১-লাইনের একটি গভীর ও গঠনমূলক পরামর্শ/ইনসাইট (AI Insight) লিখুন বাংলায়।`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.6,
      },
    });

    const insightText = (response.text || '').trim() || 'ক্ষুদ্র পরিবেশগত পরিবর্তন এনে দুর্বল অভ্যাসের ঘর্ষণ (friction) কমিয়ে দিন।';
    return res.json({ insight: insightText });
  } catch (error) {
    console.error('Error in /api/mentor/weekly-reflection:', error);
    return res.json({
      insight: 'সবচেয়ে কম ধারাবাহিকতার অভ্যাসটিতে ২-মিনিট রুল প্রয়োগ করে পরিবেশ সহজ করুন।',
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
