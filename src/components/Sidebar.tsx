/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Eye, User, FileText, Video, MessageSquare, Calendar, Store, Film, Type, Music, Users, Settings, Plus, UserCog, LogOut } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onLogout: () => void;
  onTriggerAction: (actionName: string) => void;
}

export default function Sidebar({
  currentView,
  setView,
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onTriggerAction,
}: SidebarProps) {
  const menuItems = [
    { id: 'feed', label: 'Início', icon: Home, view: 'feed' as ViewType },
    { id: 'abra', label: 'Abra os Olhos', icon: Eye, action: 'abra' },
    { id: 'profile', label: 'Perfil', icon: User, view: 'profile' as ViewType },
    { id: 'account', label: 'Minha Conta', icon: UserCog, view: 'account' as ViewType },
    { id: 'artigos', label: 'Artigos', icon: FileText, action: 'artigos' },
    { id: 'videos', label: 'Vídeos', icon: Video, action: 'videos' },
    { id: 'conversas', label: 'Conversas', icon: MessageSquare, action: 'conversas' },
    { id: 'eventos', label: 'Eventos', icon: Calendar, action: 'eventos' },
    { id: 'loja', label: 'Loja', icon: Store, action: 'loja' },
    { id: 'cinema', label: 'Cinema', icon: Film, action: 'cinema' },
    { id: 'fonte', label: 'Fonte de Letra', icon: Type, action: 'fonte' },
    { id: 'musica', label: 'Música', icon: Music, action: 'musica' },
    { id: 'comunidade', label: 'Comunidade', icon: Users, action: 'comunidade' },
    { id: 'config', label: 'Configurações', icon: Settings, action: 'config' },
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    onClose();
    if (item.view) {
      setView(item.view);
    } else if (item.action) {
      onTriggerAction(item.action);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 right-0 h-full w-[280px] bg-white border-l-2 border-[#1A1A1A] p-6 flex flex-col z-50 transition-transform duration-300 ease-out shadow-[-4px_0px_0px_rgba(26,26,26,0.15)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="cyber-sidebar"
      >
        <div className="text-center mb-6 border-b border-[#1A1A1A] pb-4">
          <div className="text-3xl font-bold tracking-tight text-black font-serif uppercase">
            OPEN MZ
          </div>
          {currentUser && (
            <div className="mt-2 text-xs text-neutral-600 font-mono">
              Usuário: <span className="font-bold underline">{currentUser.nickname}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.view ? currentView === item.view : false;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center px-4 py-2.5 rounded-none transition-all duration-200 text-left text-xs font-bold uppercase tracking-wider border ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'text-neutral-700 border-transparent hover:bg-[#F2EFE9] hover:text-black'
                }`}
              >
                <IconComponent className="mr-3 w-4 h-4 text-neutral-500" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-[#1A1A1A] space-y-2">
          <button
            onClick={() => {
              onClose();
              setView('publish');
            }}
            className="w-full flex items-center justify-center gap-2 py-3 editorial-btn text-xs tracking-wider rounded-none font-bold"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            Publicar
          </button>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-700 bg-white hover:bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-none transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>
      </aside>
    </>
  );
}
