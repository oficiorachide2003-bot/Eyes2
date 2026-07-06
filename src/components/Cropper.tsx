/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ZoomIn, ZoomOut, Check, X, Compass } from 'lucide-react';

interface CropperProps {
  imageSrc: string;
  onApply: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export default function Cropper({ imageSrc, onApply, onCancel }: CropperProps) {
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [rotation, setRotation] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef({ x: 0, y: 0 });

  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  const handleApply = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Output size: square 800x800
      canvas.width = 800;
      canvas.height = 800;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, 800, 800);

      ctx.save();
      ctx.translate(400, 400);
      ctx.rotate((rotation * Math.PI) / 180);

      // Scale calculations
      const scale = zoom * (800 / Math.min(img.width, img.height));
      const width = img.width * scale;
      const height = img.height * scale;

      // Draw centering and applying offset relative to scale
      ctx.drawImage(
        img,
        -width / 2 + offset.x,
        -height / 2 + offset.y,
        width,
        height
      );

      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      onApply(dataUrl);
    };
    img.src = imageSrc;
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-4">
      {/* Header code snippet styling */}
      <div className="w-full max-w-[480px] bg-[#00ff88]/10 border-b border-dashed border-[#00ff88]/40 px-4 py-2 flex justify-between items-center text-xs font-mono text-[#00ff88]">
        <span>CROP_MATRIX: v2.5 // ESTÁVEL</span>
        <button onClick={onCancel}>
          <X className="w-4 h-4 cursor-pointer hover:scale-110" />
        </button>
      </div>

      {/* Editor area container */}
      <div
        ref={containerRef}
        className="w-full max-w-[480px] aspect-square relative overflow-hidden bg-black border-x border-[#00ff88]/30 flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Glowing framing targets */}
        <div className="absolute inset-8 border border-dashed border-[#00ff88]/40 pointer-events-none z-10">
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00ff88]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00ff88]" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#00ff88]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00ff88]" />
          
          {/* Rule of thirds lines */}
          <div className="absolute inset-y-0 left-1/3 border-r border-[#00ff88]/15" />
          <div className="absolute inset-y-0 right-1/3 border-r border-[#00ff88]/15" />
          <div className="absolute inset-x-0 top-1/3 border-b border-[#00ff88]/15" />
          <div className="absolute inset-x-0 bottom-1/3 border-b border-[#00ff88]/15" />
        </div>

        {/* Dynamic Image under transformation */}
        <img
          src={imageSrc}
          alt="Para cortar"
          className="max-w-none origin-center pointer-events-none select-none transition-transform duration-75"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
            maxHeight: '100%',
            maxWidth: '100%',
          }}
        />
      </div>

      {/* Controls panel */}
      <div className="w-full max-w-[480px] bg-[#0a0a1e]/90 border border-[#00ff88]/30 px-6 py-4 rounded-b-2xl flex flex-col gap-4 text-sm">
        {/* Zoom adjustment */}
        <div className="flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="1"
            max="4"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
          />
          <ZoomIn className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-mono text-[#00ff88] w-8 text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Rotation adjustment */}
        <div className="flex items-center gap-3">
          <Compass className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="360"
            step="90"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
          />
          <span className="text-xs font-mono text-[#00ff88] w-8 text-right">{rotation}°</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-[#00ff88]/30 text-gray-400 hover:text-white rounded-xl font-mono text-xs hover:bg-[#00ff88]/5 transition-all"
          >
            CANCELAR
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#00ffea] to-[#00ff88] text-black rounded-xl font-extrabold text-xs font-mono shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,136,0.5)] transition-all"
          >
            APLICAR CORTE
          </button>
        </div>
      </div>
    </div>
  );
}
