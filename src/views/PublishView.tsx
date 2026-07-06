/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Image, Type, Check, Sparkles } from 'lucide-react';
import { Post } from '../types';
import Cropper from '../components/Cropper';

interface PublishViewProps {
  currentUser: any;
  onPublishSuccess: (newPost: Post) => void;
  onCancel: () => void;
}

const FONTS_LIST = [
  'Poppins',
  'Roboto',
  'Arial',
  'Times New Roman',
  'Calibri',
  'Georgia',
  'Verdana',
  'Trebuchet MS',
  'Courier New',
  'Impact',
  'Comic Sans MS'
];

const COLORS_LIST = [
  { value: '#1A1A1A', label: 'Preto' },
  { value: '#E63946', label: 'Vermelho' },
  { value: '#1D3557', label: 'Azul Escuro' },
  { value: '#457B9D', label: 'Aço' },
  { value: '#5C6B73', label: 'Cinza' },
  { value: '#E76F51', label: 'Laranja' }
];

export default function PublishView({ currentUser, onPublishSuccess, onCancel }: PublishViewProps) {
  const [text, setText] = React.useState('');
  const [photoSrc, setPhotoSrc] = React.useState<string | null>(null);
  const [selectedFont, setSelectedFont] = React.useState('Georgia');
  const [selectedColor, setSelectedColor] = React.useState('#1A1A1A');
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [showCropper, setShowCropper] = React.useState(false);
  const [rawImage, setRawImage] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handlePublish = () => {
    if (!text.trim() && !photoSrc) {
      alert('Por favor, adicione algum texto ou selecione uma foto!');
      return;
    }

    setIsPublishing(true);

    // Simulate cyber delay of 0.5s as per original spec
    setTimeout(() => {
      const newPost: Post = {
        id: 'post-' + Math.random().toString(36).substring(2, 9),
        image: photoSrc,
        text: text.trim() || null,
        style: { font: selectedFont, color: selectedColor },
        author: {
          name: currentUser ? currentUser.nickname : 'Você',
          avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
          id: currentUser ? currentUser.id : 'user1',
          province: currentUser ? currentUser.province : 'Maputo Cidade'
        },
        stars: 0,
        views: 0,
        starred: false,
        timestamp: Date.now()
      };

      onPublishSuccess(newPost);
      setIsPublishing(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-[520px] mx-auto px-4 py-8 relative z-10" id="publish-view">
      
      {/* Back button */}
      <button
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 text-xs font-bold font-mono tracking-wider uppercase text-black hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Portal
      </button>

      <div className="editorial-card rounded-none p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight font-serif uppercase text-center mb-6">
          PUBLICAR POST
        </h2>

        {/* 1. PHOTO INPUT */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono font-bold text-neutral-800 uppercase mb-2">
            Adicionar Foto (Opcional)
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {photoSrc ? (
            <div className="relative aspect-video rounded-none overflow-hidden border-2 border-black group shadow-[4px_4px_0px_#1A1A1A]">
              <img src={photoSrc} alt="Pre-visualização" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotoSrc(null)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-600 hover:bg-red-700 border border-black text-white text-[10px] font-bold font-mono rounded-none shadow transition"
              >
                REMOVER
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-[#1A1A1A] hover:bg-[#F2EFE9] bg-[#F9F7F2] rounded-none flex flex-col items-center justify-center gap-2 text-[#1A1A1A] transition-all duration-200"
            >
              <Image className="w-8 h-8 text-neutral-700" />
              <span className="text-xs font-mono font-bold uppercase tracking-wide">Escolher Ficheiro de Imagem</span>
            </button>
          )}
        </div>

        {/* 2. TEXT CONTENT */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono font-bold text-neutral-800 uppercase mb-2">
            Texto da Publicação
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="O que estás a pensar no ecossistema Open MZ?"
            className="w-full h-32 bg-white border border-[#1A1A1A] rounded-none p-4 text-[#1A1A1A] text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none transition"
            style={{ fontFamily: selectedFont, color: selectedColor }}
          />
        </div>

        {/* 3. FONTS & STYLE CUSTOMIZATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-[#F9F7F2] p-4 rounded-none border border-black">
          {/* Font dropdown selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase flex items-center gap-1">
              <Type className="w-3 h-3 text-neutral-700" /> Fonte de Letra
            </label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full bg-white text-black text-xs py-2 px-3 border border-[#1A1A1A] rounded-none outline-none cursor-pointer focus:ring-1 focus:ring-black"
            >
              {FONTS_LIST.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Color palette selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase">
              Cor do Texto
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {COLORS_LIST.map((col) => (
                <button
                  key={col.value}
                  type="button"
                  onClick={() => setSelectedColor(col.value)}
                  className={`w-6 h-6 rounded-none border-2 transition-all ${
                    selectedColor === col.value
                      ? 'border-black scale-110 shadow-[2px_2px_0px_#1A1A1A]'
                      : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: col.value }}
                  title={col.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full py-4 bg-[#1A1A1A] text-[#F9F7F2] font-bold uppercase text-xs rounded-none border-2 border-black flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] hover:scale-102 transition-all disabled:opacity-50"
        >
          <Check className="w-5 h-5 stroke-[3px]" />
          {isPublishing ? 'PUBLICANDO...' : 'PUBLICAR AGORA'}
        </button>
      </div>

      {/* Embedded Crop Flow */}
      {showCropper && rawImage && (
        <Cropper
          imageSrc={rawImage}
          onApply={(croppedUrl) => {
            setPhotoSrc(croppedUrl);
            setShowCropper(false);
            setRawImage(null);
          }}
          onCancel={() => {
            setShowCropper(false);
            setRawImage(null);
          }}
        />
      )}
    </div>
  );
}
