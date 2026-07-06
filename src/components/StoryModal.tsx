/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Star, Eye, Share2, Volume2, VolumeX } from 'lucide-react';
import { Story } from '../types';

interface StoryModalProps {
  story: Story | null;
  onClose: () => void;
  onStar: () => void;
}

export default function StoryModal({ story, onClose, onStar }: StoryModalProps) {
  const [muted, setMuted] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (story && story.music) {
      const audio = new Audio(story.music);
      audio.loop = true;
      audioRef.current = audio;
      if (!muted) {
        audio.play().catch((err) => console.log('Autoplay blocked:', err));
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [story]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 bg-black/98 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none">
      {/* Background abstract layout */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,234,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-red-500/10 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500 text-red-500 hover:text-red-400 rounded-full flex items-center justify-center transition-all duration-300 z-50 cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-w-[500px] flex flex-col items-center gap-4 relative">
        {/* Progress bar */}
        <div className="w-full h-1 bg-[#e0e0ff]/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00ffea] to-[#00d9ff] w-full animate-pulse" />
        </div>

        {/* User metadata header */}
        <div className="w-full flex items-center gap-3 px-2">
          <img src={story.author.avatar} alt={story.author.name} className="w-9 h-9 rounded-full object-cover border border-[#00ffea]" />
          <div>
            <div className="text-sm font-semibold text-[#00ffea]">{story.author.name}</div>
            <div className="text-[10px] text-gray-400 font-mono">Eyes 42h Story</div>
          </div>

          {story.music && (
            <button
              onClick={() => setMuted(!muted)}
              className="ml-auto w-8 h-8 rounded-full border border-[#00ffea]/30 flex items-center justify-center text-[#00ffea] hover:bg-[#00ffea]/10 transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Image Display Frame with glowing effect */}
        <div className="w-full aspect-square bg-[#0a0a1a] rounded-2xl overflow-hidden border border-[#00ffea]/30 shadow-[0_0_40px_rgba(0,255,234,0.25)] relative flex items-center justify-center">
          <img src={story.src} alt="Story" className="w-full h-full object-contain" />
          
          {/* Draggable text or standard story text overlay */}
          {story.text && (
            <div
              className="absolute inset-0 flex items-center justify-center p-6 text-center select-none pointer-events-none"
              style={{
                fontFamily: story.style?.font || 'Poppins',
                color: story.style?.color || '#ffffff',
                textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.8)'
              }}
            >
              <div className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xl font-bold tracking-wide">
                {story.text}
              </div>
            </div>
          )}
        </div>

        {/* Audio tag for actual playback */}
        {story.music && <span className="text-[10px] font-mono text-[#00ffea]/80 animate-pulse">🎵 {story.musicName || 'Música reproduzindo'}</span>}

        {/* Interactive action toolbar */}
        <div className="flex gap-4 items-center bg-[#0a0a1e]/90 border border-[#00ffea]/30 px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(0,217,255,0.15)] backdrop-blur-md mt-2">
          {/* Star action */}
          <button
            onClick={onStar}
            className={`flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
              story.starred ? 'text-[#ffd700] drop-shadow-[0_0_8px_#ffd700]' : 'text-gray-400 hover:text-[#00ffea]'
            }`}
          >
            <Star className={`w-5 h-5 ${story.starred ? 'fill-current' : ''}`} />
            <span>{story.stars}</span>
          </button>

          <span className="w-px h-4 bg-[#00ffea]/20" />

          {/* Views count */}
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
            <Eye className="w-5 h-5 text-[#00d9ff]" />
            <span>{story.views}</span>
          </div>

          <span className="w-px h-4 bg-[#00ffea]/20" />

          {/* Share */}
          <button
            onClick={() => alert('Compartilhado no ecossistema Open MZ!')}
            className="text-gray-400 hover:text-[#00ffea] transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
