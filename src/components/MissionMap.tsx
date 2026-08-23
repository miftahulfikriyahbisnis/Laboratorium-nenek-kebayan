import React, { useState } from 'react';
import { Mission, StudentProgress } from '../types';
import { MISSIONS } from '../data/missionsData';
import { NenekAvatar } from './NenekAvatar';
import {
  Compass,
  Sparkles,
  Lock,
  CheckCircle2,
  Play,
  FlaskConical,
  Flame,
  Info,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MissionMapProps {
  progress: StudentProgress;
  onSelectMission: (missionId: number) => void;
}

interface MapNodeData {
  id: number;
  name: string;
  locationName: string;
  xPercent: number;
  yPercent: number;
  icon: string;
  plantName: string;
  plantColor: string;
  description: string;
}

const MAP_NODES: MapNodeData[] = [
  {
    id: 1,
    name: 'Misi 1: Menakar Kepekatan',
    locationName: 'Lembah Daun Sambiloto',
    xPercent: 18,
    yPercent: 70,
    icon: '🏺',
    plantName: 'Ekstrak Sambiloto (2.0 M)',
    plantColor: '#4E684E',
    description: 'Pengenceran zat pahit andrografolid agar aman bagi lambung warga.',
  },
  {
    id: 2,
    name: 'Misi 2: Penawar Racun Hutan',
    locationName: 'Rimba Jeruk Purut & Abu Kayu',
    xPercent: 42,
    yPercent: 30,
    icon: '🌿',
    plantName: 'Asam Sitrat & Kalium Karbonat',
    plantColor: '#D9A441',
    description: 'Netralisasi asam-basa untuk mengubah racun menjadi garam penawar pH 7.',
  },
  {
    id: 3,
    name: 'Misi 3: Rahasia Kembang Telang',
    locationName: 'Mata Air Indikator Telang',
    xPercent: 68,
    yPercent: 68,
    icon: '📜',
    plantName: 'Antosianin Kembang Telang',
    plantColor: '#3B82F6',
    description: 'Titrasi analitik presisi berpandu perubahan pigmen antosianin alami.',
  },
  {
    id: 4,
    name: 'Misi 4: Ramuan Pamungkas',
    locationName: 'Puncak Cengkeh Emas',
    xPercent: 86,
    yPercent: 26,
    icon: '👵',
    plantName: 'Eugenol Cengkeh & Bunga Lawang',
    plantColor: '#F59E0B',
    description: 'Sintesis stoikiometri tuntas menghasilkan Elixir Emas penyembuh wabah.',
  },
];

export const MissionMap: React.FC<MissionMapProps> = ({
  progress,
  onSelectMission,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(() => {
    // Default selected node is the next uncompleted mission or 1
    const nextMission = [1, 2, 3, 4].find((id) => !progress.completedMissions.includes(id)) || 1;
    return nextMission;
  });

  const activeNode = MAP_NODES.find((node) => node.id === selectedNodeId) || MAP_NODES[0];
  const activeMission = MISSIONS.find((m) => m.id === activeNode.id) || MISSIONS[0];

  const isUnlocked = activeNode.id === 1 || progress.completedMissions.includes(activeNode.id - 1);
  const isCompleted = progress.completedMissions.includes(activeNode.id);

  const handleNodeClick = (nodeId: number) => {
    soundManager.playDropSound();
    setSelectedNodeId(nodeId);
  };

  return (
    <div className="space-y-6">
      {/* Map Board Container */}
      <div className="relative rounded-3xl overflow-hidden paper-bg gold-border glow shadow-2xl border-4 border-[#7A5230]">
        {/* Antique Map Background Aesthetics */}
        <div className="absolute inset-0 bg-[#F5EBD9] pointer-events-none opacity-90" />
        
        {/* Subtle Map Grid Lines & Vintage Cartography */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpace">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7A5230" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Contour lines & Coastline watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
          <div className="absolute top-10 left-12 w-96 h-64 border-4 border-dashed border-[#7A5230] rounded-[60%_40%_70%_30%] transform -rotate-12" />
          <div className="absolute bottom-6 right-16 w-80 h-52 border-3 border-dashed border-[#7A5230] rounded-[40%_60%_30%_70%]" />
        </div>

        {/* Compass Rose in Top-Right Corner */}
        <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col items-center p-2 rounded-2xl bg-[#FAF7F0]/80 border border-[#D9A441] shadow-md backdrop-blur-xs">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Compass className="w-10 h-10 text-[#7A5230] animate-spin-slow" />
            <span className="absolute -top-1 font-serif text-[10px] font-black text-[#5C3A21]">U</span>
          </div>
          <span className="text-[9px] font-serif font-bold text-[#7A5230] uppercase tracking-widest mt-0.5">
            Peta Pulau Herbal
          </span>
        </div>

        {/* Title Header inside Map */}
        <div className="relative z-10 px-6 pt-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl wood-texture flex items-center justify-center text-[#D9A441] border border-[#D9A441] shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-[#3D2413]">
                Peta Petualangan 4 Titik Ramuan
              </h3>
              <p className="text-xs font-serif font-semibold text-[#5C7A5C]">
                Pilih titik di peta untuk melihat wilayah herbal & memulai eksperimen
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Map Canvas Area */}
        <div className="relative w-full h-[360px] sm:h-[430px] md:h-[480px] select-none p-4">
          {/* Animated Connecting Trail SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Trail 1 -> 2 */}
            <path
              d="M 18 70 Q 28 45, 42 30"
              fill="none"
              stroke={progress.completedMissions.includes(1) ? '#5C7A5C' : '#D9A441'}
              strokeWidth="1.2"
              strokeDasharray="2, 2"
              className="transition-colors duration-500"
            />
            {/* Trail 2 -> 3 */}
            <path
              d="M 42 30 Q 52 50, 68 68"
              fill="none"
              stroke={progress.completedMissions.includes(2) ? '#5C7A5C' : progress.completedMissions.includes(1) ? '#D9A441' : '#A89F91'}
              strokeWidth="1.2"
              strokeDasharray="2, 2"
              className="transition-colors duration-500"
            />
            {/* Trail 3 -> 4 */}
            <path
              d="M 68 68 Q 78 45, 86 26"
              fill="none"
              stroke={progress.completedMissions.includes(3) ? '#5C7A5C' : progress.completedMissions.includes(2) ? '#D9A441' : '#A89F91'}
              strokeWidth="1.2"
              strokeDasharray="2, 2"
              className="transition-colors duration-500"
            />
          </svg>

          {/* Central Apothecary Hut Illustration (Pondok Nenek Kebayan) */}
          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: '50%', top: '55%' }}
          >
            <div className="relative p-2.5 rounded-2xl bg-[#FAF7F0]/90 border-2 border-[#D9A441] shadow-lg flex flex-col items-center backdrop-blur-xs">
              <div className="relative">
                <NenekAvatar size="md" expression="happy" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                </span>
              </div>
              <div className="mt-1 px-2 py-0.5 rounded-md bg-[#7A5230] text-[#FAF7F0] text-[10px] font-serif font-black flex items-center gap-1 shadow-xs whitespace-nowrap">
                <Flame className="w-3 h-3 text-[#D9A441]" />
                <span>Pondok Utama Nenek</span>
              </div>
            </div>
          </div>

          {/* 4 Interactive Map Nodes (Waypoints) */}
          {MAP_NODES.map((node) => {
            const isNodeCompleted = progress.completedMissions.includes(node.id);
            const isNodeUnlocked = node.id === 1 || progress.completedMissions.includes(node.id - 1);
            const isNodeSelected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-300"
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yPercent}%`,
                }}
                onClick={() => handleNodeClick(node.id)}
              >
                {/* Node Pin Container */}
                <div
                  id={`map-node-${node.id}`}
                  className={`group relative flex flex-col items-center transition-all duration-300 ${
                    isNodeSelected ? 'scale-115' : 'hover:scale-105'
                  }`}
                >
                  {/* Glowing Pulse Ring for Active/Selected Node */}
                  {isNodeUnlocked && !isNodeCompleted && (
                    <span className="absolute -inset-2 rounded-full bg-[#D9A441]/30 animate-pulse pointer-events-none" />
                  )}
                  {isNodeSelected && (
                    <span className="absolute -inset-3 rounded-full border-2 border-dashed border-[#D9A441] animate-spin-slow pointer-events-none" />
                  )}

                  {/* Main Pin Circle */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-xl transition-all border-3 ${
                      isNodeCompleted
                        ? 'bg-[#5C7A5C] text-[#FAF7F0] border-[#FAF7F0] ring-4 ring-[#5C7A5C]/40'
                        : isNodeUnlocked
                        ? 'bg-[#D9A441] text-[#3D2413] border-[#FAF7F0] ring-4 ring-[#D9A441]/50 animate-bounce-subtle'
                        : 'bg-stone-300 text-stone-500 border-stone-400 opacity-70'
                    }`}
                  >
                    {isNodeCompleted ? (
                      <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#FAF7F0]" />
                    ) : isNodeUnlocked ? (
                      <span>{node.icon}</span>
                    ) : (
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-stone-500" />
                    )}
                  </div>

                  {/* Location Name Pill under Pin */}
                  <div
                    className={`mt-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-serif font-black whitespace-nowrap shadow-md border transition-all flex items-center gap-1 ${
                      isNodeSelected
                        ? 'wood-texture text-[#FAF7F0] border-[#D9A441] scale-105'
                        : isNodeCompleted
                        ? 'bg-[#FAF7F0] text-[#5C7A5C] border-[#5C7A5C]'
                        : isNodeUnlocked
                        ? 'bg-[#FAF7F0] text-[#3D2413] border-[#D9A441]'
                        : 'bg-stone-200 text-stone-600 border-stone-300'
                    }`}
                  >
                    <span>Misi {node.id}</span>
                    {isNodeCompleted && <span>★</span>}
                  </div>

                  {/* Micro label for plant */}
                  <span className="text-[9px] font-serif font-bold text-[#7A5230] max-w-[90px] text-center truncate hidden sm:block">
                    {node.locationName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Node Detail Drawer / Bottom Card inside Map */}
        <div className="relative z-20 border-t-2 border-[#D9A441] bg-[#FAF7F0] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 border-2 ${
                isCompleted
                  ? 'bg-[#5C7A5C] text-[#FAF7F0] border-[#FAF7F0]'
                  : isUnlocked
                  ? 'bg-[#D9A441] text-[#7A5230] border-[#FAF7F0]'
                  : 'bg-stone-300 text-stone-500 border-stone-400'
              }`}
            >
              {activeNode.icon}
            </div>

            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-black text-[#FAF7F0] bg-[#5C7A5C] px-2 py-0.5 rounded-md">
                  Titik Misi {activeNode.id}
                </span>
                <span className="text-xs font-serif font-bold text-[#7A5230]">
                  📍 {activeNode.locationName}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-black text-[#3D2413]">
                {activeMission.title}
              </h4>
              <p className="text-xs text-[#7A5230] font-serif italic line-clamp-1">
                {activeNode.description}
              </p>
            </div>
          </div>

          {/* Action Button for Selected Node */}
          <div className="w-full md:w-auto shrink-0 flex items-center gap-2">
            {isUnlocked ? (
              <button
                id={`btn-launch-map-mission-${activeNode.id}`}
                onClick={() => onSelectMission(activeNode.id)}
                className={`w-full md:w-auto px-6 py-3 rounded-2xl font-serif font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 cursor-pointer ${
                  isCompleted
                    ? 'bg-[#5C7A5C] hover:bg-[#4E684E] text-[#FAF7F0] border-2 border-[#D9A441]'
                    : 'wood-texture hover:bg-[#5C3A21] text-[#FAF7F0] border-2 border-[#D9A441] glow'
                }`}
              >
                <Play className="w-4 h-4 fill-current text-[#D9A441]" />
                <span>{isCompleted ? 'ULANGI MERACIK' : 'MASUK KE TITIK MISI'}</span>
                <ChevronRight className="w-4 h-4 text-[#D9A441]" />
              </button>
            ) : (
              <div className="w-full md:w-auto px-4 py-3 rounded-2xl bg-stone-300 text-stone-600 font-serif font-bold text-xs flex items-center justify-center gap-2 border border-stone-400">
                <Lock className="w-4 h-4" />
                <span>Tuntaskan Titik Misi {activeNode.id - 1} Terlebih Dahulu</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
