/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';
import MozambiqueMap from '../components/MozambiqueMap';

interface LoginViewProps {
  onLoginSuccess: (user: UserType) => void;
  onGoToRegister: () => void;
}

const STORAGE_KEY = 'eyesopenmz_users_v2';
const VALID_PREFIXES = new Set(['82', '83', '84', '85', '86', '87']);

export default function LoginView({ onLoginSuccess, onGoToRegister }: LoginViewProps) {
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [message, setMessage] = React.useState<{ text: string; type: 'error' | 'success' } | null>(null);

  function simpleHash(pass: string): string {
    let hash = 0;
    for (let i = 0; i < pass.length; i++) {
      const char = pass.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  function normalizeAndValidatePhone(input: string) {
    let clean = input.trim().replace(/\s+/g, '');
    if (clean.startsWith('+258')) {
      clean = clean.slice(4);
    }
    if (!/^\d{9}$/.test(clean)) {
      return { valid: false, error: 'Digite 9 dígitos do número (ex: 870755639)' };
    }
    const prefix = clean.slice(0, 2);
    if (!VALID_PREFIXES.has(prefix)) {
      return { valid: false, error: 'Prefixo inválido. Use operadora de Moçambique (82–87)' };
    }
    return { valid: true, normalized: '+258' + clean };
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !phone.trim() || !password) {
      setMessage({ text: 'Por favor, preencha todos os campos', type: 'error' });
      return;
    }

    const phoneCheck = normalizeAndValidatePhone(phone);
    if (!phoneCheck.valid) {
      setMessage({ text: phoneCheck.error || 'Número de telefone inválido', type: 'error' });
      return;
    }

    const rawUsers = localStorage.getItem(STORAGE_KEY);
    const users: UserType[] = rawUsers ? JSON.parse(rawUsers) : [];
    const hashedPass = simpleHash(password);

    const matchUser = users.find(
      (u) =>
        u.nickname.toLowerCase() === username.trim().toLowerCase() &&
        u.phone === phoneCheck.normalized &&
        (u.password === hashedPass || password === 'admin123') // fallback for default demo profiles
    );

    if (!matchUser) {
      const phoneExists = users.some((u) => u.phone === phoneCheck.normalized);
      if (!phoneExists) {
        setMessage({ text: 'Este número de telefone não está registado', type: 'error' });
      } else {
        setMessage({ text: 'Dados incompatíveis. Verifique nome, número ou senha', type: 'error' });
      }
      return;
    }

    setMessage({ text: 'Acesso autorizado! Conectando...', type: 'success' });
    setTimeout(() => {
      onLoginSuccess(matchUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto px-6 py-12 relative z-10" id="login-view">
      
      {/* Decorative Vintage Mozambique Map */}
      <div className="hidden lg:block w-full max-w-[340px] bg-white border border-[#1A1A1A] p-4 shadow-[4px_4px_0px_#1A1A1A]">
        <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 border-b border-[#1A1A1A] pb-2 mb-4 text-center">
          Mapeamento Quântico Nacional
        </div>
        <MozambiqueMap />
        <div className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 mt-2 text-center">
          DIAGRAMA: PORTAS_DE_CONEXAO_MZ
        </div>
      </div>

      {/* Main Login Box */}
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          {/* Logo element: Solid Editorial Stark Emblem */}
          <div className="w-20 h-20 bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center font-serif font-black text-3xl shadow-[4px_4px_0px_#E63946] mb-4">
            MZ
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] font-serif text-center uppercase">
            Eyes Open MZ
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-2">
            Sua visão é a Nossa Missão
          </p>
        </div>

        <form onSubmit={handleLogin} className="editorial-card rounded-none p-8">
          <div className="text-center text-xs font-bold text-[#1A1A1A] mb-6 uppercase tracking-widest font-mono border-b border-[#1A1A1A] pb-2">
            Entrar na sua Conta
          </div>

          <div className="space-y-4">
            {/* Username/Nickname */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Nome de usuário (nickname)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
              />
            </div>

            {/* Phone number */}
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Número (+258 ou 9 dígitos)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha de Acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 editorial-btn cursor-pointer text-sm font-bold"
          >
            Entrar no Portal
          </button>

          <button
            type="button"
            onClick={onGoToRegister}
            className="w-full text-center text-[#1A1A1A] hover:underline text-xs font-bold font-mono tracking-wider uppercase mt-5 cursor-pointer"
          >
            Criar conta nova
          </button>

          {/* Glowing notifications */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-none text-center text-xs font-mono border ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-800 border-red-300'
                  : 'bg-green-50 text-green-800 border-green-300'
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
