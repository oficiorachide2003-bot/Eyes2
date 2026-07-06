/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Mail, User, ShieldCheck, ChevronRight, ChevronLeft, Sparkles, UserCheck } from 'lucide-react';
import { User as UserType } from '../types';
import { PROVINCES } from '../data';

interface RegisterViewProps {
  onRegisterSuccess: (user: UserType) => void;
  onGoToLogin: () => void;
}

const STORAGE_KEY = 'eyesopenmz_users_v2';
const ALLOWED_PREFIXES = new Set(['82', '83', '84', '85', '86', '87']);

export default function RegisterView({ onRegisterSuccess, onGoToLogin }: RegisterViewProps) {
  // Step 1: Province & Personal info
  const [province, setProvince] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  
  // Step 2: Name & Nickname
  const [fullname, setFullname] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  
  // Step 3: Security & password
  const [password, setPassword] = React.useState('');

  const [currentStep, setCurrentStep] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  function simpleHash(pass: string): string {
    let hash = 0;
    for (let i = 0; i < pass.length; i++) {
      const char = pass.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  function validatePhone(ph: string) {
    let clean = ph.trim().replace(/\s+/g, '');
    if (clean.startsWith('+258')) clean = clean.slice(4);
    if (!/^\d{9}$/.test(clean)) return { ok: false, reason: 'Número inválido. Deve ter exatamente 9 dígitos.' };
    const prefix = clean.slice(0, 2);
    if (!ALLOWED_PREFIXES.has(prefix)) return { ok: false, reason: 'Prefixo inválido em Moçambique. Use 82 a 87.' };
    return { ok: true, phone: '+258' + clean };
  }

  function validateEmail(em: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(em.trim()) ? { ok: true } : { ok: false, reason: 'E-mail inválido.' };
  }

  function validateNames() {
    if (!fullname.trim() || !firstname.trim() || !surname.trim()) {
      return { ok: false, reason: 'Preencha todos os campos de nome.' };
    }
    const words = fullname.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) return { ok: false, reason: 'Nome completo deve conter pelo menos 3 palavras.' };
    if (words[0].toLowerCase() !== firstname.trim().toLowerCase()) {
      return { ok: false, reason: 'Primeiro nome deve coincidir com a primeira palavra do nome completo.' };
    }
    if (words[words.length - 1].toLowerCase() !== surname.trim().toLowerCase()) {
      return { ok: false, reason: 'Apelido deve coincidir com a última palavra do nome completo.' };
    }
    return { ok: true };
  }

  function validateNickname(nick: string) {
    const re = /^[a-zA-Z0-9 ]+$/;
    return re.test(nick.trim()) ? { ok: true } : { ok: false, reason: 'Nickname inválido (sem símbolos especiais).' };
  }

  const handleNextStep = () => {
    setError(null);
    if (currentStep === 1) {
      if (!province) return setError('Por favor, selecione uma província.');
      const phVal = validatePhone(phone);
      if (!phVal.ok) return setError(phVal.reason || 'Erro no telefone');
      const emVal = validateEmail(email);
      if (!emVal.ok) return setError(emVal.reason || 'Erro no email');
    } else if (currentStep === 2) {
      const nameVal = validateNames();
      if (!nameVal.ok) return setError(nameVal.reason || 'Erro nos nomes');
      const nickVal = validateNickname(nickname);
      if (!nickVal.ok) return setError(nickVal.reason || 'Erro no nickname');
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 6) {
      return setError('A senha deve conter no mínimo 6 caracteres.');
    }

    const phoneVal = validatePhone(phone);
    if (!phoneVal.ok) return setError(phoneVal.reason || 'Telefone incorreto');

    // Load users to enforce limit of 3 registrations per number
    const stored = localStorage.getItem(STORAGE_KEY);
    const users: UserType[] = stored ? JSON.parse(stored) : [];
    const count = users.filter((u) => u.phone === phoneVal.phone).length;
    if (count >= 3) {
      return setError('Limite de 3 contas alcançado para este número de telefone.');
    }

    const hashedPassword = simpleHash(password);
    const newUser: UserType = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      phone: phoneVal.phone || '',
      email: email.trim(),
      fullname: fullname.trim(),
      firstname: firstname.trim(),
      surname: surname.trim(),
      nickname: nickname.trim(),
      password: hashedPassword,
      province,
      created: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150', // placeholder
      stats: { likes: 0, posts: 0, friends: 0, views: 0 },
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    setSuccess('Bem vindo, Sua visão é a Nossa Missão!');
    
    setTimeout(() => {
      onRegisterSuccess(newUser);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative z-10 flex items-center justify-center" id="register-view">
      <div className="w-full max-w-[480px]">
        
        {/* Progress header bar */}
        <div className="flex justify-between items-center mb-6 px-1">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-mono font-bold transition-all border ${
                  currentStep >= step
                    ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A]'
                    : 'bg-white text-neutral-400 border-neutral-300'
                }`}
              >
                {step}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider hidden sm:inline ${currentStep === step ? 'text-black font-bold' : 'text-neutral-500'}`}>
                {step === 1 ? 'Residência' : step === 2 ? 'Dados Pessoais' : 'Segurança'}
              </span>
            </div>
          ))}
        </div>

        <div className="editorial-card rounded-none p-6 sm:p-8">
          <div className="text-center mb-6 border-b border-[#1A1A1A] pb-4">
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight font-serif uppercase">
              CRIAR CONTA
            </h2>
            <p className="text-[10px] text-neutral-500 mt-1 uppercase font-mono tracking-widest">
              Passo {currentStep} de 3
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* STEP 1: RESIDENCE, PHONE & EMAIL */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-mono text-[#1A1A1A] uppercase mb-2 font-bold">
                    0. Escolha sua Província
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto p-1 border border-[#1A1A1A] bg-[#F9F7F2] rounded-none custom-scrollbar">
                    {PROVINCES.map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setProvince(prov)}
                        className={`py-2 px-3 text-left rounded-none text-xs font-semibold border transition ${
                          province === prov
                            ? 'bg-black text-white border-black'
                            : 'bg-white border-neutral-200 text-[#1A1A1A] hover:bg-neutral-100'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="1. Número de telefone (+258...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="2. E-mail de contacto"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: NAMES & NICKNAME */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="3. Nome Completo (mín. 3 palavras)"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="4. Primeiro nome"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
                  />
                  <input
                    type="text"
                    placeholder="5. Apelido"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
                  />
                </div>

                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="6. Nickname (sem símbolos especiais)"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: PASSWORD & SECURITY */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-amber-50 border border-[#1A1A1A] rounded-none flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#1A1A1A] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-neutral-700 leading-relaxed font-mono">
                    A segurança cibernética do Open MZ exige uma senha robusta de no mínimo 6 caracteres contendo números e letras.
                  </p>
                </div>

                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
                  <input
                    type="password"
                    placeholder="7. Defina sua Senha de Acesso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-black text-[#1A1A1A] text-sm placeholder-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* Error notifications */}
            {error && (
              <div className="mt-4 p-2.5 rounded-none bg-red-50 border border-red-300 text-red-800 text-xs text-center font-mono font-bold">
                {error}
              </div>
            )}

            {/* Step navigation actions */}
            <div className="flex gap-4 mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 editorial-btn-secondary text-xs font-mono flex items-center justify-center gap-1 cursor-pointer rounded-none"
                >
                  <ChevronLeft className="w-4 h-4" /> VOLTAR
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-3 editorial-btn text-xs font-mono flex items-center justify-center gap-1 cursor-pointer rounded-none ml-auto"
                >
                  AVANÇAR <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRegisterSubmit}
                  className="flex-1 py-3 editorial-btn text-xs font-mono flex items-center justify-center gap-1 cursor-pointer rounded-none"
                >
                  FINALIZAR REGISTO
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onGoToLogin}
              className="w-full text-center text-[#1A1A1A] hover:underline text-xs font-bold font-mono tracking-wider uppercase mt-5 cursor-pointer block"
            >
              Já tenho conta / Fazer login
            </button>
          </form>
        </div>
      </div>

      {/* Floating Welcome Toast */}
      {success && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-[#1A1A1A] p-8 rounded-none shadow-[8px_8px_0px_#1A1A1A] z-[99999] flex flex-col items-center gap-4 text-center max-w-[360px] animate-fade-in">
          <Sparkles className="w-12 h-12 text-[#E63946] animate-pulse" />
          <h3 className="text-lg font-bold text-black tracking-wider font-serif uppercase">BEM VINDO</h3>
          <p className="text-sm font-bold text-neutral-800 leading-relaxed font-sans">
            {success}
          </p>
        </div>
      )}
    </div>
  );
}
