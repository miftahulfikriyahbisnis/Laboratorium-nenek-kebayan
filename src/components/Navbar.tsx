import React from 'react';
import { BookOpen, Volume2, VolumeX, Home, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  studentName: string;
  completedMissionsCount: number;
  onOpenRecipeBook: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  studentName,
  completedMissionsCount,
  onOpenRecipeBook,
  onGoHome,
  showHomeButton = false,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.isMuted);

  const toggleSound = () => {
    soundManager.isMuted = !soundManager.isMuted;
    setIsMuted(soundManager.isMuted);
    if (!soundManager.isMuted) {
      soundManager.playDropSound();
    }
  };

  return (
    <header className="sticky top-0 z-30 wood-texture text-[#FAF7F0] shadow-xl border-b-4 border-[#D9A441]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          {showHomeButton && onGoHome && (
            <button
              id="btn-nav-home"
              onClick={onGoHome}
              className="p-2 rounded-xl bg-[#5C7A5C] hover:bg-[#445E44] text-white border border-[#D9A441] transition shadow-md"
              title="Kembali ke Beranda"
            >
              <Home className="w-5 h-5" />
            </button>
          )}

          {/* Artistic Monogram Badge */}
          <div className="w-10 h-10 bg-[#D9A441] rounded-full flex items-center justify-center text-[#7A5230] font-serif font-black text-lg shadow-md border-2 border-[#FAF7F0] shrink-0">
            NK
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-wide text-[#FAF7F0] text-shadow">
                Laboratorium Nenek Kebayan
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#5C7A5C] text-[#FAF7F0] border border-[#D9A441] font-bold shadow-sm">
                <Sparkles className="w-3 h-3 text-[#D9A441]" /> Kimia SMA XI
              </span>
            </div>
            <span className="text-xs text-[#EED9C4] font-serif italic hidden md:inline">
              Eksperimen Konsentrasi & Titrasi Ramuan Tradisional
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Student Name Badge */}
          {studentName && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl wood-texture-dark border border-[#D9A441]/70 text-xs font-semibold text-[#FAF7F0] shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-ping" />
              <span>Peserta: <span className="font-bold underline text-[#D9A441]">{studentName}</span></span>
            </div>
          )}

          {/* Recipe Book Button */}
          <button
            id="btn-nav-recipe-book"
            onClick={onOpenRecipeBook}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D9A441] hover:bg-yellow-500 text-[#7A5230] font-black text-xs sm:text-sm shadow-md transition transform active:scale-95 border border-[#FAF7F0]/40 cursor-pointer"
            title="Buka Buku Resep & Fragmen Cerita"
          >
            <BookOpen className="w-4 h-4 text-[#7A5230]" />
            <span>Buku Resep</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#7A5230] text-[#FAF7F0] text-xs font-black">
              {completedMissionsCount}/4
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-nav-sound-toggle"
            onClick={toggleSound}
            className="p-2 rounded-xl wood-texture-dark hover:bg-[#472D1A] text-[#FAF7F0] border border-[#D9A441]/60 transition shadow-inner cursor-pointer"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-[#D9A441]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
