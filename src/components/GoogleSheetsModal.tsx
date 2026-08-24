import React, { useState, useEffect } from 'react';
import { StudentProgress } from '../types';
import { GoogleSheetsService, DEFAULT_MASTER_SHEET_ID } from '../utils/googleSheets';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Users,
  Sparkles,
  Link,
  RotateCcw,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: StudentProgress;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  const [sheetId, setSheetId] = useState<string>(() => GoogleSheetsService.getStoredSheetId());
  const [sheetInput, setSheetInput] = useState<string>(sheetId);
  const [sheetData, setSheetData] = useState<any[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncingCurrent, setIsSyncingCurrent] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const activeId = GoogleSheetsService.getStoredSheetId();
      setSheetId(activeId);
      setSheetInput(activeId);
      handleFetchSheetData(activeId);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalTimeSeconds = Object.values(progress.missionTimeSpent || {}).reduce<number>((a, b) => Number(a) + Number(b), 0);
  const totalMinutes = (totalTimeSeconds / 60).toFixed(1);

  const handleFetchSheetData = async (targetId: string) => {
    if (!targetId.trim()) return;
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const token = await GoogleSheetsService.requestToken();
      await GoogleSheetsService.initializeHeaderIfEmpty(token, targetId.trim());
      const rows = await GoogleSheetsService.readSpreadsheet(token, targetId.trim());
      setSheetData(rows);
      setSheetId(targetId.trim());
      GoogleSheetsService.setStoredSheetId(targetId.trim());
      setStatusMsg({ type: 'success', text: 'Data rekapitulasi berhasil dimuat dari Google Sheet Utama Guru!' });
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        type: 'error',
        text: err?.message || 'Gagal memuat data spreadsheet. Pastikan izin akses Google telah disetujui.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToMaster = () => {
    const masterId = GoogleSheetsService.resetToMasterSheetId();
    setSheetId(masterId);
    setSheetInput(masterId);
    handleFetchSheetData(masterId);
  };

  const handleSyncCurrentStudent = async () => {
    if (!progress.studentName.trim()) {
      setStatusMsg({
        type: 'error',
        text: 'Silakan isi Nama Siswa terlebih dahulu di Beranda sebelum mengirim data!',
      });
      return;
    }

    setIsSyncingCurrent(true);
    setStatusMsg(null);
    try {
      const token = await GoogleSheetsService.requestToken();
      const targetSheetId = sheetId || DEFAULT_MASTER_SHEET_ID;

      await GoogleSheetsService.initializeHeaderIfEmpty(token, targetSheetId);

      const completedCount = progress.completedMissions.length;
      const isAllDone = completedCount === 4;

      const newRow = [
        new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        progress.studentName,
        `${completedCount}/4 (${completedCount * 25}%)`,
        progress.missionAttempts[1] || 0,
        progress.missionAttempts[2] || 0,
        progress.missionAttempts[3] || 0,
        progress.missionAttempts[4] || 0,
        totalMinutes,
        isAllDone ? 'Lulus Sempurna (Master Tabib)' : 'Sedang Belajar',
      ];

      await GoogleSheetsService.appendRows(token, targetSheetId, [newRow]);
      soundManager.playSuccessSound();
      setStatusMsg({
        type: 'success',
        text: `Data hasil belajar siswa "${progress.studentName}" berhasil masuk ke Google Sheet Guru!`,
      });
      await handleFetchSheetData(targetSheetId);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        type: 'error',
        text: err?.message || 'Gagal mengirim hasil siswa ke Google Sheet.',
      });
    } finally {
      setIsSyncingCurrent(false);
    }
  };

  const isMasterSheet = sheetId === DEFAULT_MASTER_SHEET_ID;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl paper-bg gold-border glow shadow-2xl border-4 border-[#7A5230] overflow-hidden">
        {/* Header */}
        <div className="wood-texture text-[#FAF7F0] p-4 sm:p-5 border-b-2 border-[#D9A441] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-md border border-[#FAF7F0]/40">
              <FileSpreadsheet className="w-6 h-6 text-[#FAF7F0]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-[#FAF7F0] flex items-center gap-2">
                <span>Google Sheet Rekapitulasi Siswa</span>
                <span className="text-[10px] uppercase font-bold bg-[#D9A441] text-[#3D2413] px-2 py-0.5 rounded-full">
                  Terpusat (1 Spreadsheet)
                </span>
              </h3>
              <p className="text-xs text-[#EED9C4] font-serif">
                Semua hasil eksperimen, percobaan, dan waktu belajar siswa direkap ke satu dokumen Google Sheet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF7F0]/10 hover:bg-[#FAF7F0]/20 text-[#FAF7F0] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-serif font-bold shadow-sm ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : statusMsg.type === 'error'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Kirim Hasil Siswa Aktif */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#D9A441] shadow-md space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-black uppercase text-[#7A5230] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#5C7A5C]" /> Siswa Saat Ini
                  </span>
                  <span className="text-xs font-bold text-[#5C7A5C] bg-[#5C7A5C]/15 px-2 py-0.5 rounded-md">
                    {progress.completedMissions.length}/4 Misi
                  </span>
                </div>
                <h4 className="font-serif font-black text-base text-[#3D2413]">
                  {progress.studentName ? progress.studentName : '(Nama Siswa Belum Diisi)'}
                </h4>
                <p className="text-xs text-[#7A5230] font-serif">
                  Total waktu belajar: <strong>{totalMinutes} menit</strong> • Percobaan:{' '}
                  <strong>
                    {Object.values(progress.missionAttempts || {}).reduce<number>((a, b) => Number(a) + Number(b), 0)}x
                  </strong>
                </p>
              </div>

              <button
                id="btn-sync-current-student-sheet"
                onClick={handleSyncCurrentStudent}
                disabled={isSyncingCurrent}
                className="w-full py-2.5 px-4 rounded-xl wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] font-serif font-black text-xs flex items-center justify-center gap-2 border border-[#D9A441] shadow-md transition transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSyncingCurrent ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D9A441]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#D9A441]" />
                )}
                <span>{isSyncingCurrent ? 'Mengirim Data...' : 'Kirim Nilai Siswa Ini ke Sheet Guru'}</span>
              </button>
            </div>

            {/* Card 2: Pengaturan Google Sheet Terpusat */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#7A5230]/40 shadow-md space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-black uppercase text-[#7A5230] flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#2E7D32]" /> Google Sheet Utama
                  </span>
                  {isMasterSheet && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      ✓ Terhubung ke Sheet Guru
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sheetInput}
                    onChange={(e) => setSheetInput(e.target.value)}
                    placeholder="ID Google Sheet..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#7A5230]/40 text-xs font-mono text-[#3D2413] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                  />
                  <button
                    onClick={() => handleFetchSheetData(sheetInput)}
                    disabled={isLoading || !sheetInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-[#5C7A5C] hover:bg-[#4a634a] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    title="Muat Data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Muat</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-serif font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Sheet Guru di Tab Baru</span>
                </a>

                {!isMasterSheet && (
                  <button
                    onClick={handleResetToMaster}
                    className="py-2 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-[#3D2413] font-serif font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    title="Kembalikan ke Sheet Default Guru"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Preview of Google Sheet Data */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-black text-sm text-[#3D2413] flex items-center gap-2">
                <span>📋 Pratinjau Rekap Siswa ({sheetData.length > 1 ? sheetData.length - 1 : 0} Siswa Terdaftar)</span>
              </h4>
              <span className="text-[11px] font-mono text-[#7A5230] bg-[#FAF7F0] px-2 py-0.5 rounded-md border border-[#D9A441]/50">
                ID: {sheetId.slice(0, 14)}...
              </span>
            </div>

            {sheetData.length > 0 ? (
              <div className="rounded-2xl border-2 border-[#7A5230]/40 overflow-hidden shadow-inner bg-white">
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-left text-xs font-serif border-collapse">
                    <thead>
                      <tr className="wood-texture text-[#FAF7F0] sticky top-0 z-10 text-[11px] uppercase tracking-wider">
                        {sheetData[0]?.map((header: string, idx: number) => (
                          <th key={idx} className="p-2.5 border-b border-[#D9A441]/50 font-bold whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-[#3D2413]">
                      {sheetData.slice(1).map((row: any[], rowIdx: number) => (
                        <tr key={rowIdx} className="hover:bg-amber-50/50 transition">
                          {row.map((cell: any, cellIdx: number) => (
                            <td key={cellIdx} className="p-2.5 whitespace-nowrap text-xs">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#FAF7F0] border-2 border-dashed border-[#7A5230]/40 text-center space-y-2">
                <FileSpreadsheet className="w-10 h-10 text-[#7A5230]/40 mx-auto" />
                <p className="text-xs font-serif font-bold text-[#7A5230]">
                  Sedang memuat data dari Google Sheet Utama Guru...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F0] border-t-2 border-[#D9A441] flex items-center justify-between shrink-0">
          <div className="text-[11px] font-serif text-[#7A5230] italic hidden sm:block">
            *Semua data siswa disimpan langsung ke spreadsheet: <strong>142_OaLbxy1JB6wOzF7dPEDozjnqZ9RrccVc9r_731EM</strong>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] font-serif font-black text-xs border border-[#D9A441] shadow-md transition active:scale-95 cursor-pointer ml-auto"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
