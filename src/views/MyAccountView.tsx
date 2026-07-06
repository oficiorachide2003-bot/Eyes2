/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, Award, Trash2, ArrowLeft, Menu, RefreshCw, Smartphone, Key, Mail } from 'lucide-react';
import { User } from '../types';

interface MyAccountViewProps {
  currentUser: User | null;
  onToggleSidebar: () => void;
  onCancel: () => void;
  onDeleteAccount: () => void;
}

export default function MyAccountView({
  currentUser,
  onToggleSidebar,
  onCancel,
  onDeleteAccount,
}: MyAccountViewProps) {
  const [flipped, setFlipped] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  const [dragRotation, setDragRotation] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const startX = React.useRef(0);
  const startY = React.useRef(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const user = currentUser || {
    fullname: 'Alexandre MZ',
    firstname: 'Alexandre',
    surname: 'MZ',
    nickname: 'Alex MZ',
    province: 'Maputo Cidade',
    email: 'alex@openmz.com',
    phone: '+258 84 000 111',
    created: '01/01/2023',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    stats: { likes: 1250, posts: 14, friends: 342, views: 5600 }
  };

  // Drag listeners to rotate 4D credit identity card
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startX.current = clientX;
    startY.current = clientY;
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - startX.current;
    const dy = clientY - startY.current;
    
    setDragRotation({
      y: (flipped ? 180 : 0) + dx / 4,
      x: -dy / 4
    });
  };

  const handleDragEnd = (clientX: number) => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaX = clientX - startX.current;
    
    // If drag is larger than threshold, flip card
    if (Math.abs(deltaX) > 60) {
      setFlipped(!flipped);
      setDragRotation({ x: 0, y: !flipped ? 180 : 0 });
    } else {
      setDragRotation({ x: 0, y: flipped ? 180 : 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleDragEnd(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    handleDragEnd(touch.clientX);
  };

  // Preloaded related profiles under same phone number
  const relatedProfiles = [
    { name: 'Alex Pro', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80' },
    { name: 'MZ Filmes', img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80' },
    { name: 'Open MZ', img: 'https://images.unsplash.com/photo-1527983359383-4758693f760c?auto=format&fit=crop&w=80&h=80' }
  ];

  return (
    <div className="w-full max-w-[540px] mx-auto px-4 py-8 relative z-10" id="my-account-view">
      
      {/* Top Controls Header */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider uppercase text-black hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Portal
        </button>

        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 rounded-none border-2 border-black text-black flex items-center justify-center hover:bg-[#F2EFE9] transition shadow-[2px_2px_0px_#1A1A1A]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-12 w-full">
        {/* Helper layout info */}
        <p className="text-[10px] font-mono text-neutral-800 uppercase tracking-widest flex items-center gap-1.5 bg-[#F9F7F2] border border-black px-3 py-1 rounded-none shadow-[2px_2px_0px_rgba(0,0,0,0.1)] font-bold">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Arraste para virar a identidade 4D
        </p>

        {/* 4D Identity Card Wrapper */}
        <div
          className="w-full h-[460px] relative select-none"
          style={{ perspective: '3000px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="w-full h-full relative"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${dragRotation.x}deg) rotateY(${dragRotation.y}deg)`,
              transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {/* FRONT FACE CARD */}
            <div
              className="absolute inset-0 bg-white border-[2.5px] border-black rounded-none p-6 flex flex-col justify-between shadow-[4px_4px_0px_#1A1A1A]"
              style={{
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                transform: 'rotateY(0deg)'
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-xl font-bold font-serif text-[#1A1A1A] tracking-tight uppercase">
                  MINHA CONTA
                </span>
                <Cpu className="w-10 h-10 text-black" />
              </div>

              {/* Avatar BI format */}
              <div className="flex justify-center my-4">
                <img
                  src={user.avatar}
                  alt="Avatar BI"
                  className="w-28 h-32 rounded-none object-cover border-2 border-black shadow-[4px_4px_0px_#1A1A1A]"
                />
              </div>

              {/* BI Text details */}
              <div className="space-y-1.5 text-left font-mono text-xs text-[#1A1A1A] pl-2 border-l border-black">
                <div><span className="text-neutral-500 font-bold font-sans">NOME:</span> {user.fullname}</div>
                <div><span className="text-neutral-500 font-bold font-sans">EMAIL:</span> {user.email}</div>
                <div><span className="text-neutral-500 font-bold font-sans">NÚMERO:</span> {user.phone}</div>
                <div><span className="text-neutral-500 font-bold font-sans">CIDADE:</span> {user.province}</div>
                <div><span className="text-neutral-500 font-bold font-sans">REGISTO:</span> {new Date(user.created).toLocaleDateString('pt-MZ')}</div>
              </div>

              {/* VIP Label Badge */}
              <div className="absolute top-6 right-20 bg-black text-[#F9F7F2] px-4 py-0.5 rounded-none text-[10px] font-black font-mono border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)] flex items-center gap-1">
                <Award className="w-3.5 h-3.5 fill-current text-white" /> VIP
              </div>
            </div>

            {/* BACK FACE CARD */}
            <div
              className="absolute inset-0 bg-[#F9F7F2] border-[2.5px] border-black rounded-none p-6 flex flex-col justify-between shadow-[4px_4px_0px_#1A1A1A]"
              style={{
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-xl font-bold font-serif text-[#1A1A1A] tracking-tight uppercase">
                  AVANÇADO
                </span>
                <Cpu className="w-10 h-10 text-black" />
              </div>

              {/* Related sub accounts sharing same phone */}
              <div className="my-4 text-center">
                <h4 className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase mb-4 tracking-widest border-b border-black pb-1">
                  3 CONTAS NO MESMO NÚMERO
                </h4>
                <div className="flex justify-center gap-6">
                  {relatedProfiles.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition duration-300">
                      <img src={p.img} alt={p.name} className="w-12 h-12 rounded-none object-cover border border-black shadow" />
                      <span className="text-[9px] font-mono text-neutral-800 font-bold">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick edit actions */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                  onClick={() => showToast('Mudar Número: Serviço em desenvolvimento!')}
                  className="py-2.5 px-2 bg-white hover:bg-[#F2EFE9] border border-black text-[#1A1A1A] text-[10px] font-mono font-bold rounded-none transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                >
                  <Smartphone className="w-4 h-4 text-neutral-800" /> TELEFONE
                </button>
                <button
                  onClick={() => showToast('Mudar Email: Serviço em desenvolvimento!')}
                  className="py-2.5 px-2 bg-white hover:bg-[#F2EFE9] border border-black text-[#1A1A1A] text-[10px] font-mono font-bold rounded-none transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                >
                  <Mail className="w-4 h-4 text-neutral-800" /> EMAIL
                </button>
                <button
                  onClick={() => showToast('Mudar Senha: Serviço em desenvolvimento!')}
                  className="py-2.5 px-2 bg-white hover:bg-[#F2EFE9] border border-black text-[#1A1A1A] text-[10px] font-mono font-bold rounded-none transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                >
                  <Key className="w-4 h-4 text-neutral-800" /> SENHA
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ELIMINAR CONTA DEFINITIVO */}
        <div className="w-full max-w-[320px] mt-6">
          <button
            onClick={() => {
              if (confirm('Tem certeza absoluta de que deseja ELIMINAR esta conta definitivamente do Open MZ? Esta ação é irreversível.')) {
                onDeleteAccount();
              }
            }}
            className="w-full py-4 bg-[#E63946] text-white font-bold text-xs font-mono uppercase rounded-none shadow-[4px_4px_0px_#1A1A1A] hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer border-2 border-black"
          >
            <Trash2 className="w-4.5 h-4.5" /> ELIMINAR CONTA DEFINITIVO
          </button>
        </div>

      </div>

      {/* Floating toast alerts */}
      {toast && (
        <div className="fixed top-6 right-6 bg-black text-[#F9F7F2] text-xs font-mono font-bold py-3 px-6 rounded-none border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.25)] z-[99999] animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
