import React from 'react';

interface BackgroundMapProps {
  opacity?: number;
}

export const BackgroundMap: React.FC<BackgroundMapProps> = ({ opacity = 1 }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Base Vintage Paper / Forest Canvas */}
      <div className="absolute inset-0 bg-[#233524]" />

      {/* High-definition SVG of Peta Pencaharian Misi Nenek Kebayan */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bgForestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1c2d1b" />
            <stop offset="50%" stopColor="#2c4228" />
            <stop offset="100%" stopColor="#1b2818" />
          </linearGradient>

          <linearGradient id="parchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EDE1CE" />
            <stop offset="30%" stopColor="#F5ECE0" />
            <stop offset="70%" stopColor="#EAD8BE" />
            <stop offset="100%" stopColor="#DEC7A7" />
          </linearGradient>

          <linearGradient id="parchmentBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8C582B" />
            <stop offset="50%" stopColor="#D9A441" />
            <stop offset="100%" stopColor="#6E3E1A" />
          </linearGradient>

          <linearGradient id="volcanoLava" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="40%" stopColor="#FF7043" />
            <stop offset="100%" stopColor="#D84315" />
          </linearGradient>

          <linearGradient id="starLakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1A30" />
            <stop offset="60%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#5B93C7" />
          </linearGradient>

          <linearGradient id="woodDeskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#533118" />
            <stop offset="50%" stopColor="#6B4121" />
            <stop offset="100%" stopColor="#3C210E" />
          </linearGradient>

          <filter id="parchmentShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000000" floodOpacity="0.6" />
          </filter>

          <filter id="lanternGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>

          {/* Batik & foliage patterns */}
          <pattern id="batikPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#C49A5A" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="20" cy="20" r="4" fill="#C49A5A" fillOpacity="0.3" />
          </pattern>
        </defs>

        {/* Ambient Dark Forest Background */}
        <rect width="1920" height="1080" fill="url(#bgForestGrad)" />

        {/* Background Forest Canopy & Mist */}
        <g opacity="0.35">
          <circle cx="100" cy="150" r="180" fill="#3E5C38" />
          <circle cx="300" cy="100" r="220" fill="#2D4628" />
          <circle cx="1700" cy="180" r="200" fill="#3E5C38" />
          <circle cx="1900" cy="300" r="250" fill="#253A21" />
          {/* Vines / Hanging foliage */}
          <path d="M 50 0 Q 80 200 60 400" stroke="#1F331C" strokeWidth="12" fill="none" />
          <path d="M 120 0 Q 90 250 140 500" stroke="#1A2D17" strokeWidth="8" fill="none" />
          <path d="M 1820 0 Q 1780 220 1830 450" stroke="#1F331C" strokeWidth="10" fill="none" />
        </g>

        {/* ======================================================== */}
        {/* THE MAIN ANCIENT PARCHMENT MAP */}
        {/* ======================================================== */}
        <g filter="url(#parchmentShadow)">
          {/* Parchment Base Sheet with Deckled Rough Edges */}
          <path
            d="M 180 80
               Q 600 65, 1000 75
               Q 1400 65, 1740 85
               Q 1755 350, 1745 600
               Q 1760 850, 1740 980
               Q 1350 1000, 960 985
               Q 550 1000, 180 980
               Q 160 700, 175 450
               Q 165 250, 180 80 Z"
            fill="url(#parchmentGrad)"
            stroke="url(#parchmentBorderGrad)"
            strokeWidth="8"
          />

          {/* Ornamental Inner Batik Border */}
          <path
            d="M 210 110
               L 1710 110
               L 1710 950
               L 210 950 Z"
            fill="url(#batikPattern)"
            stroke="#A3753E"
            strokeWidth="3"
            strokeDasharray="8 4"
            opacity="0.65"
          />

          {/* Decorative Corner Ornaments */}
          <g stroke="#8C582B" strokeWidth="2.5" fill="none">
            {/* Top Left */}
            <path d="M 220 120 Q 250 120 250 150 M 220 120 L 270 120 M 220 120 L 220 170" />
            <circle cx="235" cy="235" r="8" fill="#D9A441" fillOpacity="0.4" />
            {/* Top Right */}
            <path d="M 1700 120 Q 1670 120 1670 150 M 1700 120 L 1650 120 M 1700 120 L 1700 170" />
            {/* Bottom Left */}
            <path d="M 220 940 Q 250 940 250 910 M 220 940 L 270 940 M 220 940 L 220 890" />
            {/* Bottom Right */}
            <path d="M 1700 940 Q 1670 940 1670 910 M 1700 940 L 1650 940 M 1700 940 L 1700 890" />
          </g>

          {/* MAP TITLE BANNER */}
          <g transform="translate(960, 150)">
            <rect x="-350" y="-35" width="700" height="70" rx="16" fill="#F4E8D3" stroke="#9C6B37" strokeWidth="2.5" />
            {/* Title Text */}
            <text
              x="0"
              y="-4"
              textAnchor="middle"
              fontFamily="Cinzel, 'Playfair Display', serif"
              fontSize="28"
              fontWeight="900"
              fill="#4A2810"
              letterSpacing="4"
            >
              PETA PENCAHARIAN
            </text>
            <text
              x="0"
              y="24"
              textAnchor="middle"
              fontFamily="Cinzel, 'Playfair Display', serif"
              fontSize="22"
              fontWeight="800"
              fill="#6B3E14"
              letterSpacing="3"
            >
              MISI NENEK KEBAYAN
            </text>
          </g>

          {/* ======================================================== */}
          {/* MAP GEOGRAPHY & REGIONS */}
          {/* ======================================================== */}

          {/* 1. TOP-LEFT: MISI 1 - HUTAN LARANGAN & AKAR AJAIB */}
          <g transform="translate(420, 360)">
            {/* Enchanted Trees */}
            <circle cx="-60" cy="-60" r="70" fill="#4B6B42" opacity="0.8" />
            <circle cx="20" cy="-80" r="85" fill="#3D5A35" opacity="0.85" />
            <circle cx="80" cy="-40" r="60" fill="#527848" opacity="0.75" />
            <path d="M 0 40 Q 10 -40 -10 -80" stroke="#3D2413" strokeWidth="12" fill="none" />
            <path d="M -50 40 Q -40 -20 -60 -50" stroke="#3D2413" strokeWidth="8" fill="none" />

            {/* Glowing Golden Root */}
            <path d="M 10 20 Q 30 70 60 90 M 10 20 Q -20 60 -10 95" stroke="#E6A817" strokeWidth="5" fill="none" />
            <circle cx="20" cy="50" r="18" fill="#FACC15" fillOpacity="0.4" />

            {/* Cottage Hut */}
            <polygon points="120,40 180,0 240,40" fill="#8C532B" stroke="#4A2810" strokeWidth="2" />
            <rect x="135" y="40" width="90" height="50" fill="#C49A6C" stroke="#4A2810" strokeWidth="2" />

            {/* Mission 1 Badge */}
            <g transform="translate(-80, 80)">
              <rect x="-10" y="-18" width="220" height="42" rx="21" fill="#FFFBEB" stroke="#B45309" strokeWidth="2" />
              <circle cx="12" cy="3" r="14" fill="#4E684E" stroke="#FFF" strokeWidth="2" />
              <text x="12" y="8" textAnchor="middle" fontSize="13" fill="#FFF">🌿</text>
              <text x="35" y="-1" fontSize="10" fontWeight="900" fontFamily="sans-serif" fill="#78350F">MISI 1</text>
              <text x="35" y="12" fontSize="9" fontWeight="bold" fontFamily="sans-serif" fill="#92400E">HUTAN LARANGAN & AKAR</text>
            </g>
          </g>

          {/* 2. CENTER: MISI 2 - DANAU BINTANG & AIR RITUAL */}
          <g transform="translate(960, 520)">
            {/* Center Mountains Background */}
            <polygon points="-240,-80 -80,-200 60,-80" fill="#7B8DA3" stroke="#485B73" strokeWidth="3" />
            <polygon points="-60,-60 80,-230 200,-60" fill="#60728A" stroke="#3D4F67" strokeWidth="3" />
            <polygon points="100,-40 240,-160 360,-40" fill="#8A9BB3" stroke="#556880" strokeWidth="3" />

            {/* Glowing Night Sky / Moon Portal */}
            <path
              d="M -200 -40 Q 0 -130 200 -40 Q 240 160 0 170 Q -240 160 -200 -40 Z"
              fill="url(#starLakeGrad)"
              stroke="#D9A441"
              strokeWidth="3"
            />
            {/* Glowing Moon */}
            <circle cx="0" cy="20" r="28" fill="#FFFDE7" />
            <circle cx="0" cy="20" r="38" fill="#FDE047" fillOpacity="0.25" />
            {/* Stars */}
            <circle cx="-100" cy="0" r="2" fill="#FFF" />
            <circle cx="-60" cy="40" r="2.5" fill="#FFF" />
            <circle cx="80" cy="-10" r="2" fill="#FFF" />
            <circle cx="120" cy="50" r="3" fill="#FFF" />
            <circle cx="-40" cy="-30" r="1.5" fill="#FFF" />
            <circle cx="50" cy="30" r="2" fill="#FFF" />

            {/* Little Wooden Boat */}
            <path d="M -120 110 Q -80 135 -40 110 Z" fill="#8C532B" stroke="#4A2810" strokeWidth="2" />

            {/* Mission 2 Badge */}
            <g transform="translate(100, 160)">
              <rect x="-10" y="-18" width="220" height="42" rx="21" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
              <circle cx="12" cy="3" r="14" fill="#2563EB" stroke="#FFF" strokeWidth="2" />
              <text x="12" y="8" textAnchor="middle" fontSize="13" fill="#FFF">💧</text>
              <text x="35" y="-1" fontSize="10" fontWeight="900" fontFamily="sans-serif" fill="#1E40AF">MISI 2</text>
              <text x="35" y="12" fontSize="9" fontWeight="bold" fontFamily="sans-serif" fill="#1D4ED8">DANAU BINTANG & AIR</text>
            </g>
          </g>

          {/* 3. TOP-RIGHT: MISI 3 - GUNUNG MERAPI & API NAGA */}
          <g transform="translate(1420, 340)">
            {/* Volcano Body */}
            <polygon points="-160,100 0,-140 180,100" fill="#59443B" stroke="#3D2920" strokeWidth="4" />
            {/* Lava River Stream */}
            <path d="M 0 -140 Q 20 -40 60 20 Q 90 60 120 100" stroke="url(#volcanoLava)" strokeWidth="12" fill="none" />
            {/* Smoke Plume */}
            <circle cx="-10" cy="-170" r="35" fill="#9E9E9E" opacity="0.6" />
            <circle cx="30" cy="-210" r="45" fill="#757575" opacity="0.5" />
            <circle cx="80" cy="-250" r="55" fill="#616161" opacity="0.4" />

            {/* Red Dragon Silhouette */}
            <g transform="translate(100, -180) scale(0.65)">
              <path d="M 0 0 Q 30 -40 80 -30 Q 120 -10 90 30 Q 50 20 20 40 Q -10 60 -40 30 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
              <path d="M 20 -20 L 70 -80 L 50 -10 Z" fill="#F87171" />
              <path d="M 90 30 Q 130 50 160 40" stroke="#DC2626" strokeWidth="5" fill="none" />
            </g>

            {/* Mission 3 Badge */}
            <g transform="translate(-80, 100)">
              <rect x="-10" y="-18" width="220" height="42" rx="21" fill="#FFF1F2" stroke="#BE123C" strokeWidth="2" />
              <circle cx="12" cy="3" r="14" fill="#E11D48" stroke="#FFF" strokeWidth="2" />
              <text x="12" y="8" textAnchor="middle" fontSize="13" fill="#FFF">🔥</text>
              <text x="35" y="-1" fontSize="10" fontWeight="900" fontFamily="sans-serif" fill="#9F1239">MISI 3</text>
              <text x="35" y="12" fontSize="9" fontWeight="bold" fontFamily="sans-serif" fill="#BE123C">GUNUNG MERAPI & API</text>
            </g>
          </g>

          {/* 4. BOTTOM-LEFT: MISI 4 - RAWA SILUMAN & KUTUKAN KUNO */}
          <g transform="translate(480, 720)">
            {/* Swamp Mist & Dark Ruins */}
            <ellipse cx="0" cy="0" rx="180" ry="90" fill="#2E3D32" opacity="0.75" />
            {/* Ancient Stone Pillars */}
            <rect x="-80" y="-70" width="22" height="60" fill="#4B5563" stroke="#1F2937" strokeWidth="2" />
            <rect x="-40" y="-90" width="26" height="80" fill="#374151" stroke="#111827" strokeWidth="2" />
            <rect x="10" y="-60" width="20" height="50" fill="#4B5563" stroke="#1F2937" strokeWidth="2" />

            {/* Ghost / Spirit Wisp */}
            <path d="M 80 -40 Q 120 -80 100 -110 Q 70 -80 80 -40 Z" fill="#67E8F9" opacity="0.6" />
            <circle cx="95" cy="-85" r="3" fill="#FFF" />

            {/* Mission 4 Badge */}
            <g transform="translate(-100, 70)">
              <rect x="-10" y="-18" width="230" height="42" rx="21" fill="#F0FDF4" stroke="#15803D" strokeWidth="2" />
              <circle cx="12" cy="3" r="14" fill="#16A34A" stroke="#FFF" strokeWidth="2" />
              <text x="12" y="8" textAnchor="middle" fontSize="13" fill="#FFF">✨</text>
              <text x="35" y="-1" fontSize="10" fontWeight="900" fontFamily="sans-serif" fill="#14532D">MISI 4</text>
              <text x="35" y="12" fontSize="9" fontWeight="bold" fontFamily="sans-serif" fill="#15803D">RAWA SILUMAN & KUTUKAN</text>
            </g>
          </g>

          {/* CONNECTING FOOTSTEP TRAIL ACROSS ALL MISSIONS */}
          <g stroke="#5C3A21" strokeWidth="3.5" strokeDasharray="6 8" fill="none" opacity="0.75">
            <path d="M 450 480 Q 600 560 850 560" />
            <path d="M 1050 560 Q 1220 540 1360 460" />
            <path d="M 1360 480 Q 1280 680 1100 780" />
            <path d="M 1050 800 Q 800 840 540 760" />
          </g>

          {/* VINTAGE COMPASS ROSE (BOTTOM RIGHT) */}
          <g transform="translate(1480, 760)">
            <circle cx="0" cy="0" r="60" fill="#FAF5EB" stroke="#8C582B" strokeWidth="3" />
            <circle cx="0" cy="0" r="50" fill="none" stroke="#C49A5A" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* North-South Needle */}
            <polygon points="0,-48 10,0 0,6 -10,0" fill="#991B1B" stroke="#450A0A" strokeWidth="1" />
            <polygon points="0,48 10,0 0,-6 -10,0" fill="#4B5563" stroke="#1F2937" strokeWidth="1" />
            {/* East-West Needle */}
            <polygon points="-48,0 0,10 6,0 0,-10" fill="#D97706" stroke="#78350F" strokeWidth="1" />
            <polygon points="48,0 0,10 -6,0 0,-10" fill="#D97706" stroke="#78350F" strokeWidth="1" />
            <circle cx="0" cy="0" r="6" fill="#D9A441" stroke="#451A03" strokeWidth="1.5" />
            {/* Cardinal Direction Letters */}
            <text x="0" y="-55" textAnchor="middle" fontSize="14" fontWeight="900" fontFamily="serif" fill="#78350F">Utara</text>
            <text x="68" y="5" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="serif" fill="#78350F">Timur</text>
            <text x="0" y="70" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="serif" fill="#78350F">Selatan</text>
            <text x="-68" y="5" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="serif" fill="#78350F">Barat</text>
          </g>
        </g>

        {/* ======================================================== */}
        {/* WOODEN TABLE SURFACE & SCIENTIFIC ALCHEMY ARTIFACTS */}
        {/* ======================================================== */}

        {/* Left Table Section with Scrolls & Flasks */}
        <g transform="translate(0, 680)">
          {/* Wooden Table Plank */}
          <rect x="0" y="160" width="300" height="240" fill="url(#woodDeskGrad)" stroke="#271509" strokeWidth="4" />

          {/* Rolled Ancient Scrolls */}
          <rect x="50" y="120" width="130" height="35" rx="8" fill="#E8D5B5" stroke="#7A4F23" strokeWidth="2.5" />
          <ellipse cx="50" cy="137" rx="8" ry="17" fill="#D4BD96" stroke="#7A4F23" strokeWidth="2" />
          <rect x="40" y="145" width="140" height="35" rx="8" fill="#F2E3C6" stroke="#7A4F23" strokeWidth="2.5" />
          <ellipse cx="40" cy="162" rx="8" ry="17" fill="#D4BD96" stroke="#7A4F23" strokeWidth="2" />

          {/* Glass Potion Bottle (Green Herbal) */}
          <path d="M 22 80 L 32 80 L 32 100 L 44 140 L 10 140 L 22 100 Z" fill="#10B981" fillOpacity="0.85" stroke="#047857" strokeWidth="2" />
          <rect x="23" y="72" width="8" height="8" fill="#D97706" />

          {/* Round Flask (Purple) */}
          <circle cx="70" cy="100" r="24" fill="#A855F7" fillOpacity="0.85" stroke="#6B21A8" strokeWidth="2" />
          <rect x="64" y="66" width="12" height="16" fill="#A855F7" stroke="#6B21A8" strokeWidth="2" />

          {/* Erlenmeyer / Aludel (Amber) */}
          <polygon points="110,60 125,60 145,135 90,135" fill="#F59E0B" fillOpacity="0.85" stroke="#B45309" strokeWidth="2" />
        </g>

        {/* Right Table Section with Oil Lamp */}
        <g transform="translate(1620, 600)">
          {/* Wooden Table Plank */}
          <rect x="0" y="240" width="300" height="240" fill="url(#woodDeskGrad)" stroke="#271509" strokeWidth="4" />

          {/* Small Potion Bottle */}
          <rect x="30" y="200" width="22" height="42" rx="4" fill="#84CC16" fillOpacity="0.85" stroke="#4D7C0F" strokeWidth="2" />
          <rect x="36" y="190" width="10" height="10" fill="#A16207" />

          {/* Vintage Glass Kerosene / Oil Lantern with Ambient Flame Glow */}
          <g transform="translate(90, 80)">
            {/* Ambient Flame Glow */}
            <circle cx="45" cy="110" r="70" fill="#FEF08A" fillOpacity="0.35" filter="url(#lanternGlow)" />
            {/* Lantern Base */}
            <rect x="15" y="160" width="60" height="25" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="3" />
            {/* Glass Chimney */}
            <path d="M 25 160 Q 15 110 30 70 L 60 70 Q 75 110 65 160 Z" fill="#FEF9C3" fillOpacity="0.75" stroke="#B45309" strokeWidth="2.5" />
            {/* Flame */}
            <ellipse cx="45" cy="115" rx="8" ry="16" fill="#F59E0B" />
            <ellipse cx="45" cy="117" rx="4" ry="10" fill="#FEF08A" />
            {/* Top Cap & Handle */}
            <path d="M 28 70 L 62 70 L 55 45 L 35 45 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <path d="M 20 80 Q 45 10 70 80" stroke="#78350F" strokeWidth="3" fill="none" />
          </g>
        </g>
      </svg>

      {/* Gentle Vignette & Warm Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25 pointer-events-none" />
    </div>
  );
};
