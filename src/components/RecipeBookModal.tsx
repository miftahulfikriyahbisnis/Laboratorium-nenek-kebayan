import React, { useState } from 'react';
import { STORY_FRAGMENTS } from '../data/missionsData';
import { StudentProgress } from '../types';
import { BookOpen, Lock, Sparkles, X, Scroll, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface RecipeBookModalProps {
  isOpen: boolean;
  progress: StudentProgress;
  onClose: () => void;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({
  isOpen,
  progress,
  onClose,
}) => {
  const [selectedFragId, setSelectedFragId] = useState<number>(1);

  if (!isOpen) return null;

  const currentFragment = STORY_FRAGMENTS.find((f) => f.missionId === selectedFragId) || STORY_FRAGMENTS[0];
  const isUnlocked = progress.completedMissions.includes(currentFragment.missionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="max-w-3xl w-full paper-bg rounded-3xl gold-border glow shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 wood-texture text-[#FAF7F0] border-b-2 border-[#D9A441] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#D9A441]" />
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-black flex items-center gap-2 text-shadow">
                <span>Buku Resep & Fragmen Cerita</span>
              </h2>
              <p className="text-xs text-[#EED9C4] font-serif italic">
                Jurnal Warisan Tabib Tradisional Nenek Kebayan
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playDropSound();
              onClose();
            }}
            className="p-2 rounded-xl wood-texture-dark hover:bg-[#3D2413] text-[#FAF7F0] border border-[#D9A441]/60 transition shadow-inner cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Tab Navigation */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STORY_FRAGMENTS.map((frag) => {
              const unlocked = progress.completedMissions.includes(frag.missionId);
              const isSelected = frag.missionId === selectedFragId;

              return (
                <button
                  key={frag.missionId}
                  onClick={() => {
                    soundManager.playDropSound();
                    setSelectedFragId(frag.missionId);
                  }}
                  className={`p-3 rounded-2xl border-2 text-xs font-serif font-black transition flex flex-col items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#5C7A5C] text-[#FAF7F0] border-[#D9A441] shadow-md ring-2 ring-[#D9A441]/50'
                      : unlocked
                      ? 'paper-bg text-[#7A5230] border-[#7A5230]/40 hover:bg-[#EED9C4]/40'
                      : 'bg-stone-200 text-stone-500 border-stone-300 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {unlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A441]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                    <span>Fragmen {frag.missionId}</span>
                  </div>
                  <span className="text-[10px] font-sans font-normal truncate max-w-[110px]">
                    {unlocked ? frag.recipeName : 'Terkunci'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Fragment Content Card */}
          {isUnlocked ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border-2 border-[#D9A441] space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#D9A441]/40 pb-2">
                <div className="flex items-center gap-2 text-sm font-serif font-black text-[#7A5230]">
                  <Scroll className="w-4 h-4 text-[#D9A441]" />
                  <span>{currentFragment.title}</span>
                </div>
                <span className="text-xs font-bold text-[#5C7A5C] bg-[#5C7A5C]/15 px-2.5 py-0.5 rounded-full border border-[#5C7A5C]/30">
                  ✓ Terbuka
                </span>
              </div>

              {/* Story Excerpt */}
              <blockquote className="font-serif italic text-sm sm:text-base text-[#3D2413] leading-relaxed pl-4 border-l-4 border-[#7A5230]">
                "{currentFragment.storyText}"
              </blockquote>

              {/* Recipe Formula & Ingredients */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#5C7A5C]/40 space-y-1.5 shadow-xs">
                  <span className="text-xs font-serif font-bold text-[#5C7A5C] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                    <span>Komposisi Resep Ramuan:</span>
                  </span>
                  <ul className="text-xs text-[#3D2413] font-serif space-y-1">
                    {currentFragment.recipeIngredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#D9A441]">▪</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#7A5230]/40 space-y-1.5 shadow-xs">
                  <span className="text-xs font-serif font-bold text-[#7A5230]">
                    🔬 Prinsip Ilmiah Kimia:
                  </span>
                  <p className="text-xs text-[#3D2413] font-serif italic">
                    {currentFragment.chemicalWisdom}
                  </p>
                  <div className="text-[11px] font-mono font-bold text-[#5C3A21] bg-[#FAF7F0] border border-[#D9A441] px-2 py-1 rounded-md shadow-inner text-center">
                    {currentFragment.scientificFormula}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-stone-100 border-2 border-stone-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center mx-auto text-stone-500">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-black text-stone-700">
                Fragmen Cerita Masih Terkunci
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed font-serif">
                Selesaikan <strong>Misi {currentFragment.missionId}</strong> di laboratorium untuk membuka catatan resep dan lembaran fragmen kisah ini.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 wood-texture-dark border-t border-[#D9A441]/50 flex justify-end">
          <button
            onClick={() => {
              soundManager.playDropSound();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#D9A441] hover:bg-yellow-500 text-[#7A5230] font-serif font-black text-xs sm:text-sm border border-[#FAF7F0]/40 transition cursor-pointer shadow-md"
          >
            Tutup Jurnal
          </button>
        </div>
      </div>
    </div>
  );
};
