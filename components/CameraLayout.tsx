import React from 'react';

interface LayoutProps {
  data: {
    view: 'side' | 'rear';
    highlight: string;
    label: string;
  };
}

const CameraLayout: React.FC<LayoutProps> = ({ data }) => {
  const { view, highlight, label } = data;

  // Helper to determine if a zone is active
  const isActive = (zone: string) => highlight === zone;
  
  // Common styles
  const baseStroke = "stroke-gray-700";
  const activeStroke = "stroke-cinema-accent stroke-[3px] drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]";
  const activeFill = "fill-cinema-accent/20";
  const baseFill = "fill-gray-900";

  return (
    <div className="my-4 p-4 bg-black/50 rounded-xl border border-gray-800 flex flex-col items-center">
      <div className="relative w-64 h-48">
        <svg viewBox="0 0 300 200" className="w-full h-full">
          {/* --- SIDE VIEW SCHEMATIC --- */}
          {view === 'side' && (
            <g>
              {/* Main Body */}
              <rect x="60" y="40" width="160" height="120" rx="10" className="fill-gray-900 stroke-gray-600 stroke-2" />
              
              {/* Top Handle */}
              <path d="M80 40 L80 20 L200 20 L200 40" className="fill-none stroke-gray-600 stroke-2" />
              
              {/* Lens Mount Area (Left) */}
              <path d="M60 50 L40 40 L40 160 L60 150" className={`stroke-2 ${isActive('lens-mount') ? activeStroke : 'stroke-gray-600'} ${isActive('lens-mount') ? activeFill : 'fill-gray-800'}`} />
              
              {/* Battery Plate (Right) */}
              <rect x="220" y="50" width="30" height="100" rx="4" className={`stroke-2 ${isActive('battery') ? activeStroke : 'stroke-gray-600'} ${isActive('battery') ? activeFill : 'fill-gray-800'}`} />

              {/* Screen (Center) */}
              <g className={isActive('screen') ? 'animate-pulse-slow' : ''}>
                <rect x="90" y="60" width="80" height="60" rx="2" className={`stroke-2 ${isActive('screen') ? activeStroke : baseStroke} ${isActive('screen') ? activeFill : 'fill-gray-950'}`} />
                {isActive('screen') && <text x="130" y="95" textAnchor="middle" className="fill-cinema-accent text-[10px] font-mono">LCD</text>}
              </g>

              {/* Dial / Scroll Wheel (Next to screen) */}
              <circle cx="190" cy="90" r="15" className={`stroke-2 ${isActive('dial') ? activeStroke : baseStroke} ${isActive('dial') ? activeFill : baseFill}`} />
              
              {/* Top Buttons (User Keys) */}
              <g>
                <rect x="90" y="130" width="20" height="10" rx="2" className={`stroke-2 ${isActive('top-buttons') ? activeStroke : baseStroke} ${isActive('top-buttons') ? activeFill : baseFill}`} />
                <rect x="120" y="130" width="20" height="10" rx="2" className={`stroke-2 ${isActive('top-buttons') ? activeStroke : baseStroke} ${isActive('top-buttons') ? activeFill : baseFill}`} />
                <rect x="150" y="130" width="20" height="10" rx="2" className={`stroke-2 ${isActive('top-buttons') ? activeStroke : baseStroke} ${isActive('top-buttons') ? activeFill : baseFill}`} />
              </g>

              {/* Front Buttons (Assignable) */}
              <g>
                <circle cx="75" cy="140" r="6" className={`stroke-2 ${isActive('front-buttons') ? activeStroke : baseStroke} ${isActive('front-buttons') ? activeFill : baseFill}`} />
                <circle cx="75" cy="60" r="6" className={`stroke-2 ${isActive('front-buttons') ? activeStroke : baseStroke} ${isActive('front-buttons') ? activeFill : baseFill}`} />
              </g>
            </g>
          )}

          {/* --- REAR VIEW SCHEMATIC --- */}
          {view === 'rear' && (
            <g>
               {/* Main Body */}
               <rect x="80" y="30" width="140" height="150" rx="10" className="fill-gray-900 stroke-gray-600 stroke-2" />
               
               {/* Battery Center */}
               <rect x="100" y="50" width="100" height="80" rx="4" className={`stroke-2 ${isActive('battery') ? activeStroke : baseStroke} ${isActive('battery') ? activeFill : 'fill-gray-800'}`} />

               {/* Ports Area (Bottom) */}
               <g>
                 <rect x="90" y="140" width="120" height="30" rx="2" className={`stroke-2 ${isActive('ports') ? activeStroke : 'stroke-transparent'} ${isActive('ports') ? activeFill : 'fill-none'}`} />
                 {/* Individual Ports */}
                 <circle cx="105" cy="155" r="8" className="fill-none stroke-gray-500" />
                 <circle cx="130" cy="155" r="8" className="fill-none stroke-gray-500" />
                 <circle cx="155" cy="155" r="8" className="fill-none stroke-gray-500" />
                 <circle cx="180" cy="155" r="8" className="fill-none stroke-gray-500" />
               </g>

               {/* Power Switch (Usually Top or Side) */}
               <rect x="220" y="120" width="20" height="40" rx="2" className={`stroke-2 ${isActive('power') ? activeStroke : baseStroke} ${isActive('power') ? activeFill : baseFill}`} />
               
               {/* Card Slots (Side rear) */}
               <rect x="60" y="60" width="10" height="60" rx="1" className={`stroke-2 ${isActive('card-slot') ? activeStroke : baseStroke} ${isActive('card-slot') ? activeFill : baseFill}`} />
            </g>
          )}

          {/* --- CONNECTING LINES & LABEL --- */}
          {/* We draw a dynamic line based on highlight roughly */}
        </svg>
        
        {/* Overlay Label */}
        <div className="absolute bottom-2 right-2 bg-cinema-accent px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
            {label}
        </div>
        
        <div className="absolute top-2 left-2 text-[10px] text-gray-500 font-mono uppercase">
            View: {view === 'side' ? 'Operator/AC Side' : 'Rear/Utility Panel'}
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center italic">
          *Generic {view} layout. Locations may vary slightly by model.
      </p>
    </div>
  );
};

export default CameraLayout;