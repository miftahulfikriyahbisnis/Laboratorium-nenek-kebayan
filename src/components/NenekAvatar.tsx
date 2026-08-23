import React from 'react';

interface NenekAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'normal' | 'talking' | 'happy' | 'thinking';
  className?: string;
  showAura?: boolean;
}

export const NenekAvatar: React.FC<NenekAvatarProps> = ({
  size = 'md',
  expression = 'normal',
  className = '',
  showAura = true,
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {/* Warm candlelight aura */}
      {showAura && (
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md animate-pulse -z-10" />
      )}
      
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-md select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circular badge */}
        <circle cx="80" cy="80" r="76" fill="#F4EDE2" stroke="#7A5230" strokeWidth="4" />
        <circle cx="80" cy="80" r="70" fill="#E8DFD1" stroke="#5C7A5C" strokeWidth="2" strokeDasharray="4 3" />

        {/* Shoulders & Traditional Baju Kurung (Herbal Green #5C7A5C) */}
        <path
          d="M26 150 C32 115 50 102 80 102 C110 102 128 115 134 150 Z"
          fill="#5C7A5C"
          stroke="#3D2413"
          strokeWidth="3"
        />
        {/* Traditional Gold Floral Batik Brooch/Pattern */}
        <path
          d="M80 108 L84 116 L92 116 L86 122 L88 130 L80 124 L72 130 L74 122 L68 116 L76 116 Z"
          fill="#D9A441"
          stroke="#8C631F"
          strokeWidth="1"
        />

        {/* Selendang / Scarf (Warm Brown #7A5230 with herbal motif) */}
        <path
          d="M48 106 C58 122 62 145 62 154 L50 154 C46 142 42 126 38 112 Z"
          fill="#7A5230"
          stroke="#3D2413"
          strokeWidth="2"
        />
        <path
          d="M112 106 C102 122 98 145 98 154 L110 154 C114 142 118 126 122 112 Z"
          fill="#7A5230"
          stroke="#3D2413"
          strokeWidth="2"
        />

        {/* Neck */}
        <rect x="71" y="86" width="18" height="20" rx="4" fill="#E8C39E" stroke="#3D2413" strokeWidth="2" />

        {/* Head / Face */}
        <ellipse cx="80" cy="68" rx="28" ry="32" fill="#F2D1B3" stroke="#3D2413" strokeWidth="3" />

        {/* Traditional Grey-White Hair Bun (Sanggul Klasik) with floral pin */}
        <ellipse cx="80" cy="34" rx="22" ry="16" fill="#D3D3D3" stroke="#3D2413" strokeWidth="2.5" />
        <ellipse cx="80" cy="32" rx="16" ry="10" fill="#E8E8E8" />
        {/* Golden Hair Cunduk / Pin */}
        <path d="M70 24 Q80 18 90 24" stroke="#D9A441" strokeWidth="3" strokeLinecap="round" />
        <circle cx="80" cy="21" r="3" fill="#D9A441" />

        {/* Side Hair curls */}
        <path d="M52 56 C48 70 54 82 54 82" stroke="#8C8C8C" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M108 56 C112 70 106 82 106 82" stroke="#8C8C8C" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Eyebrows */}
        <path d="M62 55 Q70 51 76 55" stroke="#7A5230" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M84 55 Q90 51 98 55" stroke="#7A5230" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Spectacles (Kacamata Tabib) */}
        <circle cx="68" cy="65" r="9" fill="#FFFFFF" fillOpacity="0.4" stroke="#7A5230" strokeWidth="2.5" />
        <circle cx="92" cy="65" r="9" fill="#FFFFFF" fillOpacity="0.4" stroke="#7A5230" strokeWidth="2.5" />
        <path d="M77 65 L83 65" stroke="#7A5230" strokeWidth="2.5" />
        <path d="M59 64 L53 60" stroke="#7A5230" strokeWidth="2" strokeLinecap="round" />
        <path d="M101 64 L107 60" stroke="#7A5230" strokeWidth="2" strokeLinecap="round" />

        {/* Eyes behind glasses */}
        {expression === 'happy' ? (
          <>
            <path d="M63 65 Q68 60 73 65" stroke="#3D2413" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M87 65 Q92 60 97 65" stroke="#3D2413" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        ) : expression === 'thinking' ? (
          <>
            <circle cx="67" cy="62" r="3" fill="#3D2413" />
            <circle cx="91" cy="62" r="3" fill="#3D2413" />
          </>
        ) : (
          <>
            <circle cx="68" cy="65" r="3" fill="#3D2413" />
            <circle cx="92" cy="65" r="3" fill="#3D2413" />
            <circle cx="69" cy="64" r="1" fill="#FFFFFF" />
            <circle cx="93" cy="64" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Wise Wrinkles / Smile Lines */}
        <path d="M57 66 Q55 72 58 76" stroke="#D1A784" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M103 66 Q105 72 102 76" stroke="#D1A784" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M76 50 Q80 48 84 50" stroke="#D1A784" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <path d="M80 66 Q82 74 77 76 L83 76" stroke="#C4936B" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Mouth */}
        {expression === 'talking' ? (
          <ellipse cx="80" cy="85" rx="5" ry="4" fill="#993D3D" stroke="#3D2413" strokeWidth="1.5" />
        ) : expression === 'happy' ? (
          <path d="M73 83 Q80 91 87 83" stroke="#8A3324" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M74 84 Q80 88 86 84" stroke="#8A3324" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* Rosy Cheeks */}
        <circle cx="60" cy="74" r="5" fill="#E89B84" fillOpacity="0.4" />
        <circle cx="100" cy="74" r="5" fill="#E89B84" fillOpacity="0.4" />

        {/* Traditional Wooden Mortar & Pestle in Hand (Lesung & Anak Lesung) */}
        <g transform="translate(108, 108)">
          {/* Mortar (Lesung Kayu) */}
          <path d="M2 14 C2 28 32 28 32 14 L30 6 C30 2 4 2 4 6 Z" fill="#7A5230" stroke="#3D2413" strokeWidth="2" />
          <ellipse cx="17" cy="6" rx="13" ry="4" fill="#5C3A21" />
          {/* Pestle (Alu Kayu) */}
          <line x1="22" y1="-8" x2="16" y2="10" stroke="#D9A441" strokeWidth="5" strokeLinecap="round" />
          {/* Green herb leaves inside mortar */}
          <circle cx="15" cy="6" r="3" fill="#5C7A5C" />
          <circle cx="19" cy="5" r="2.5" fill="#84A984" />
        </g>
      </svg>
    </div>
  );
};
