import React, { useEffect, useState } from 'react';
import { soundManager } from '../utils/audio';
import { PauseCircle, Sparkles } from 'lucide-react';
import { NenekAvatar } from './NenekAvatar';

interface FocusLostAlertProps {
  onFocusChange?: (isFocused: boolean) => void;
  activeScreen: string;
}

export const FocusLostAlert: React.FC<FocusLostAlertProps> = ({
  onFocusChange,
  activeScreen,
}) => {
  const [isTabBlurred, setIsTabBlurred] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabBlurred(true);
        if (activeScreen === 'EXPERIMENT' || activeScreen === 'AI_CONSULTATION') {
          soundManager.playFocusWarningSound();
        }
        if (onFocusChange) onFocusChange(false);
      } else {
        // Tab resumed
        setIsTabBlurred(false);
        if (onFocusChange) onFocusChange(true);
      }
    };

    const handleWindowBlur = () => {
      // Optional extra safety
      if (activeScreen === 'EXPERIMENT') {
        setIsTabBlurred(true);
        soundManager.playFocusWarningSound();
        if (onFocusChange) onFocusChange(false);
      }
    };

    const handleWindowFocus = () => {
      setIsTabBlurred(false);
      if (onFocusChange) onFocusChange(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [activeScreen, onFocusChange]);

  if (!isTabBlurred || (activeScreen !== 'EXPERIMENT' && activeScreen !== 'AI_CONSULTATION')) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="max-w-md w-full paper-bg rounded-3xl p-6 gold-border glow shadow-2xl text-center space-y-4">
        <div className="flex justify-center">
          <NenekAvatar size="lg" expression="thinking" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[#7A5230] font-serif font-black text-xl text-shadow">
          <PauseCircle className="w-6 h-6 text-[#D9A441] animate-pulse" />
          <span>Percobaan Sedang Dijeda</span>
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-2xl border-2 border-[#D9A441] text-sm text-[#3D2413] leading-relaxed shadow-inner">
          <p className="font-serif italic font-medium">
            "Wahai cucunda, Nenek melihat pandanganmu beralih dari kuali ramuan. 
            Timer percobaan dijeda sejenak demi keadilan racikan. 
            Bila sudah siap, mari kembali fokus menakar ramuan ya!"
          </p>
        </div>

        <button
          onClick={() => {
            setIsTabBlurred(false);
            if (onFocusChange) onFocusChange(true);
            soundManager.playDropSound();
          }}
          className="w-full py-3.5 px-6 rounded-2xl wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] font-serif font-black text-base shadow-xl border-2 border-[#D9A441] glow flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-[#D9A441]" />
          <span>Lanjutkan Meracik Ramuan</span>
        </button>
      </div>
    </div>
  );
};
