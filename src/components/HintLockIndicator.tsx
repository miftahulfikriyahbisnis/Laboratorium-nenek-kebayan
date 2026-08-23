import React, { useState } from 'react';
import { Lock, Unlock, ChevronDown, ChevronUp, Clock, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { Mission } from '../types';

interface HintLockIndicatorProps {
  mission: Mission;
  attempts: number;
  timeSpentSeconds: number;
  className?: string;
  defaultExpanded?: boolean;
}

export const HintLockIndicator: React.FC<HintLockIndicatorProps> = ({
  mission,
  attempts,
  timeSpentSeconds,
  className = '',
  defaultExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  // Criteria: 10 attempts OR 10 minutes (600 seconds)
  const isUnlocked = attempts >= 10 || timeSpentSeconds >= 600;

  // Format mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const attemptPercent = Math.min(100, Math.round((attempts / 10) * 100));
  const timePercent = Math.min(100, Math.round((timeSpentSeconds / 600) * 100));

  return (
    <div className={`rounded-2xl border-2 transition-all shadow-sm ${
      isUnlocked
        ? 'bg-[#FAF7F0] border-[#5C7A5C]'
        : 'bg-[#FAF7F0] border-amber-400/80'
    } ${className}`}>
      {/* Header bar */}
      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isUnlocked
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
              : 'bg-amber-100 border-amber-300 text-amber-800'
          }`}>
            {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-serif font-black text-[#3D2413]">
                {isUnlocked ? 'Petunjuk Soal & Rincian Rumus (Terbuka)' : 'Petunjuk Soal & Rincian Rumus (Terkunci)'}
              </span>
              {isUnlocked && (
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Syarat Terpenuhi
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7A5230] font-serif">
              {isUnlocked
                ? 'Cucunda telah memenuhi syarat belajar (10x pengulangan atau 10 menit).'
                : 'Terbuka otomatis setelah 10 kali pengulangan atau 10 menit belajar.'}
            </p>
          </div>
        </div>

        {/* Action button if unlocked or status if locked */}
        {isUnlocked ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5C7A5C] text-[#FAF7F0] hover:bg-[#445E44] text-xs font-serif font-bold transition shadow-xs cursor-pointer"
          >
            <span>{isOpen ? 'Sembunyikan Petunjuk' : 'Buka Rincian Petunjuk'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <div className="flex items-center gap-3 text-xs font-serif text-[#7A5230] bg-[#FAF7F0] px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Terkunci
            </span>
          </div>
        )}
      </div>

      {/* When Locked: Show Progress Bars to unlock */}
      {!isUnlocked && (
        <div className="p-3.5 sm:p-4 bg-amber-50/50 space-y-3 text-xs font-serif">
          <div className="text-[11px] text-[#5C3A21] leading-relaxed">
            💡 <em>Sebagai adab menuntut ilmu, cobalah meracik dan menguji nalar terlebih dahulu di kuali. Petunjuk rumus & data detail akan terbuka otomatis jika salah satu syarat tercapai:</em>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Attempt progress */}
            <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-amber-300 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#7A5230] flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 text-amber-700" /> Pengulangan / Percobaan
                </span>
                <span className="font-mono font-bold text-[#5C7A5C]">{attempts} / 10 kali</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#D9A441] h-full rounded-full transition-all duration-300"
                  style={{ width: `${attemptPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-stone-600 text-right">
                {10 - attempts > 0 ? `Kurang ${10 - attempts} percobaan lagi` : 'Selesai!'}
              </div>
            </div>

            {/* Timer progress */}
            <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-amber-300 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#7A5230] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-700" /> Waktu Belajar Misi Ini
                </span>
                <span className="font-mono font-bold text-[#5C7A5C]">
                  {formatTime(timeSpentSeconds)} / 10:00
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#5C7A5C] h-full rounded-full transition-all duration-300"
                  style={{ width: `${timePercent}%` }}
                />
              </div>
              <div className="text-[10px] text-stone-600 text-right">
                {600 - timeSpentSeconds > 0
                  ? `Kurang ${Math.ceil((600 - timeSpentSeconds) / 60)} menit lagi`
                  : 'Selesai!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* When Unlocked and Expanded: Show Full Hint Details */}
      {isUnlocked && isOpen && (
        <div className="p-4 sm:p-5 space-y-4 animate-fadeIn bg-[#FAF7F0] text-[#3D2413]">
          {/* Chemical Theory Connection */}
          <div className="space-y-1.5">
            <span className="text-xs font-serif font-black text-[#5C7A5C] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D9A441]" />
              Hubungan Teori Kimia & Logika Perhitungan
            </span>
            <p className="text-xs sm:text-sm font-serif leading-relaxed text-[#5C3A21] bg-[#FAF7F0] p-3 rounded-xl border border-[#D9A441]/50 shadow-inner">
              {mission.theoryConnection}
            </p>
          </div>

          {/* Scientific Formula Box */}
          <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#5C7A5C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#7A5230] font-bold block">
                Rumus Acuan
              </span>
              <span className="font-serif font-bold text-xs text-[#3D2413]">
                {mission.scientificConcept.title}
              </span>
            </div>
            <div className="font-mono font-bold text-sm text-[#5C7A5C] bg-[#FAF7F0] px-3 py-1 rounded-lg border border-[#5C7A5C]/40 shadow-xs">
              {mission.scientificConcept.formula}
            </div>
          </div>

          {/* Known Variables & Target Guide */}
          <div>
            <span className="text-xs font-serif font-black text-[#7A5230] uppercase tracking-wider block mb-2">
              Data & Variabel yang Diketahui:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {mission.knownVariables.map((v, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9A441]/60 text-xs font-serif shadow-2xs"
                >
                  <div className="text-[10px] text-stone-600 font-sans">{v.label}</div>
                  <div className="font-mono font-bold text-[#5C7A5C] text-xs mt-0.5">
                    {v.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
