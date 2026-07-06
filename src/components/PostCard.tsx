/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Eye, Share2, Trash2, ShieldAlert } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onStar: () => void;
  onDelete: () => void;
  onCardClick: () => void;
  key?: any;
}

export default function PostCard({
  post,
  currentUserId,
  onStar,
  onDelete,
  onCardClick,
}: PostCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);

  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const velX = React.useRef(0);
  const velY = React.useRef(0);
  const rotXRef = React.useRef(0);
  const rotYRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startX.current = clientX;
    startY.current = clientY;
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const dx = clientX - startX.current;
    const dy = clientY - startY.current;

    velX.current = dy * 0.08;
    velY.current = dx * 0.08;

    rotXRef.current += dy * 0.25;
    rotYRef.current += dx * 0.25;

    setRotation({ x: rotXRef.current, y: rotYRef.current });

    startX.current = clientX;
    startY.current = clientY;
  };

  const animateInertia = () => {
    if (Math.abs(velX.current) > 0.01 || Math.abs(velY.current) > 0.01) {
      velX.current *= 0.94;
      velY.current *= 0.94;
      rotXRef.current += velX.current;
      rotYRef.current += velY.current;

      setRotation({ x: rotXRef.current, y: rotYRef.current });
      rafRef.current = requestAnimationFrame(animateInertia);
    } else {
      rafRef.current = null;
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(velX.current) > 0.1 || Math.abs(velY.current) > 0.1) {
      rafRef.current = requestAnimationFrame(animateInertia);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click, and don't trigger if click originates on a button or link
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const isOwner = post.author.id === currentUserId;

  return (
    <div
      className="flex flex-col w-full relative group mb-2"
      id={`post-${post.id}`}
    >
      {/* 4D rotational container with perspective */}
      <div
        className="w-full relative cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: '1200px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
      >
        <div
          ref={cardRef}
          className="relative w-full aspect-square bg-white border-2 border-[#1A1A1A] rounded-none overflow-hidden transition-shadow duration-200 shadow-[4px_4px_0px_#1A1A1A] group-hover:shadow-[8px_8px_0px_#1A1A1A] flex flex-col items-center justify-center p-4"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
          onClick={(e) => {
            // trigger detail modal on tapping the post card (unless tapping interactive actions)
            if (!(e.target as HTMLElement).closest('button')) {
              onCardClick();
            }
          }}
        >
          {/* Post Image */}
          {post.image ? (
            <img
              src={post.image}
              alt="Publicação"
              className="w-full h-full object-cover rounded-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          ) : (
            /* Text-only design placeholder in cosmic code box */
            <div className="w-full h-full border border-dashed border-[#1A1A1A] rounded-none p-6 flex flex-col justify-center items-center bg-[#F9F7F2] relative">
              <div className="absolute top-3 left-3 text-[9px] font-mono text-[#1A1A1A]/60 font-bold uppercase">Open MZ // Editorial</div>
              <p
                style={{
                  fontFamily: post.style?.font || 'Georgia',
                  color: post.style?.color || '#1A1A1A',
                }}
                className="text-base font-bold text-center leading-relaxed font-serif text-[#1A1A1A]"
              >
                {post.text}
              </p>
            </div>
          )}

          {/* Action Overlay Panel (Right Side vertical strip) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStar();
              }}
              className={`w-10 h-10 rounded-none bg-white border border-[#1A1A1A] flex items-center justify-center text-sm shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#F2EFE9] transition-all hover:-translate-y-0.5 ${
                post.starred
                  ? 'text-[#E63946] border-[#1A1A1A]'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <div className="flex flex-col items-center justify-center -space-y-0.5">
                <Star className={`w-4 h-4 ${post.starred ? 'fill-current text-[#E63946]' : ''}`} />
                <span className="text-[9px] font-bold font-mono">{post.stars}</span>
              </div>
            </button>

            <div className="w-10 h-10 rounded-none bg-white border border-[#1A1A1A] flex flex-col items-center justify-center text-xs text-neutral-600 shadow-[2px_2px_0px_#1A1A1A]">
              <Eye className="w-4 h-4 text-[#1A1A1A]" />
              <span className="text-[9px] font-mono font-bold">{post.views}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                // We avoid window.alert in iframe, but can display custom console log or dynamic response
                console.log('Compartilhado no Feed Open MZ!');
              }}
              className="w-10 h-10 rounded-none bg-white border border-[#1A1A1A] flex items-center justify-center text-neutral-600 hover:text-black hover:bg-[#F2EFE9] transition-all shadow-[2px_2px_0px_#1A1A1A] hover:-translate-y-0.5"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Optional Smoke/Vignette Overlay */}
          {post.image && post.text && (
            <div className="absolute bottom-4 left-4 right-16 p-3 bg-white border-2 border-black rounded-none pointer-events-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <p
                style={{
                  fontFamily: post.style?.font || 'Poppins',
                  color: post.style?.color || '#1A1A1A',
                }}
                className="text-xs font-semibold leading-relaxed truncate text-[#1A1A1A]"
              >
                {post.text}
              </p>
            </div>
          )}

          {/* Delete Action (Top right indicator) */}
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="absolute top-4 left-4 w-9 h-9 bg-red-600 hover:bg-red-700 border-2 border-black rounded-none flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Author details footer */}
      <div className="flex items-center gap-2 mt-3 px-1">
        <img
          src={post.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80'}
          alt={post.author.name}
          className="w-8 h-8 rounded-none border border-[#1A1A1A] object-cover bg-[#F9F7F2]"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-black font-serif uppercase tracking-tight">{post.author.name}</span>
          <span className="text-[9px] text-neutral-500 font-mono font-bold uppercase">
            {post.author.province || 'Moçambique'}
          </span>
        </div>
      </div>
    </div>
  );
}
