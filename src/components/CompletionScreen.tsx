import React, { useState } from 'react';
import { StudentProgress } from '../types';
import { STORY_FRAGMENTS, MISSIONS } from '../data/missionsData';
import { NenekAvatar } from './NenekAvatar';
import { generateCertificatePDF, generateCertificatePNG } from '../utils/pdfGenerator';
import { Download, Award, Sparkles, CheckCircle2, RotateCcw, Home, FileText, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CompletionScreenProps {
  progress: StudentProgress;
  onRestartAll: () => void;
  onGoHome: () => void;
  onOpenSheetsModal?: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  progress,
  onRestartAll,
  onGoHome,
  onOpenSheetsModal,
}) => {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState('');

  const handleDownloadPDF = () => {
    soundManager.playDropSound();
    setIsDownloadingPDF(true);
    try {
      generateCertificatePDF(progress);
      setDownloadMessage('✓ Sertifikat resmi PDF berhasil diunduh!');
      setTimeout(() => setDownloadMessage(''), 5000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setDownloadMessage('Gagal mengunduh PDF. Silakan coba tombol Gambar (PNG).');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadPNG = async () => {
    soundManager.playDropSound();
    setIsDownloadingPNG(true);
    try {
      await generateCertificatePNG(progress);
      setDownloadMessage('✓ Sertifikat resmi format Gambar PNG (HD) berhasil diunduh!');
      setTimeout(() => setDownloadMessage(''), 5000);
    } catch (err) {
      console.error('PNG Generation Error:', err);
      setDownloadMessage('Gagal mengunduh PNG.');
    } finally {
      setIsDownloadingPNG(false);
    }
  };

  const studentName = progress.studentName.trim() || 'Murid Laboratorium';
  const issueDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* Top Banner Celebration */}
      <div className="rounded-3xl wood-texture p-6 sm:p-8 text-[#FAF7F0] gold-border glow shadow-2xl text-center space-y-4 relative overflow-hidden">
        <div className="flex justify-center">
          <NenekAvatar size="xl" expression="happy" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#D9A441] text-[#3D2413] text-xs font-serif font-black uppercase tracking-wider shadow-sm border border-[#FAF7F0]/40">
            <Award className="w-4 h-4" /> Kelulusan Tabib Utama
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#FAF7F0] text-shadow">
            Tahniah, Tabib {studentName}!
          </h1>
          <p className="text-sm sm:text-base text-[#EED9C4] max-w-xl mx-auto font-serif italic leading-relaxed">
            "Segala puji bagi Tuhan Semesta Alam. Berkat ketekunan nalar dan kelembutan rasamu, seluruh ramuan penawar wabah telah sempurna diracik. Janji puluhan tahun lalu kini telah tertunai."
          </p>
        </div>

        {/* Big Action: Download Certificate Buttons (PDF & PNG) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-download-pdf-cert"
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#D9A441] hover:bg-yellow-500 text-[#7A5230] font-serif font-black text-sm sm:text-base border-2 border-[#FAF7F0] glow shadow-2xl flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <Download className="w-5 h-5 text-[#7A5230]" />
            <span>{isDownloadingPDF ? 'Menyiapkan PDF...' : 'Unduh Sertifikat (PDF)'}</span>
          </button>

          <button
            id="btn-download-png-cert"
            onClick={handleDownloadPNG}
            disabled={isDownloadingPNG}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FAF7F0] hover:bg-amber-50 text-[#7A5230] font-serif font-black text-sm sm:text-base border-2 border-[#D9A441] shadow-xl flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <ImageIcon className="w-5 h-5 text-[#5C7A5C]" />
            <span>{isDownloadingPNG ? 'Menyiapkan Gambar...' : 'Unduh Gambar (PNG HD)'}</span>
          </button>

          {onOpenSheetsModal && (
            <button
              id="btn-sync-sheets-completion"
              onClick={onOpenSheetsModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-[#FAF7F0] font-serif font-black text-sm sm:text-base border-2 border-[#FAF7F0] shadow-xl flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-5 h-5 text-[#FAF7F0]" />
              <span>Simpan ke Google Sheets</span>
            </button>
          )}

          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#5C7A5C] hover:bg-[#445E44] text-[#FAF7F0] font-serif font-black text-sm border-2 border-[#D9A441] shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#D9A441]" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {downloadMessage && (
          <p className="text-xs sm:text-sm text-amber-200 font-serif font-bold animate-fadeIn">
            {downloadMessage}
          </p>
        )}
      </div>

      {/* Rangkuman Cerita Utuh (The 4 Connected Story Fragments) */}
      <div className="rounded-3xl paper-bg gold-border glow p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-[#D9A441]/40 pb-4">
          <FileText className="w-6 h-6 text-[#5C7A5C]" />
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#3D2413] text-shadow">
              Rangkuman Cerita Utuh: Janji Tabib Muda
            </h2>
            <p className="text-xs text-[#7A5230] font-serif italic">
              Kisah lengkap penawar wabah dari Fragmen 1 hingga Fragmen 4
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {STORY_FRAGMENTS.map((frag, idx) => (
            <div
              key={frag.missionId}
              className="p-5 rounded-2xl bg-[#FAF7F0] border-2 border-[#D9A441]/60 space-y-2 relative shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-black text-[#5C7A5C] uppercase tracking-wider">
                  {frag.title}
                </span>
                <span className="text-[11px] font-serif font-bold text-[#7A5230] bg-[#FAF7F0] px-2.5 py-0.5 rounded-full border border-[#D9A441]/50 shadow-xs">
                  {frag.recipeName}
                </span>
              </div>

              <blockquote className="font-serif italic text-sm sm:text-base text-[#3D2413] leading-relaxed pl-4 border-l-4 border-[#7A5230]">
                "{frag.storyText}"
              </blockquote>

              <p className="text-xs text-[#5C3A21] pt-1 font-serif">
                <strong className="text-[#5C7A5C]">Hikmah Kimia: </strong>
                {frag.chemicalWisdom}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance & Certificate Preview Card */}
      <div className="rounded-3xl paper-bg gold-border glow p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4 border-[#D9A441]/40">
          <div className="flex items-center gap-2 text-base sm:text-lg font-serif font-black text-[#7A5230]">
            <Sparkles className="w-5 h-5 text-[#D9A441]" />
            <span>Pratinjau Sertifikat Kelulusan Resmi</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#5C7A5C]">
            ID: LNK-{Date.now().toString().slice(-6)}
          </span>
        </div>

        {/* Visual Certificate Frame */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF7F0] border-4 border-[#5C7A5C] ring-4 ring-[#D9A441]/40 text-center space-y-4 shadow-inner">
          <div className="text-xs font-serif font-black tracking-widest text-[#7A5230] uppercase">
            Laboratorium Tradisional Melayu & Kimia Analitik
          </div>

          <h3 className="text-xl sm:text-3xl font-serif font-black text-[#5C7A5C] text-shadow">
            SERTIFIKAT KELULUSAN TABIB KIMIA
          </h3>

          <div className="py-2">
            <p className="text-xs text-stone-600 font-serif italic">Diberikan dengan penuh kehormatan kepada:</p>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#7A5230] tracking-wide mt-1 uppercase">
              {studentName}
            </div>
            <div className="w-48 h-0.5 bg-[#D9A441] mx-auto mt-1" />
          </div>

          <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed font-serif">
            Telah membuktikan keahlian dalam menakar <strong>Konsentrasi Larutan</strong>, mempraktikkan <strong>Titrasi Asam-Basa</strong>, serta menemukan <strong>Titik Ekuivalen</strong> ramuan penawar wabah.
          </p>

          {/* Performance Table */}
          <div className="max-w-md mx-auto rounded-xl bg-[#FAF7F0] border border-[#D9A441] p-3 text-xs text-left space-y-1.5 shadow-xs">
            <div className="font-serif font-bold text-[#7A5230] border-b pb-1 border-[#D9A441]/40 flex justify-between">
              <span>Misi Pembelajaran</span>
              <span>Jumlah Percobaan</span>
            </div>
            {MISSIONS.map((m) => (
              <div key={m.id} className="flex justify-between text-stone-700 font-serif">
                <span>Misi {m.id} ({m.topic.split('&')[0]})</span>
                <span className="font-bold text-[#5C7A5C]">{progress.missionAttempts[m.id] || 1}x percobaan</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-stone-600 border-t border-[#D9A441]/30 font-serif">
            <span>Diterbitkan: {issueDate}</span>
            <span className="italic font-bold text-[#7A5230]">Tabib Nenek Kebayan</span>
          </div>
        </div>

        {/* Restart / Replay Option */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              if (window.confirm('Apakah cucunda ingin mengulang seluruh 4 misi dari awal?')) {
                onRestartAll();
              }
            }}
            className="text-xs font-serif font-bold text-[#7A5230] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mulai Ulang Seluruh Pembelajaran dari Awal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
