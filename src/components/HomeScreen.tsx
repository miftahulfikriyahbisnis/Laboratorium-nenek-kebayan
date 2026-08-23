import React, { useState } from 'react';
import { MISSIONS } from '../data/missionsData';
import { StudentProgress } from '../types';
import { NenekAvatar } from './NenekAvatar';
import { MissionMap } from './MissionMap';
import { Play, Lock, CheckCircle2, BookOpen, Sparkles, User, Award, Flame, Map, LayoutGrid } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HomeScreenProps {
  progress: StudentProgress;
  onUpdateName: (name: string) => void;
  onSelectMission: (missionId: number) => void;
  onOpenRecipeBook: () => void;
  onOpenCompletionSummary?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onUpdateName,
  onSelectMission,
  onOpenRecipeBook,
  onOpenCompletionSummary,
}) => {
  const [nameInput, setNameInput] = useState(progress.studentName);
  const [errorName, setErrorName] = useState('');
  const [viewMode, setViewMode] = useState<'MAP' | 'GRID'>('MAP');

  const allCompleted = progress.completedMissions.length === 4;

  const handleStartMission = (missionId: number) => {
    if (!nameInput.trim()) {
      setErrorName('Wahai cucunda, silakan isi nama terlebih dahulu sebelum melangkah ke kuali ramuan!');
      soundManager.playDropSound();
      return;
    }
    setErrorName('');
    onUpdateName(nameInput.trim());
    soundManager.playDropSound();
    onSelectMission(missionId);
  };

  const getMissionIcon = (id: number) => {
    switch (id) {
      case 1:
        return '🏺';
      case 2:
        return '🌿';
      case 3:
        return '📜';
      case 4:
        return '👵';
      default:
        return '✨';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn relative">
      {/* Background Decorative Botanical Watermark */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none z-0">
        <span className="text-[360px] leading-none">🍃</span>
      </div>

      {/* Hero Welcome Card */}
      <div className="relative z-10 overflow-hidden rounded-3xl wood-texture text-[#FAF7F0] p-6 sm:p-8 gold-border glow shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#D9A441]/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#5C7A5C]/30 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative">
              <NenekAvatar size="xl" expression="happy" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#D9A441] text-[#3D2413] text-xs font-black uppercase tracking-wider shadow-md border border-[#FAF7F0]/60 whitespace-nowrap">
                <Flame className="w-3.5 h-3.5 fill-[#3D2413]" /> Tabib Kampung
              </div>
            </div>
          </div>

          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5C7A5C] text-[#FAF7F0] text-xs font-bold border border-[#D9A441] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" /> Media Pembelajaran Kimia SMA Kelas XI
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#FAF7F0] leading-snug text-shadow">
              Selamat Datang di <br className="hidden sm:inline" />
              <span className="text-[#D9A441] text-shadow-gold">Laboratorium Nenek Kebayan</span>
            </h1>
            <p className="text-sm sm:text-base text-[#EED9C4] leading-relaxed max-w-xl font-serif italic">
              "Wahai anak muda yang budiman, kampung kita sedang dilanda wabah demam yang ganjil. 
              Bantulah nenek memecahkan formula warisan leluhur melalui rahasia <strong>Konsentrasi Larutan</strong> dan ketelitian <strong>Titrasi Asam-Basa</strong>."
            </p>
          </div>
        </div>

        {/* Student Name Input Bar */}
        <div className="mt-6 pt-6 border-t border-[#D9A441]/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5230]">
              <User className="w-5 h-5 text-[#D9A441]" />
            </div>
            <input
              id="input-student-name"
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorName) setErrorName('');
              }}
              placeholder="Ketik Nama Lengkap Peserta / Murid..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl paper-bg text-[#3D2413] font-serif font-bold placeholder-[#7A5230]/60 border-2 border-[#D9A441] focus:outline-none focus:ring-4 focus:ring-[#D9A441]/40 shadow-inner text-sm sm:text-base transition"
            />
          </div>

          <button
            id="btn-open-recipe-book-home"
            onClick={onOpenRecipeBook}
            className="px-5 py-3 rounded-2xl bg-[#D9A441] hover:bg-yellow-500 text-[#7A5230] font-black text-sm border-2 border-[#FAF7F0]/40 flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#7A5230]" />
            <span>Buku Resep ({progress.completedMissions.length}/4)</span>
          </button>
        </div>

        {errorName && (
          <p className="mt-2 text-xs sm:text-sm text-amber-200 font-bold bg-rose-900/60 p-2 rounded-xl border border-rose-400 inline-block animate-shake">
            ⚠️ {errorName}
          </p>
        )}
      </div>

      {/* If All Completed Banner */}
      {allCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-[#3D2413] gold-border glow-lg shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-serif font-black text-xl">
              <Award className="w-6 h-6 text-[#3D2413]" />
              <span>Seluruh 4 Misi Telah Tuntas!</span>
            </div>
            <p className="text-xs sm:text-sm font-serif font-semibold text-[#3D2413]/90">
              Cucunda telah menyibak seluruh fragmen cerita dan menguasai stoikiometri titrasi ramuan.
            </p>
          </div>

          <button
            id="btn-view-completion-certificate"
            onClick={onOpenCompletionSummary}
            className="px-6 py-3 rounded-2xl wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] font-black text-sm border-2 border-[#FAF7F0] shadow-xl flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#D9A441]" />
            <span>Buka Cerita Utuh & Unduh Sertifikat (PDF)</span>
          </button>
        </div>
      )}

      {/* Status Kelulusan & Missions Section */}
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#4a634a] p-4 sm:p-5 rounded-2xl border-2 border-[#7A5230] text-[#FAF7F0] shadow-md">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#FAF7F0] flex items-center gap-2 text-shadow">
              <span>Jelajah 4 Titik Misi Herbal</span>
            </h2>
            <p className="text-xs text-[#EED9C4] font-serif italic">
              Buka lembaran demi lembaran untuk mengungkap rahasia tabib leluhur
            </p>
          </div>

          {/* Controls: Mode Toggle & Progress Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle Button */}
            <div className="bg-[#FAF7F0] p-1 rounded-xl gold-border-2 flex items-center shadow-inner">
              <button
                id="btn-toggle-map-view"
                onClick={() => setViewMode('MAP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-black flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'MAP'
                    ? 'wood-texture text-[#FAF7F0] shadow-xs'
                    : 'text-[#7A5230] hover:bg-stone-200'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Peta Titik Misi</span>
              </button>
              <button
                id="btn-toggle-grid-view"
                onClick={() => setViewMode('GRID')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-black flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'GRID'
                    ? 'wood-texture text-[#FAF7F0] shadow-xs'
                    : 'text-[#7A5230] hover:bg-stone-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Daftar Kartu</span>
              </button>
            </div>

            {/* Mini Status Progress Bar */}
            <div className="paper-bg text-[#7A5230] px-3.5 py-1.5 rounded-xl gold-border flex items-center gap-2.5 shadow-inner">
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold tracking-wider">Kemajuan:</div>
                <div className="text-xs font-black text-[#5C7A5C]">
                  {progress.completedMissions.length}/4 ({progress.completedMissions.length * 25}%)
                </div>
              </div>
              <div className="w-16 bg-stone-300 h-2.5 rounded-full overflow-hidden border border-[#7A5230]/30">
                <div
                  className="bg-[#5C7A5C] h-full transition-all duration-500"
                  style={{ width: `${progress.completedMissions.length * 25}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* View Mode 1: Interactive Adventure Map */}
        {viewMode === 'MAP' ? (
          <MissionMap
            progress={progress}
            onSelectMission={(missionId) => handleStartMission(missionId)}
          />
        ) : (
          /* View Mode 2: Detailed Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MISSIONS.map((mission) => {
              const isCompleted = progress.completedMissions.includes(mission.id);
              const isUnlocked = mission.id === 1 || progress.completedMissions.includes(mission.id - 1);
              const attempts = progress.missionAttempts[mission.id] || 0;

              return (
                <div
                  key={mission.id}
                  id={`card-mission-${mission.id}`}
                  className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                    !isUnlocked
                      ? 'bg-black/20 border-2 border-stone-400 opacity-60 backdrop-blur-xs'
                      : isCompleted
                      ? 'paper-bg border-3 border-[#5C7A5C] shadow-lg hover:shadow-2xl hover:-translate-y-1'
                      : 'paper-bg gold-border glow shadow-xl hover:shadow-2xl hover:-translate-y-1'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Badge Row */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-serif font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-[#5C7A5C] text-[#FAF7F0] shadow-sm'
                            : isUnlocked
                            ? 'bg-[#D9A441] text-[#3D2413] shadow-sm'
                            : 'bg-stone-400 text-stone-700'
                        }`}
                      >
                        Misi {mission.id}
                      </span>

                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#5C7A5C] bg-[#5C7A5C]/15 px-2.5 py-0.5 rounded-full border border-[#5C7A5C]/40">
                          <CheckCircle2 className="w-4 h-4" /> Tuntas ({attempts}x coba)
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-xs font-serif font-bold text-[#7A5230] bg-[#D9A441]/25 px-2.5 py-0.5 rounded-full border border-[#D9A441]/60">
                          ✨ Terbuka untuk Diracik
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-stone-600 bg-stone-200 px-2 py-0.5 rounded-md">
                          <Lock className="w-3.5 h-3.5" /> Terkunci
                        </span>
                      )}
                    </div>

                    {/* Centered Artistic Icon & Title */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0 border-2 ${
                          isUnlocked
                            ? 'bg-[#D9A441] text-[#7A5230] border-[#FAF7F0]'
                            : 'bg-stone-300 text-stone-500 border-stone-400'
                        }`}
                      >
                        {getMissionIcon(mission.id)}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-serif font-black text-[#3D2413] leading-snug">
                          {mission.title.replace(`Misi ${mission.id}: `, '')}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-[#5C7A5C]">
                          🔬 {mission.topic}
                        </p>
                      </div>
                    </div>

                    {/* Context excerpt */}
                    <p className="text-xs sm:text-sm text-[#7A5230] line-clamp-2 leading-relaxed font-serif italic bg-[#FAF7F0] p-3 rounded-xl border border-[#D9A441]/30">
                      "{mission.herbalContext}"
                    </p>

                    {/* Scientific formula hint badge */}
                    <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#7A5230]/30 text-xs font-mono text-[#5C3A21] flex items-center justify-between">
                      <span className="font-bold font-sans text-[#7A5230]">Formula:</span>
                      <span className="font-bold">{mission.scientificConcept.formula}</span>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="mt-5 pt-4 border-t border-stone-200">
                    {isUnlocked ? (
                      <button
                        id={`btn-start-mission-${mission.id}`}
                        onClick={() => handleStartMission(mission.id)}
                        className={`w-full py-3 px-4 rounded-2xl font-serif font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 cursor-pointer ${
                          isCompleted
                            ? 'bg-[#5C7A5C] hover:bg-[#4E684E] text-[#FAF7F0] border-2 border-[#D9A441]'
                            : 'wood-texture hover:bg-[#5C3A21] text-white border-2 border-[#D9A441] glow'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current text-[#D9A441]" />
                        <span>{isCompleted ? 'ULANGI EKSPERIMEN' : 'MULAI EKSPERIMEN'}</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-2xl font-serif font-bold text-xs sm:text-sm bg-stone-300 text-stone-600 border border-stone-400 flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Selesaikan Misi {mission.id - 1} Dahulu</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
