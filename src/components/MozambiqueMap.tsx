/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface Point {
  name: string;
  x: number;
  y: number;
}

const CAPITAL_AND_PROVINCES: Point[] = [
  { name: 'Niassa (Lichinga)', x: 140, y: 80 },
  { name: 'Cabo Delgado (Pemba)', x: 260, y: 70 },
  { name: 'Nampula', x: 250, y: 150 },
  { name: 'Zambézia (Quelimane)', x: 190, y: 220 },
  { name: 'Tete', x: 90, y: 180 },
  { name: 'Manica (Chimoio)', x: 100, y: 270 },
  { name: 'Sofala (Beira)', x: 130, y: 290 },
  { name: 'Inhambane', x: 135, y: 390 },
  { name: 'Gaza (Xai-Xai)', x: 80, y: 410 },
  { name: 'Maputo Cidade & Província', x: 60, y: 470 },
];

export default function MozambiqueMap() {
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 select-none" id="mozambique-map-section">
      <div className="text-center mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#00ffea]">
          {hoveredNode ? `Foco: ${hoveredNode}` : 'Mapa Interativo de Moçambique'}
        </span>
      </div>

      <div className="w-[300px] h-[520px] relative border border-[#00d9ff]/20 bg-[#0a0a1a]/40 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(0,217,255,0.05)]">
        {/* Background glow matrix lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#00ffea_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Customized Stylized Vector Mozambique Path */}
        <svg
          viewBox="0 0 320 540"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,234,0.3)]"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Main glowing contour path of Mozambique */}
          <path
            d="M 120 40 
               C 130 50, 150 40, 160 30 
               C 180 20, 210 10, 230 20
               C 245 25, 255 40, 260 55
               C 265 70, 275 80, 280 95
               C 285 110, 270 120, 260 130
               C 240 150, 280 170, 260 190
               C 240 210, 210 210, 190 230
               C 170 250, 190 270, 175 290
               C 160 310, 150 330, 160 350
               C 170 370, 160 390, 150 410
               C 140 430, 125 450, 100 460
               C 80 470, 70 495, 60 510
               C 55 515, 48 515, 48 505
               L 52 470
               C 55 450, 65 440, 75 425
               C 85 410, 95 390, 95 375
               C 95 360, 80 340, 85 320
               C 90 300, 110 295, 115 280
               C 120 265, 110 250, 105 235
               C 100 220, 80 210, 70 195
               C 60 180, 65 165, 80 155
               C 95 145, 115 155, 130 160
               C 145 165, 160 150, 165 135
               C 170 120, 165 105, 160 90
               C 155 75, 135 70, 125 60
               Z"
            fill="rgba(0, 217, 255, 0.05)"
            stroke="#00ffea"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />

          {/* Connective mesh grid line network */}
          <path
            d="M 140 80 L 260 70 L 250 150 L 190 220 L 90 180 L 140 80 
               M 190 220 L 130 290 L 100 270 L 90 180
               M 130 290 L 135 390 L 80 410 L 100 270
               M 80 410 L 60 470"
            fill="none"
            stroke="rgba(0, 217, 255, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Interactive node elements */}
          {CAPITAL_AND_PROVINCES.map((pt, idx) => (
            <g
              key={idx}
              onMouseEnter={() => setHoveredNode(pt.name)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer group"
            >
              {/* Pulsing ring */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredNode === pt.name ? 10 : 6}
                fill="none"
                stroke={hoveredNode === pt.name ? '#ff00ff' : '#00ffea'}
                strokeWidth="1.5"
                className="transition-all duration-300 ease-out animate-ping"
                style={{ animationDuration: '2s' }}
              />
              {/* Solid point */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredNode === pt.name ? 5 : 3.5}
                fill={hoveredNode === pt.name ? '#ff00ff' : '#00ffea'}
                className="transition-all duration-300 ease-out shadow-[0_0_10px_#00ffea]"
              />
            </g>
          ))}
        </svg>

        {/* floating label in case of hovering */}
        {hoveredNode && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0a1a]/95 border border-[#ff00ff]/50 px-3 py-1.5 rounded-lg text-[11px] font-mono text-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.3)] animate-bounce text-center whitespace-nowrap z-10">
            {hoveredNode}
          </div>
        )}
      </div>
    </div>
  );
}
