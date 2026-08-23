import React from 'react';
import { Mission, StoryFragment } from '../types';
import { NenekAvatar } from './NenekAvatar';
import { Sparkles, BookOpen, ArrowRight, Award, Scroll } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MissionSuccessModalProps {
  mission: Mission;
  fragment: StoryFragment;
  attempts: number;
  isLastMission: boolean;
  onOpenRecipeBook: () => void;
  onNextMission: () => void;
  onGoToCompletion: () => void;
}

export const MissionSuccessModal: React.FC<MissionSuccessModalProps> = ({
  mission,
  fragment,
  attempts,
  isLastMission,
  onOpenRecipeBook,
  onNextMission,
  onGoToCompletion,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="max-w-xl w-full paper-bg rounded-3xl p-6 sm:p-8 gold-border glow-lg shadow-2xl space-y-6 text-[#3D2413]">
        {/* Top Header Celebration */}
        <div className="flex flex-col items-center text-center space-y-2">
          <NenekAvatar size="lg" expression="happy" />
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5C7A5C] text-[#FAF7F0] text-xs font-serif font-black uppercase tracking-wider shadow-sm border border-[#D9A441]">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>Fragmen Cerita Tersimpan!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#7A5230] text-shadow">
            Misi {mission.id} Tuntas Sempurna!
          </h2>
          <p className="text-xs font-serif font-bold text-[#5C7A5C]">
            Tercapai dalam {attempts} kali percobaan racikan
          </p>
        </div>

        {/* Fragment Reveal Card */}
        <div className="p-5 rounded-2xl bg-[#FAF7F0] border-2 border-[#D9A441] space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-serif font-black text-[#7A5230] uppercase tracking-wider">
            <Scroll className="w-4 h-4 text-[#D9A441]" />
            <span>{fragment.title}</span>
          </div>

          <blockquote className="font-serif italic text-sm sm:text-base text-[#3D2413] leading-relaxed pl-4 border-l-4 border-[#7A5230]">
            "{fragment.storyText}"
          </blockquote>

          <div className="pt-2 text-xs font-serif text-[#7A5230] bg-[#FAF7F0] p-3 rounded-xl border border-[#D9A441]/50 space-y-1 shadow-xs">
            <span className="font-bold text-[#5C7A5C] font-sans">📖 Petuah Kimia Nenek Kebayan: </span>
            <p className="italic">{fragment.chemicalWisdom}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              soundManager.playDropSound();
              onOpenRecipeBook();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl paper-bg hover:bg-[#EED9C4] text-[#7A5230] font-serif font-black text-xs sm:text-sm border-2 border-[#7A5230] flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-md"
          >
            <BookOpen className="w-4 h-4 text-[#D9A441]" />
            <span>Buka Buku Resep</span>
          </button>

          {isLastMission ? (
            <button
              onClick={() => {
                soundManager.playDropSound();
                onGoToCompletion();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#D9A441] hover:bg-yellow-500 text-[#7A5230] font-serif font-black text-xs sm:text-sm border-2 border-[#FAF7F0] glow shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#7A5230]" />
              <span>Lihat Rangkuman & Sertifikat</span>
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playDropSound();
                onNextMission();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] font-serif font-black text-xs sm:text-sm border-2 border-[#D9A441] glow shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <span>Lanjut Misi {mission.id + 1}</span>
              <ArrowRight className="w-4 h-4 text-[#D9A441]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
