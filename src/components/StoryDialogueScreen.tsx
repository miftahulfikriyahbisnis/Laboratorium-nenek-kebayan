import React, { useState, useRef, useEffect } from 'react';
import { Mission, StudentProgress, ChatMessage } from '../types';
import { NenekAvatar } from './NenekAvatar';
import {
  Sparkles,
  ArrowRight,
  FlaskConical,
  ScrollText,
  Send,
  HelpCircle,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StoryDialogueScreenProps {
  mission: Mission;
  progress: StudentProgress;
  onProceedToExperiment: () => void;
  onUpdateChatHistory: (missionId: number, messages: ChatMessage[]) => void;
  onBackToHome: () => void;
}

export const StoryDialogueScreen: React.FC<StoryDialogueScreenProps> = ({
  mission,
  progress,
  onProceedToExperiment,
  onUpdateChatHistory,
  onBackToHome,
}) => {
  const studentNameDisplay = progress.studentName || 'yang budiman';
  const initialWelcomeText = `Assalamu'alaikum, wahai cucunda ${studentNameDisplay}. Ada yang mau cucunda tanyakan pada Nenek?`;

  const rawMessages: ChatMessage[] = progress.chatHistories[mission.id] || [];
  const sanitizedMessages = rawMessages.map((msg) => {
    if (msg.id === 'welcome-msg' || (msg.role === 'assistant' && (msg.content.includes('kita dihadapkan pada soal') || msg.content.includes('Begitulah kisah ramuan') || msg.content.includes('Tersedia larutan stok')))) {
      return {
        ...msg,
        content: `Assalamu'alaikum, wahai cucunda ${studentNameDisplay}. Ada yang mau cucunda tanyakan pada Nenek?`,
      };
    }
    return msg;
  });

  const initialMessages: ChatMessage[] = sanitizedMessages.length > 0 ? sanitizedMessages : [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: initialWelcomeText,
      timestamp: Date.now(),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setErrorMessage('');
    setInputText('');
    soundManager.playDropSound();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    onUpdateChatHistory(mission.id, newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: mission.id,
          missionTitle: mission.title,
          topic: mission.topic,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi tungku Nenek Kebayan.');
      }

      const data = await response.json();
      const assistantReply =
        data.reply || 'Wahai cucunda, renungkanlah kembali hubungan antara kepekatan ramuan dan volume pelarutnya...';

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        timestamp: Date.now(),
      };

      const updatedHistory = [...newMessages, assistantMsg];
      setMessages(updatedHistory);
      onUpdateChatHistory(mission.id, updatedHistory);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setErrorMessage(
        'Tungku konsultasi sedikit terganggu. Cucunda dapat mencoba bertanya lagi atau langsung melangkah ke kuali eksperimen.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Breadcrumb / Stage Indicator */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#7A5230]">
        <button
          onClick={onBackToHome}
          className="hover:underline flex items-center gap-1 text-[#5C7A5C] font-serif font-bold cursor-pointer"
        >
          ← Kembali ke Menu Misi
        </button>
        <span className="bg-[#D9A441]/20 text-[#7A5230] px-3.5 py-1 rounded-full border border-[#D9A441]/40 font-serif">
          Kisah & Bimbingan Nenek Kebayan
        </span>
      </div>

      {/* Main Story Parchment Card */}
      <div className="rounded-3xl paper-bg gold-border glow shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden text-[#3D2413]">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -top-6 -right-6 w-44 h-44 bg-[#D9A441]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Story Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b-2 border-[#D9A441]/40 pb-6">
          <NenekAvatar size="xl" expression="talking" />
          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-[#5C7A5C] text-[#FAF7F0] text-xs font-serif font-black shadow-sm border border-[#D9A441]">
              <ScrollText className="w-3.5 h-3.5 text-[#D9A441]" />
              Fragmen Kisah Nenek Kebayan
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3D2413] tracking-wide">
              {mission.title}
            </h1>
            <p className="text-sm font-serif font-bold text-[#5C7A5C]">
              🔬 Topik Kimia: {mission.topic}
            </p>
          </div>
        </div>

        {/* Scripted Story Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border-2 border-[#D9A441] text-[#3D2413] space-y-3 relative shadow-inner">
          <div className="text-xs uppercase tracking-widest font-serif font-black text-[#7A5230] flex items-center gap-1">
            <span>📜 Lembaran Catatan Herbal Leluhur:</span>
          </div>

          <blockquote className="font-serif italic text-base sm:text-lg text-[#3D2413] leading-relaxed pl-4 border-l-4 border-[#7A5230]">
            "{mission.storyFragment}"
          </blockquote>

          <p className="text-xs sm:text-sm text-[#7A5230] font-serif italic pt-1">
            {mission.herbalContext}
          </p>
        </div>

        {/* Sesi Konsultasi Interaktif Nenek Kebayan (Langsung di Awal setelah Cerita) */}
        <div className="rounded-3xl bg-[#FAF7F0] border-2 border-[#5C7A5C] p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-[#5C7A5C]/30">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#5C7A5C]" />
              <span className="text-xs sm:text-sm font-serif font-black text-[#5C7A5C] uppercase tracking-wider">
                Bimbingan & Tanya Jawab Nenek Kebayan (Opsional)
              </span>
            </div>
            <span className="text-[11px] font-serif font-bold text-[#7A5230] bg-[#D9A441]/20 px-2.5 py-0.5 rounded-full border border-[#D9A441]/40">
              Tanya Nalar Kimiawi
            </span>
          </div>

          <p className="text-xs text-[#5C3A21] font-serif leading-relaxed">
            💡 Cucunda dapat berdiskusi dengan Nenek mengenai konsep rumus atau khasiat herbal sebelum melangkah ke kuali racikan. Jika sudah siap, cucunda juga bisa langsung menuju soal kasus dan kuali laboratorium di bawah.
          </p>

          {/* Chat Messages Box */}
          <div className="rounded-2xl bg-[#F4EDE2] border border-[#D9A441]/60 p-4 h-[300px] sm:h-[340px] overflow-y-auto space-y-3 shadow-inner">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 mt-0.5">
                    <NenekAvatar size="sm" expression="talking" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm font-serif leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'wood-texture text-[#FAF7F0] rounded-br-none border border-[#D9A441]'
                      : 'bg-[#FAF7F0] text-[#3D2413] rounded-bl-none border border-[#5C7A5C]/40'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-[#7A5230] font-serif italic animate-pulse">
                <NenekAvatar size="sm" expression="neutral" />
                <div className="bg-[#FAF7F0] px-3.5 py-2 rounded-2xl border border-[#D9A441]/50 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A441] animate-spin" />
                  <span>Nenek sedang mengingat resep dan menimbang khasiat kimiawi...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tanyakan hal tentang cerita herbal atau sapa Nenek Kebayan..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF7F0] border-2 border-[#D9A441] text-[#3D2413] placeholder:text-stone-400 text-xs sm:text-sm font-serif focus:outline-hidden focus:ring-2 focus:ring-[#5C7A5C] shadow-inner"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] border border-[#D9A441] flex items-center justify-center gap-1 text-xs font-serif font-black shadow-md transition disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 text-[#D9A441]" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-700 font-serif bg-rose-50 p-2 rounded-lg border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Bottom Navigation: Proceed to Challenge Problem & Experiment Screen */}
        <div className="pt-4 border-t-2 border-[#D9A441]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#F2EDE2] text-[#7A5230] font-serif font-bold text-xs sm:text-sm border-2 border-[#D9A441] shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            ← Kembali ke Menu Misi
          </button>

          <button
            id="btn-proceed-to-challenge-and-experiment"
            onClick={() => {
              soundManager.playDropSound();
              onProceedToExperiment();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] font-serif font-black text-sm sm:text-base border-2 border-[#D9A441] glow shadow-xl flex items-center justify-center gap-2.5 transition transform active:scale-95 cursor-pointer"
          >
            <FlaskConical className="w-5 h-5 text-[#D9A441]" />
            <span>Lanjut ke Soal Kasus & Kuali Racikan</span>
            <ArrowRight className="w-4 h-4 text-[#D9A441]" />
          </button>
        </div>
      </div>
    </div>
  );
};
