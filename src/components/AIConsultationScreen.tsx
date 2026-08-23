import React, { useState, useRef, useEffect } from 'react';
import { Mission, ChatMessage, StudentProgress } from '../types';
import { NenekAvatar } from './NenekAvatar';
import { Send, Sparkles, FlaskConical, Lock, AlertCircle, HelpCircle, BookOpen, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { HintLockIndicator } from './HintLockIndicator';

interface AIConsultationScreenProps {
  mission: Mission;
  progress: StudentProgress;
  onProceedToExperiment: () => void;
  onUpdateChatHistory: (missionId: number, messages: ChatMessage[]) => void;
  onBackToStory: () => void;
}

export const AIConsultationScreen: React.FC<AIConsultationScreenProps> = ({
  mission,
  progress,
  onProceedToExperiment,
  onUpdateChatHistory,
  onBackToStory,
}) => {
  const attempts = progress.missionAttempts[mission.id] || 1;
  const timeSpentSeconds = progress.missionTimeSpent?.[mission.id] || 0;

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

  const isConsultationLocked = progress.consultationLocked[mission.id] || false;

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
        throw new Error('Gagal menghubungi tungku AI Nenek Kebayan.');
      }

      const data = await response.json();
      const assistantReply = data.reply || 'Wahai cucunda, renungkanlah kembali hukum kimiawi ramuan ini...';

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
      setErrorMessage('Tungku konsultasi sedikit terganggu. Cucunda dapat mencoba bertanya lagi atau langsung menguji di kuali.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExperimentClick = () => {
    soundManager.playDropSound();
    onProceedToExperiment();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-4 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#7A5230]">
        <button
          onClick={onBackToStory}
          className="hover:underline flex items-center gap-1 text-[#5C7A5C] font-serif font-bold cursor-pointer"
        >
          ← Kembali ke Lembaran Kisah
        </button>

        <span className="bg-[#D9A441]/20 text-[#7A5230] px-3 py-1 rounded-full border border-[#D9A441]/40 font-serif">
          Konsultasi Terbimbing Nenek Kebayan (Opsional)
        </span>
      </div>

      {/* Challenge Problem Reference Banner */}
      <div className="rounded-3xl paper-bg gold-border glow p-4 shadow-md space-y-2.5">
        <div className="flex items-center gap-2 border-b border-[#D9A441]/40 pb-2">
          <BookOpen className="w-4 h-4 text-[#D9A441]" />
          <span className="text-xs font-serif font-black text-[#7A5230] uppercase tracking-wider">
            Soal Kasus Kimia: {mission.title}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-serif font-medium text-[#3D2413] leading-relaxed bg-[#FAF7F0] p-2.5 rounded-xl border border-[#D9A441]/40 shadow-inner">
          "{mission.challengeQuestion}"
        </p>

        {/* Hint Lock / Progressive Unlock Component */}
        <HintLockIndicator
          mission={mission}
          attempts={attempts}
          timeSpentSeconds={timeSpentSeconds}
        />
      </div>

      {/* Main Chat Box Container */}
      <div className="rounded-3xl paper-bg gold-border glow shadow-2xl flex flex-col h-[520px] sm:h-[580px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 wood-texture text-[#FAF7F0] border-b-2 border-[#D9A441] flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <NenekAvatar size="sm" expression={isLoading ? 'thinking' : 'talking'} />
            <div>
              <h2 className="text-base sm:text-lg font-serif font-black flex items-center gap-1.5 text-shadow">
                <span>Nenek Kebayan AI</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#5C7A5C] text-[#FAF7F0] font-sans font-bold border border-[#D9A441]">
                  Online
                </span>
              </h2>
              <p className="text-xs text-[#EED9C4] font-serif italic">
                Misi {mission.id}: {mission.topic}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#FAF7F0] bg-[#5C3A21] px-3 py-1 rounded-xl border border-[#D9A441]/60">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            <span className="font-serif font-semibold">Tungku AI Konsultasi</span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 paper-bg">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-1">
                    <NenekAvatar size="sm" expression="happy" showAura={false} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-[#5C7A5C] text-[#FAF7F0] rounded-tr-none border border-[#D9A441]/40 font-medium'
                      : 'bg-[#FAF7F0] text-[#3D2413] rounded-tl-none border-2 border-[#D9A441] font-serif'
                  }`}
                >
                  {!isUser && (
                    <div className="text-[11px] font-bold text-[#7A5230] uppercase tracking-wider mb-1.5 flex items-center gap-1 font-serif">
                      <span>👵 Petunjuk Nenek Kebayan:</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <NenekAvatar size="sm" expression="thinking" showAura={false} />
              <div className="bg-[#FAF7F0] text-[#7A5230] rounded-2xl rounded-tl-none px-4 py-3 border-2 border-[#D9A441] text-xs flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#5C7A5C] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#7A5230] animate-bounce [animation-delay:0.4s]" />
                <span className="font-serif italic font-medium ml-1">
                  Nenek sedang menelaah kitab ramuan...
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Question Chips */}
        {!isConsultationLocked && (
          <div className="px-4 py-2.5 bg-[#FAF7F0] border-t border-[#D9A441]/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <div className="shrink-0 flex items-center gap-1 text-[11px] font-serif font-black text-[#7A5230]">
              <HelpCircle className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Saran Tanya:</span>
            </div>
            {mission.sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="shrink-0 text-xs px-3 py-1 rounded-full bg-[#FAF7F0] hover:bg-[#D9A441]/20 text-[#3D2413] border border-[#D9A441] transition truncate max-w-xs font-serif font-medium cursor-pointer shadow-xs"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#FAF7F0] border-t-2 border-[#D9A441]">
          {isConsultationLocked ? (
            <div className="text-center py-2 text-xs sm:text-sm font-semibold text-stone-600 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-stone-500" />
              <span>Layar konsultasi telah dikunci untuk sesi percobaan ini.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="input-consultation-chat"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tanyakan konsep konsentrasi/titrasi kepada Nenek Kebayan..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-2xl paper-bg text-[#3D2413] font-serif placeholder-[#7A5230]/50 border-2 border-[#D9A441] focus:outline-none focus:ring-4 focus:ring-[#D9A441]/40 text-xs sm:text-sm shadow-inner"
              />

              <button
                id="btn-send-consultation"
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-3 rounded-2xl bg-[#D9A441] hover:bg-yellow-500 disabled:bg-stone-300 text-[#7A5230] font-black border-2 border-[#FAF7F0]/40 shadow-md transition transform active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                title="Kirim Pertanyaan"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Action Navigation to Proceed to Experiment */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onBackToStory}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#F2EDE2] text-[#7A5230] font-serif font-bold text-xs sm:text-sm border-2 border-[#D9A441] shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
        >
          ← Kembali ke Ringkasan Misi
        </button>

        <button
          id="btn-lock-and-experiment"
          onClick={handleStartExperimentClick}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] font-serif font-black text-sm sm:text-base border-2 border-[#D9A441] glow shadow-xl flex items-center justify-center gap-2.5 transition transform active:scale-95 cursor-pointer"
        >
          <FlaskConical className="w-5 h-5 text-[#D9A441]" />
          <span>Lanjut ke Kuali Racikan (Mulai Eksperimen)</span>
          <ArrowRight className="w-4 h-4 text-[#D9A441]" />
        </button>
      </div>
    </div>
  );
};
