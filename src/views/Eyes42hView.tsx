/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Crop, CloudLightning, Type, Music, Save, Send, Plus, RefreshCw, X } from 'lucide-react';
import { Story } from '../types';
import Cropper from '../components/Cropper';

interface Eyes42hViewProps {
  currentUser: any;
  onPublishSuccess: (newStory: Story) => void;
  onCancel: () => void;
}

interface DraggableText {
  id: string;
  text: string;
  color: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

export default function Eyes42hView({ currentUser, onPublishSuccess, onCancel }: Eyes42hViewProps) {
  const [photoSrc, setPhotoSrc] = React.useState<string | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);
  const [showCropper, setShowCropper] = React.useState(false);
  const [rawImage, setRawImage] = React.useState<string | null>(null);

  // Editor features
  const [activePanel, setActivePanel] = React.useState<'crop' | 'text' | 'music' | null>('crop');
  const [smokeActive, setSmokeActive] = React.useState(false);
  
  // Texts
  const [texts, setTexts] = React.useState<DraggableText[]>([]);
  const [textInput, setTextInput] = React.useState('');
  const [textColor, setTextColor] = React.useState('#ffffff');

  // Music
  const [musicBlob, setMusicBlob] = React.useState<string | null>(null);
  const [musicName, setMusicName] = React.useState('Nenhuma música');

  // Countdown and Publish
  const [countdown, setCountdown] = React.useState<number | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const musicInputRef = React.useRef<HTMLInputElement>(null);
  const activeDragIdRef = React.useRef<string | null>(null);
  const editorAreaRef = React.useRef<HTMLDivElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setRawImage(ev.target.result as string);
          setShowCropper(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCropped = (croppedUrl: string) => {
    setPhotoSrc(croppedUrl);
    setShowCropper(false);
    setRawImage(null);
    setShowEditor(true);
  };

  // Draggable management in pure React
  const handleDragStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    activeDragIdRef.current = id;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!activeDragIdRef.current || !editorAreaRef.current) return;

    const rect = editorAreaRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Convert pixels to responsive percentage inside crop container
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 5), 95);

    setTexts((prev) =>
      prev.map((t) => (t.id === activeDragIdRef.current ? { ...t, x, y } : t))
    );
  };

  const handleDragEnd = () => {
    activeDragIdRef.current = null;
  };

  const handleAddText = () => {
    if (!textInput.trim()) return;
    const newText: DraggableText = {
      id: 'txt-' + Math.random().toString(36).substring(2, 9),
      text: textInput.trim(),
      color: textColor,
      x: 50,
      y: 50
    };
    setTexts((prev) => [...prev, newText]);
    setTextInput('');
  };

  const handleRemoveText = (id: string) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Música muito grande! Limite de 10MB.');
        return;
      }
      const blobUrl = URL.createObjectURL(file);
      setMusicBlob(blobUrl);
      setMusicName(file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name);
    }
  };

  const handleSaveDraft = () => {
    const draft = {
      photoSrc,
      texts,
      smokeActive,
      musicName,
      musicBlob
    };
    localStorage.setItem('eyes42h_draft', JSON.stringify(draft));
    alert('Rascunho de história salvo ciberneticamente!');
  };

  const handleLoadDraft = () => {
    const raw = localStorage.getItem('eyes42h_draft');
    if (raw) {
      const draft = JSON.parse(raw);
      setPhotoSrc(draft.photoSrc);
      setTexts(draft.texts || []);
      setSmokeActive(draft.smokeActive || false);
      setMusicName(draft.musicName || 'Nenhuma música');
      setMusicBlob(draft.musicBlob || null);
      setShowEditor(true);
    } else {
      alert('Nenhum rascunho de história encontrado.');
    }
  };

  const handlePublish = () => {
    if (!photoSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // 1. Overlay fog/smoke
      if (smokeActive) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Render Draggable Texts
      texts.forEach((t) => {
        const px = (t.x / 100) * canvas.width;
        const py = (t.y / 100) * canvas.height;

        ctx.save();
        ctx.fillStyle = t.color;
        ctx.font = 'bold 42px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Background box for burned text readability
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 15;
        
        ctx.fillText(t.text, px, py);
        ctx.restore();
      });

      const finalStoryUrl = canvas.toDataURL('image/jpeg', 0.9);

      // Trigger 3s cyber publication countdown
      setCountdown(3);
      let count = 3;
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          
          const newStory: Story = {
            id: 'story-' + Math.random().toString(36).substring(2, 9),
            type: 'photo',
            src: finalStoryUrl,
            music: musicBlob,
            musicName: musicBlob ? musicName : undefined,
            author: {
              name: currentUser ? currentUser.nickname : 'Você',
              avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80',
              id: currentUser ? currentUser.id : 'user1'
            },
            stars: 0,
            views: 0,
            timestamp: Date.now()
          };

          onPublishSuccess(newStory);
          setCountdown(null);
        }
      }, 1000);
    };
    img.src = photoSrc;
  };

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 py-8 relative z-10" id="eyes-42h-view">
      
      {/* Back to main */}
      <button
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 text-xs font-bold font-mono tracking-wider uppercase text-black hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Cancelar
      </button>

      {/* CHOOSE STEP */}
      {!showEditor && (
        <div className="editorial-card rounded-none p-6 sm:p-8 text-center">
          <h2 className="text-3xl font-bold text-[#1A1A1A] font-serif tracking-tight uppercase mb-2">
            Eyes 42h
          </h2>
          <p className="text-[10px] text-neutral-500 font-mono font-bold uppercase tracking-widest mb-8">
            Histórias Temporárias de Moçambique
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          <div className="flex flex-col gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-none border-2 border-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition"
            >
              <Plus className="w-5 h-5 stroke-[3px]" />
              Publicar Nova Foto
            </button>

            <button
              onClick={handleLoadDraft}
              className="py-3 border border-black text-neutral-800 hover:bg-[#F2EFE9] text-xs font-mono font-bold uppercase tracking-wider rounded-none transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Carregar Rascunho
            </button>
          </div>
        </div>
      )}

      {/* STORY EDITOR VIEW (FULL CONTAINER) */}
      {showEditor && photoSrc && (
        <div className="bg-[#FAF8F5] fixed inset-0 z-50 flex flex-col justify-between overflow-hidden">
          {/* Editor Header */}
          <div className="bg-[#F9F7F2] border-b-2 border-[#1A1A1A] p-4 flex justify-between items-center z-20">
            <button
              onClick={() => {
                setShowEditor(false);
                setPhotoSrc(null);
                setTexts([]);
              }}
              className="w-10 h-10 rounded-none border border-red-700 text-red-700 flex items-center justify-center hover:bg-red-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-black font-serif uppercase tracking-wider">EDITOR EYES 42H</span>
            <div className="w-10 h-10" />
          </div>

          {/* Interactive Composite Visual Area */}
          <div
            ref={editorAreaRef}
            onMouseMove={handleDragMove}
            onTouchMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            className="flex-1 relative bg-[#EFECE6] flex items-center justify-center overflow-hidden"
          >
            <div className="relative max-w-full max-height-full aspect-square bg-[#EFECE6] flex items-center justify-center border-2 border-black">
              <img src={photoSrc} alt="Core" className="max-w-full max-h-full object-contain pointer-events-none select-none" />
              
              {/* Black fog layer overlay */}
              {smokeActive && (
                <div className="absolute inset-0 bg-black/65 pointer-events-none transition-opacity duration-300" />
              )}

              {/* Renders draggable text nodes on screen */}
              {texts.map((t) => (
                <div
                  key={t.id}
                  onMouseDown={(e) => handleDragStart(t.id, e)}
                  onTouchStart={(e) => handleDragStart(t.id, e)}
                  className="absolute cursor-move px-3 py-1.5 rounded-none text-lg sm:text-2xl font-bold bg-white text-black border-2 border-black select-none shadow-[4px_4px_0px_#1A1A1A]"
                  style={{
                    color: t.color,
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  {t.text}
                  <button
                    onClick={() => handleRemoveText(t.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-none border-2 border-black bg-red-600 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Left Vertical Options Tool Strip */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 bg-white border-2 border-black p-3 rounded-none z-30 shadow-[4px_4px_0px_#1A1A1A]">
            <button
              onClick={() => setActivePanel('crop')}
              className={`w-11 h-11 rounded-none flex items-center justify-center text-sm transition-all ${
                activePanel === 'crop' ? 'bg-black text-white' : 'text-[#1A1A1A] hover:bg-[#F2EFE9]'
              }`}
              title="Cortar"
            >
              <Crop className="w-5 h-5" />
            </button>

            <button
              onClick={() => setSmokeActive(!smokeActive)}
              className={`w-11 h-11 rounded-none flex items-center justify-center text-sm transition-all ${
                smokeActive ? 'bg-[#E63946] text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              title="Fumo Preto"
            >
              <CloudLightning className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActivePanel('text')}
              className={`w-11 h-11 rounded-none flex items-center justify-center text-sm transition-all ${
                activePanel === 'text' ? 'bg-black text-white' : 'text-[#1A1A1A] hover:bg-[#F2EFE9]'
              }`}
              title="Texto"
            >
              <Type className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActivePanel('music')}
              className={`w-11 h-11 rounded-none flex items-center justify-center text-sm transition-all ${
                activePanel === 'music' ? 'bg-black text-white' : 'text-[#1A1A1A] hover:bg-[#F2EFE9]'
              }`}
              title="Música"
            >
              <Music className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Custom Actions Panels */}
          <div className="bg-white p-4 border-t-2 border-black flex flex-col gap-4 z-20">
            {/* 1. Crop action inside editor */}
            {activePanel === 'crop' && (
              <div className="flex flex-col items-center gap-1.5 p-3 bg-[#F9F7F2] rounded-none border border-black max-w-[280px] mx-auto w-full animate-fade-in">
                <span className="text-[10px] text-neutral-600 font-mono font-bold uppercase">Re-ajustar corte da foto</span>
                <button
                  onClick={() => {
                    setRawImage(photoSrc);
                    setShowCropper(true);
                  }}
                  className="py-1.5 px-4 bg-white border border-[#1A1A1A] text-black rounded-none text-xs font-bold hover:bg-[#F2EFE9] transition cursor-pointer"
                >
                  Abrir Corte
                </button>
              </div>
            )}

            {/* 2. Draggable Text Panel */}
            {activePanel === 'text' && (
              <div className="flex flex-col gap-3 p-3 bg-[#F9F7F2] rounded-none border border-black max-w-[340px] mx-auto w-full animate-fade-in">
                <input
                  type="text"
                  placeholder="Texto da história..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A] rounded-none px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                />
                
                {/* Text Color strip selection */}
                <div className="flex justify-center gap-2">
                  {['#1A1A1A', '#E63946', '#1D3557', '#457B9D', '#5C6B73'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setTextColor(col)}
                      className={`w-6 h-6 rounded-none border-2 transition ${
                        textColor === col ? 'border-black scale-110 shadow-md' : 'border-neutral-300'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleAddText}
                  className="w-full py-2 bg-black text-white font-bold text-xs rounded-none hover:scale-102 transition"
                >
                  Adicionar Texto
                </button>
              </div>
            )}

            {/* 3. Audio Panel */}
            {activePanel === 'music' && (
              <div className="flex flex-col items-center gap-2 p-3 bg-[#F9F7F2] rounded-none border border-black max-w-[280px] mx-auto w-full animate-fade-in">
                <span className="text-[10px] text-neutral-600 font-mono font-bold uppercase">Trilha sonora de fundo</span>
                
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="hidden"
                />

                <button
                  onClick={() => musicInputRef.current?.click()}
                  className="py-2 px-4 bg-white border border-[#1A1A1A] text-black rounded-none text-xs font-semibold hover:bg-[#F2EFE9] cursor-pointer"
                >
                  Escolher Música (≤10MB)
                </button>
                <span className="text-[10px] text-neutral-600 truncate max-w-[240px] font-mono mt-1 font-bold">
                  🎵 {musicName}
                </span>
              </div>
            )}

            {/* General bottom actions: Save & Publish */}
            <div className="flex justify-center gap-6 pb-2">
              <button
                onClick={handleSaveDraft}
                className="w-12 h-12 rounded-none bg-white border-2 border-black text-[#1A1A1A] flex items-center justify-center hover:bg-[#F2EFE9] shadow-[2px_2px_0px_#1A1A1A] transition-all"
                title="Guardar"
              >
                <Save className="w-5 h-5" />
              </button>

              <button
                onClick={handlePublish}
                className="w-12 h-12 rounded-none bg-black text-white border-2 border-black flex items-center justify-center hover:-translate-y-0.5 shadow-[2px_2px_0px_#1A1A1A] transition-all"
                title="Publicar"
              >
                <Send className="w-5 h-5 stroke-[2.5px]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Crop Flow */}
      {showCropper && rawImage && (
        <Cropper
          imageSrc={rawImage}
          onApply={handleApplyCropped}
          onCancel={() => {
            setShowCropper(false);
            setRawImage(null);
          }}
        />
      )}

      {/* EDITORIAL PUBLISH COUNTDOWN MODAL OVERLAY */}
      {countdown !== null && (
        <div className="fixed inset-0 bg-[#FAF8F5] z-[99999] flex flex-col justify-center items-center border-4 border-double border-black">
          <div className="text-[8rem] sm:text-[10rem] font-bold font-serif text-black animate-pulse">
            {countdown}
          </div>
          <div className="text-xl font-bold text-black font-serif tracking-widest uppercase mt-4">
            PUBLICANDO HISTÓRIA...
          </div>
        </div>
      )}
    </div>
  );
}
