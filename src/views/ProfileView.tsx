/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles, TrendingUp, Users, Heart, Eye, Film, ArrowLeft, Menu } from 'lucide-react';
import { User } from '../types';

interface ProfileViewProps {
  currentUser: User | null;
  onToggleSidebar: () => void;
  onCancel: () => void;
  onTriggerAction: (actionName: string) => void;
}

export default function ProfileView({
  currentUser,
  onToggleSidebar,
  onCancel,
  onTriggerAction,
}: ProfileViewProps) {
  const [flipped, setFlipped] = React.useState(false);

  // Auto-flip preview effect every 10s as described
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFlipped((f) => !f);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const user = currentUser || {
    fullname: 'Alexandre MZ',
    firstname: 'Alexandre',
    surname: 'MZ',
    nickname: 'Alex MZ',
    province: 'Maputo Cidade',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    stats: { likes: 1250, posts: 14, friends: 342, views: 5600 }
  };

  // Seven days visual statistic path drawing
  const generateChartPath = () => {
    const data = [120, 280, 450, 620, 580, 720, 680];
    const width = 500;
    const height = 100;
    const padding = 15;
    const max = 720;
    const min = 100;
    
    const xStep = (width - padding * 2) / (data.length - 1);
    const yScale = (height - padding * 2) / (max - min);
    
    let path = `M ${padding} ${height - padding - (data[0] - min) * yScale}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${padding + i * xStep} ${height - padding - (data[i] - min) * yScale}`;
    }
    return path;
  };

  return (
    <div className="w-full max-w-[500px] mx-auto px-4 py-8 relative z-10" id="profile-view">
      
      {/* Top Header Controls */}
      <div className="flex justify-between items-center mb-6">
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

      <div className="editorial-card rounded-none p-6 sm:p-8 text-center relative overflow-hidden">
        
        {/* 1. FLIPPING AVATAR CARD */}
        <div
          className="w-[140px] h-[140px] mx-auto mb-6 relative cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className="w-full h-full relative transition-transform duration-700"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Frontside face */}
            <div
              className="absolute inset-0 rounded-none border-2 border-black overflow-hidden shadow-[4px_4px_0px_#1A1A1A]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover animate-none" />
            </div>

            {/* Backside face */}
            <div
              className="absolute inset-0 rounded-none bg-black border-2 border-black flex flex-col justify-center items-center shadow-[4px_4px_0px_#1A1A1A]"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="text-2xl font-black font-serif text-[#F9F7F2]">PRO</span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono mt-1 font-bold">Diretor</span>
            </div>
          </div>
        </div>

        {/* 2. USER DETAILS */}
        <h2 className="text-3xl font-bold text-black tracking-tight font-serif uppercase">
          {user.nickname}
        </h2>
        <p className="text-[10px] text-[#1A1A1A] font-mono flex items-center justify-center gap-1 mt-1.5 uppercase font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Diretor de Produção
        </p>

        {/* 3. CORE STATISTICS */}
        <div className="grid grid-cols-3 gap-2 border-y-2 border-[#1A1A1A] py-4 my-6">
          <div className="text-center">
            <div className="text-base font-black text-black font-mono flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 text-red-600 fill-current" />
              <span>{user.stats.likes >= 1000 ? `${(user.stats.likes / 1000).toFixed(1)}K` : user.stats.likes}</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">Likes</span>
          </div>

          <div className="text-center">
            <div className="text-base font-black text-black font-mono flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5 text-neutral-700" />
              <span>{user.stats.views >= 1000 ? `${(user.stats.views / 1000).toFixed(1)}K` : user.stats.views}</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">Views</span>
          </div>

          <div className="text-center">
            <div className="text-base font-black text-black font-mono flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-neutral-700" />
              <span>{user.stats.friends}</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">Amigos</span>
          </div>
        </div>

        {/* 4. ACTIVE ACCOUNT INDICATOR */}
        <div className="flex items-center justify-center gap-2 mb-6 text-emerald-800 font-bold text-xs tracking-wider uppercase font-mono bg-[#E8F5E9] py-2 rounded-none border border-emerald-800">
          <Shield className="w-4 h-4" /> Conta Ativa & Verificada
        </div>

        {/* 5. INTERACTION CHART OVER SEVEN DAYS */}
        <div className="bg-[#F9F7F2] border border-[#1A1A1A] rounded-none p-4 mb-6">
          <div className="text-left text-[10px] font-mono text-black mb-2 uppercase flex items-center gap-1.5 font-bold tracking-wider">
            <TrendingUp className="w-4 h-4" /> Interação Geral (7 dias)
          </div>
          <div className="h-24 w-full">
            <svg
              viewBox="0 0 500 100"
              className="w-full h-full"
            >
              <path
                d={generateChartPath()}
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* 6. CAREER DETAIL SPEC BOX */}
        <div className="bg-white border-2 border-black rounded-none p-4 text-left shadow-[4px_4px_0px_#1A1A1A]">
          <div className="flex items-center gap-2 mb-1.5">
            <Film className="w-4 h-4 text-black" />
            <h4 className="text-xs font-serif font-bold text-black uppercase tracking-wide">Diretor de Cinema</h4>
          </div>
          <p className="text-[11px] text-neutral-700 leading-relaxed font-sans">
            Cria filmes, séries e conteúdos de alto impacto visual com visão artística, roteirização técnica e direção fotográfica em Moçambique.
          </p>
        </div>

        {/* 7. IMMERSIVE ABRA OS OLHOS QUICK ACTION CARD */}
        <div className="mt-6 p-4 bg-[#F9F7F2] border border-black rounded-none flex flex-col gap-2 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="text-xs font-mono font-bold text-black uppercase tracking-wider">
            ABRA OS OLHOS MISSION
          </div>
          <p className="text-[10px] text-neutral-600 leading-relaxed">
            Inicie a jornada de consciencialização cibernética nacional. Clique para aceder.
          </p>
          <button
            onClick={() => onTriggerAction('abra')}
            className="w-full py-2 bg-black text-white hover:bg-neutral-800 font-bold text-[10px] font-mono tracking-wider uppercase rounded-none transition duration-200 border border-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
          >
            ABRA OS OLHOS AGORA
          </button>
        </div>

      </div>
    </div>
  );
}
