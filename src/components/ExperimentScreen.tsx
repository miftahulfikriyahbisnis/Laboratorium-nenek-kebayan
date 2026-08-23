import React, { useState, useEffect, useRef } from 'react';
import { Mission, StudentProgress } from '../types';
import { NenekAvatar } from './NenekAvatar';
import {
  Timer,
  RotateCcw,
  Sparkles,
  FlaskConical,
  Droplets,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Info,
  Target,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { HintLockIndicator } from './HintLockIndicator';

interface ExperimentScreenProps {
  mission: Mission;
  progress: StudentProgress;
  isPausedByTab: boolean;
  onUpdateAttempts?: (missionId: number, attempts: number) => void;
  onMissionSuccess: (missionId: number, attempts: number) => void;
  onBackToHome: () => void;
}

export const ExperimentScreen: React.FC<ExperimentScreenProps> = ({
  mission,
  progress,
  isPausedByTab,
  onUpdateAttempts,
  onMissionSuccess,
  onBackToHome,
}) => {
  const config = mission.experimentConfig;

  // State for reagents
  const [valA, setValA] = useState<number>(config.reagentADefault);
  const [valB, setValB] = useState<number>(config.reagentBDefault);

  // Timer: 60 seconds countdown
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [attempts, setAttempts] = useState<number>(progress.missionAttempts[mission.id] || 1);
  const [isStirred, setIsStirred] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'under' | 'target' | 'over'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Atur takaran reagen lalu klik "Aduk & Uji Ramuan"');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Time spent on this mission in seconds
  const timeSpentSeconds = progress.missionTimeSpent?.[mission.id] || 0;

  // Countdown timer effect (with pause when tab is blurred)
  useEffect(() => {
    if (isPausedByTab) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired! Reset attempt
          handleTimeExpired();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPausedByTab, attempts]);

  const handleTimeExpired = () => {
    soundManager.playFocusWarningSound();
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    onUpdateAttempts?.(mission.id, nextAttempts);
    setIsStirred(false);
    setTestStatus('idle');
    setStatusMessage('⏱️ Waktu 60 detik telah habis! Percobaan direset, ayo racik kembali dengan lebih tangkas!');
    setValA(config.reagentADefault);
    setValB(config.reagentBDefault);
  };

  const handleResetAttempt = () => {
    soundManager.playDropSound();
    setTimeLeft(60);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    onUpdateAttempts?.(mission.id, nextAttempts);
    setIsStirred(false);
    setTestStatus('idle');
    setStatusMessage('Percobaan direset ke takaran awal. Waktu kembali ke 60 detik.');
    setValA(config.reagentADefault);
    setValB(config.reagentBDefault);
  };

  // Determine solution color based on reagent ratios
  const getPotionAppearance = () => {
    // For Misi 1: Ratio of A (concentrate) to total volume (A+B)
    if (mission.id === 1) {
      const concentration = (valA * 2.0) / (valA + valB); // target 0.50 M
      if (concentration < 0.45) {
        return { color: config.colorStates.under.color, state: 'under', label: config.colorStates.under.label };
      } else if (concentration > 0.55) {
        return { color: config.colorStates.over.color, state: 'over', label: config.colorStates.over.label };
      } else {
        return { color: config.colorStates.target.color, state: 'target', label: config.colorStates.target.label };
      }
    }

    // For Misi 2, 3, 4: Titration stoichiometry
    const diffB = valB - config.targetReagentB;
    if (diffB < -config.toleranceB) {
      return { color: config.colorStates.under.color, state: 'under', label: config.colorStates.under.label };
    } else if (diffB > config.toleranceB) {
      return { color: config.colorStates.over.color, state: 'over', label: config.colorStates.over.label };
    } else {
      return { color: config.colorStates.target.color, state: 'target', label: config.colorStates.target.label };
    }
  };

  const potion = getPotionAppearance();

  const handleStirAndTest = () => {
    soundManager.playBoilingSound();
    setIsStirred(true);

    const result = getPotionAppearance();
    setTestStatus(result.state as 'under' | 'target' | 'over');

    if (result.state === 'target') {
      setStatusMessage(config.colorStates.target.feedback);
      soundManager.playSuccessSound();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D9A441', '#5C7A5C', '#FAF7F0', '#4E8752'],
      });
      // Proceed to success modal after brief dramatic delay
      setTimeout(() => {
        onMissionSuccess(mission.id, attempts);
      }, 1400);
    } else if (result.state === 'under') {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      onUpdateAttempts?.(mission.id, nextAttempts);
      setStatusMessage(config.colorStates.under.feedback);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      onUpdateAttempts?.(mission.id, nextAttempts);
      setStatusMessage(config.colorStates.over.feedback);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-5 animate-fadeIn">
      {/* Top Bar: Progress, Attempts, Timer */}
      <div className="flex flex-wrap items-center justify-between gap-3 wood-texture text-[#FAF7F0] p-4 rounded-3xl gold-border glow shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-2 rounded-xl bg-[#5C7A5C] hover:bg-[#445E44] text-[#FAF7F0] border border-[#D9A441] text-xs font-serif font-black shadow-sm cursor-pointer"
          >
            ← Menu
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-serif font-black flex items-center gap-2 text-[#FAF7F0] text-shadow">
              <span>{mission.title}</span>
            </h1>
            <p className="text-xs text-[#EED9C4] font-serif italic">
              🔬 {mission.subtitle}
            </p>
          </div>
        </div>

        {/* Status Pills: Timer & Attempts */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Attempts counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl wood-texture-dark border border-[#D9A441] text-xs font-serif font-bold text-[#D9A441] shadow-inner">
            <Droplets className="w-4 h-4" />
            <span>Percobaan ke-{attempts}</span>
          </div>

          {/* 60s Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl font-mono font-black text-xs sm:text-sm border-2 shadow-inner ${
              timeLeft <= 10
                ? 'bg-rose-900 text-rose-100 border-rose-400 animate-pulse'
                : 'bg-[#5C7A5C] text-[#FAF7F0] border-[#D9A441]'
            }`}
          >
            <Timer className="w-4 h-4 text-[#D9A441]" />
            <span>{timeLeft}s</span>
            {isPausedByTab && <span className="text-[10px] uppercase ml-1">(Jeda)</span>}
          </div>

          {/* Reset Attempt Button */}
          <button
            id="btn-reset-experiment-attempt"
            onClick={handleResetAttempt}
            className="p-2 rounded-2xl wood-texture-dark hover:bg-[#3D2413] text-[#FAF7F0] border border-[#D9A441] transition shadow-inner cursor-pointer"
            title="Reset Percobaan Ini"
          >
            <RotateCcw className="w-4 h-4 text-[#D9A441]" />
          </button>
        </div>
      </div>

      {/* Challenge Problem Statement & Theoretical Guide Banner */}
      <div className="rounded-3xl paper-bg gold-border glow p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 border-b border-[#D9A441]/40 pb-2">
          <BookOpen className="w-5 h-5 text-[#D9A441]" />
          <span className="text-xs sm:text-sm font-serif font-black text-[#7A5230] uppercase tracking-wider">
            Soal Kasus Kimia: {mission.title}
          </span>
        </div>

        {/* Problem text */}
        <p className="text-xs sm:text-sm font-serif font-semibold text-[#3D2413] leading-relaxed bg-[#FAF7F0] p-3 rounded-2xl border border-[#D9A441]/50 shadow-inner">
          "{mission.challengeQuestion}"
        </p>

        {/* Hint Lock & Progressive Unlock Component */}
        <HintLockIndicator
          mission={mission}
          attempts={attempts}
          timeSpentSeconds={timeSpentSeconds}
        />

        {/* Mission Objectives & Chemical Theory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Target Sasaran */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#5C7A5C]/40 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-serif font-black uppercase tracking-wider text-[#5C7A5C]">
              <Target className="w-3.5 h-3.5" />
              <span>Target Sasaran Cucunda:</span>
            </div>
            <ul className="space-y-1 text-xs text-[#3D2413] font-serif">
              {mission.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-1 leading-snug">
                  <span className="text-[#D9A441] font-bold shrink-0">✦</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Konsep Kimiawi */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#7A5230]/40 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-serif font-black uppercase tracking-wider text-[#7A5230]">
              <FlaskConical className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>{mission.scientificConcept.title}:</span>
            </div>
            <p className="text-xs text-[#3D2413] leading-relaxed font-serif">
              {mission.scientificConcept.summary}
            </p>
            <div className="p-1.5 rounded-xl bg-[#FAF7F0] border border-[#D9A441]/60 font-mono font-bold text-[11px] text-[#5C3A21] text-center shadow-inner">
              {mission.scientificConcept.formula}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Cauldron & Visual Indicator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between rounded-3xl paper-bg gold-border glow p-6 shadow-xl space-y-4 relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b pb-2 border-[#D9A441]/40">
            <span className="text-xs font-serif font-black text-[#7A5230] uppercase tracking-wider">
              {config.cauldronName}
            </span>
            <span className="text-[11px] font-serif font-bold text-[#5C7A5C] bg-[#5C7A5C]/15 px-2.5 py-0.5 rounded-full border border-[#5C7A5C]/30">
              {config.indicatorName}
            </span>
          </div>

          {/* Realistic Animated Cauldron SVG */}
          <div className="relative w-56 h-56 flex items-center justify-center my-2">
            {/* Steam bubbles */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="w-3 h-3 rounded-full bg-white/60 blur-xs animate-bounce [animation-duration:1.2s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/60 blur-xs animate-bounce [animation-delay:0.3s] [animation-duration:1.5s]" />
              <span className="w-3.5 h-3.5 rounded-full bg-white/60 blur-xs animate-bounce [animation-delay:0.6s] [animation-duration:1.1s]" />
            </div>

            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl select-none">
              {/* Cauldron Tripod Stand */}
              <path d="M45 155 L25 190" stroke="#3D2413" strokeWidth="6" strokeLinecap="round" />
              <path d="M155 155 L175 190" stroke="#3D2413" strokeWidth="6" strokeLinecap="round" />
              <path d="M100 165 L100 192" stroke="#3D2413" strokeWidth="6" strokeLinecap="round" />

              {/* Fire Flame beneath cauldron */}
              <g transform="translate(70, 160)">
                <path d="M15 25 Q30 0 45 25 Q30 30 15 25 Z" fill="#D9A441" />
                <path d="M22 25 Q30 8 38 25 Z" fill="#E25A42" className="animate-pulse" />
              </g>

              {/* Cauldron Outer Belly (Cast Iron / Clay) */}
              <ellipse cx="100" cy="115" rx="75" ry="60" fill="#3D2413" stroke="#25150A" strokeWidth="4" />
              {/* Cauldron Rim */}
              <ellipse cx="100" cy="65" rx="65" ry="18" fill="#5C3A21" stroke="#25150A" strokeWidth="3" />
              <ellipse cx="100" cy="65" rx="57" ry="14" fill="#25150A" />

              {/* Liquid Potion inside Cauldron (Dynamic Color) */}
              <ellipse
                cx="100"
                cy="70"
                rx="54"
                ry="12"
                fill={isStirred ? potion.color : '#8A7156'}
                className="transition-colors duration-700"
              />

              {/* Cauldron Highlights and Herbal Droplet Swirls */}
              {isStirred && (
                <g>
                  <circle cx="90" cy="70" r="3" fill="#FFFFFF" fillOpacity="0.5" className="animate-ping" />
                  <circle cx="115" cy="68" r="2" fill="#FFFFFF" fillOpacity="0.6" className="animate-ping" />
                </g>
              )}

              {/* Cauldron Handles */}
              <path d="M35 75 Q15 85 35 105" stroke="#3D2413" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M165 75 Q185 85 165 105" stroke="#3D2413" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Color Indicator Badge */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-serif">
              <span className="font-bold text-[#7A5230]">Warna Indikator Saat Ini:</span>
              <span className="font-semibold text-stone-700 italic">
                {isStirred ? potion.label : 'Belum Diaduk'}
              </span>
            </div>

            <div
              className={`p-3 rounded-2xl border-2 text-center text-xs font-serif font-black transition-all shadow-inner ${
                isStirred
                  ? testStatus === 'target'
                    ? config.colorStates.target.bgClass
                    : testStatus === 'under'
                    ? config.colorStates.under.bgClass
                    : config.colorStates.over.bgClass
                  : 'bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs"
                  style={{ backgroundColor: isStirred ? potion.color : '#8A7156' }}
                />
                <span>{isStirred ? potion.label : 'Aduk ramuan untuk melihat reaksi indikator'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reagent Controllers & Scientific Feedback (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl paper-bg gold-border glow p-6 shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-[#D9A441]/40">
              <h2 className="text-base sm:text-lg font-serif font-black text-[#3D2413] flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#5C7A5C]" />
                <span>Pengaturan Takaran Reagen</span>
              </h2>
              <span className="text-xs font-mono font-bold text-[#7A5230]">
                M1·V1 = M2·V2 / nA = nB
              </span>
            </div>

            {/* Reagent A Control Box */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#D9A441] space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-serif font-bold text-[#3D2413]">
                  {config.reagentAName}
                </span>
                <span className="text-base font-mono font-black text-[#5C7A5C] bg-[#FAF7F0] px-3 py-0.5 rounded-xl border border-[#D9A441] shadow-inner">
                  {valA} {config.reagentAUnit}
                </span>
              </div>

              {config.reagentAStep > 0 ? (
                <div className="space-y-2">
                  <input
                    id="slider-reagent-a"
                    type="range"
                    min={config.reagentAMin}
                    max={config.reagentAMax}
                    step={config.reagentAStep}
                    value={valA}
                    onChange={(e) => {
                      soundManager.playDropSound();
                      setValA(Number(e.target.value));
                      setIsStirred(false);
                    }}
                    className="w-full accent-[#5C7A5C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#7A5230] font-mono font-medium">
                    <span>{config.reagentAMin} {config.reagentAUnit}</span>
                    <span>{config.reagentAMax} {config.reagentAUnit}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#7A5230] font-serif italic">
                  Volume sampel tetap {valA} {config.reagentAUnit} (kadar asam diuji lewat titrasi).
                </p>
              )}
            </div>

            {/* Reagent B Control Box (Titrant / Diluent) */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#7A5230] space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-serif font-bold text-[#3D2413]">
                  {config.reagentBName}
                </span>
                <span className="text-base font-mono font-black text-[#7A5230] bg-[#FAF7F0] px-3 py-0.5 rounded-xl border border-[#7A5230] shadow-inner">
                  {valB} {config.reagentBUnit}
                </span>
              </div>

              <div className="space-y-2">
                <input
                  id="slider-reagent-b"
                  type="range"
                  min={config.reagentBMin}
                  max={config.reagentBMax}
                  step={config.reagentBStep}
                  value={valB}
                  onChange={(e) => {
                    soundManager.playDropSound();
                    setValB(Number(e.target.value));
                    setIsStirred(false);
                  }}
                  className="w-full accent-[#7A5230] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#7A5230] font-mono font-medium">
                  <span>{config.reagentBMin} {config.reagentBUnit}</span>
                  <span>{config.reagentBMax} {config.reagentBUnit}</span>
                </div>
              </div>

              {/* Precision Micro-drop Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-serif font-bold text-[#7A5230]">Tetes Presisi:</span>
                <button
                  onClick={() => {
                    soundManager.playDropSound();
                    setValB((prev) => Math.max(config.reagentBMin, Number((prev - config.reagentBStep).toFixed(1))));
                    setIsStirred(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] hover:bg-[#EED9C4] text-[#3D2413] font-bold text-xs border border-[#7A5230] transition active:scale-95 cursor-pointer shadow-xs"
                >
                  -{config.reagentBStep}
                </button>
                <button
                  onClick={() => {
                    soundManager.playDropSound();
                    setValB((prev) => Math.min(config.reagentBMax, Number((prev + config.reagentBStep).toFixed(1))));
                    setIsStirred(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] hover:bg-[#EED9C4] text-[#3D2413] font-bold text-xs border border-[#7A5230] transition active:scale-95 cursor-pointer shadow-xs"
                >
                  +{config.reagentBStep}
                </button>
              </div>
            </div>

            {/* Direct Feedback Message Box */}
            <div
              className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-serif leading-relaxed flex items-start gap-3 shadow-inner ${
                testStatus === 'target'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-500'
                  : testStatus === 'under' || testStatus === 'over'
                  ? 'bg-amber-50 text-amber-950 border-amber-500'
                  : 'bg-[#FAF7F0] text-[#3D2413] border-[#D9A441]/50'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {testStatus === 'target' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : testStatus === 'under' || testStatus === 'over' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <Flame className="w-5 h-5 text-[#D9A441]" />
                )}
              </div>
              <p>{statusMessage}</p>
            </div>
          </div>

          {/* Action Stir & Test Button */}
          <button
            id="btn-stir-and-test"
            onClick={handleStirAndTest}
            className="w-full py-4 px-6 rounded-2xl wood-texture hover:bg-[#5C3A21] text-white font-serif font-black text-sm sm:text-base border-2 border-[#D9A441] glow shadow-2xl flex items-center justify-center gap-2.5 transition transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#D9A441]" />
            <span>ADUK & UJI KUALI RAMUAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
