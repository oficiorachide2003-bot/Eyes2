/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Terminal, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { User, Post, Story, ViewType } from './types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES } from './data';

// Views
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import FeedView from './views/FeedView';
import PublishView from './views/PublishView';
import Eyes42hView from './views/Eyes42hView';
import ProfileView from './views/ProfileView';
import MyAccountView from './views/MyAccountView';

// Global Components
import Sidebar from './components/Sidebar';
import StoryModal from './components/StoryModal';

const USERS_STORAGE_KEY = 'eyesopenmz_users_v2';
const POSTS_STORAGE_KEY = 'posts_menu_1_1_1';
const STORIES_STORAGE_KEY = 'eyes42h_stories';
const SESSION_STORAGE_KEY = 'eyesopen_current_user';

export default function App() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [currentView, setView] = React.useState<ViewType>('login');
  
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [stories, setStories] = React.useState<Story[]>([]);
  
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<Story | null>(null);
  
  // Custom Action Modal feedback
  const [activeAction, setActiveAction] = React.useState<string | null>(null);

  // Initializing local storage and preloaded state
  React.useEffect(() => {
    // 1. Initialize Users list if empty
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    }

    // 2. Initialize Posts
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      setPosts(INITIAL_POSTS);
    }

    // 3. Initialize Stories
    const storedStories = localStorage.getItem(STORIES_STORAGE_KEY);
    if (storedStories) {
      setStories(JSON.parse(storedStories));
    } else {
      localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(INITIAL_STORIES));
      setStories(INITIAL_STORIES);
    }

    // 4. Session recovery
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession) {
      const recovered = JSON.parse(storedSession);
      setCurrentUser(recovered);
      setView('feed');
    }
  }, []);

  // Post Like increment
  const handlePostStar = (idx: number) => {
    const updated = [...posts];
    const post = updated[idx];
    if (post.starred) {
      post.stars = Math.max(0, post.stars - 1);
      post.starred = false;
    } else {
      post.stars += 1;
      post.starred = true;
    }
    setPosts(updated);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
  };

  // Post Delete
  const handlePostDelete = (idx: number) => {
    if (confirm('Tem certeza de que deseja eliminar definitivamente esta publicação da rede quântica?')) {
      const updated = posts.filter((_, i) => i !== idx);
      setPosts(updated);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Story Star increment
  const handleStoryStar = () => {
    if (!selectedStory) return;
    
    const updatedStories = stories.map((s) => {
      if (s.id === selectedStory.id) {
        const nextStarred = !s.starred;
        const nextStars = s.stars + (nextStarred ? 1 : -1);
        const nextStory = { ...s, starred: nextStarred, stars: Math.max(0, nextStars) };
        setSelectedStory(nextStory);
        return nextStory;
      }
      return s;
    });

    setStories(updatedStories);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
  };

  const handlePublishPost = (newPost: Post) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
    setView('feed');
  };

  const handlePublishStory = (newStory: Story) => {
    const updated = [newStory, ...stories];
    setStories(updated);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updated));
    setView('feed');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    setView('feed');
  };

  const handleLogout = () => {
    if (confirm('Deseja desconectar sua sessão da rede Open MZ?')) {
      setCurrentUser(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setView('login');
    }
  };

  const handleDeleteAccount = () => {
    if (currentUser) {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      const users: User[] = raw ? JSON.parse(raw) : [];
      const filtered = users.filter((u) => u.id !== currentUser.id);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
      
      setCurrentUser(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setView('login');
      alert('Sua conta foi removida com sucesso. Esperamos seu retorno!');
    }
  };

  const handleActionTrigger = (action: string) => {
    setActiveAction(action);
  };

  return (
    <div className="editorial-viewport text-[#1A1A1A] font-sans relative pb-10">
      
      {/* Editorial Decorative Grid Background & Side Info */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F9F7F2]">
        {/* Newspaper watermark */}
        <div className="absolute top-[10%] left-[5%] font-serif font-bold text-[180px] text-black/[0.015] uppercase leading-none select-none tracking-tighter">
          E_O_M
        </div>

        {/* Side margins */}
        <div className="absolute left-4 top-24 text-[8px] font-mono text-black/40 uppercase writing-mode-vertical select-none tracking-widest hidden md:block space-y-4">
          <div>SYS_NODE_OK // DIARIO_DE_MAPUTO</div>
          <div>ESTADO: IMPRESSO // EDICAO_QUANTICA</div>
          <div>CRYPTO_CONNECT_ESTABLISHED</div>
        </div>

        {/* Clean paper grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,26,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.015)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* CORE SCREENS DRIVER ROUTER */}
      <main className="relative z-10 w-full">
        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setView('register')}
          />
        )}

        {currentView === 'register' && (
          <RegisterView
            onRegisterSuccess={(user) => {
              setCurrentUser(user);
              localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
              setView('feed');
            }}
            onGoToLogin={() => setView('login')}
          />
        )}

        {currentView === 'feed' && (
          <FeedView
            posts={posts}
            stories={stories}
            currentUserId={currentUser?.id || 'user1'}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onAddStoryClick={() => setView('eyes42h')}
            onStoryClick={(story) => {
              // Increment story views on open
              const updated = stories.map((s) => s.id === story.id ? { ...s, views: s.views + 1 } : s);
              setStories(updated);
              localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updated));
              
              setSelectedStory({ ...story, views: story.views + 1 });
            }}
            onPostStar={handlePostStar}
            onPostDelete={handlePostDelete}
            onPostDetailClick={(post) => {
              // Increment post views on view
              const updated = posts.map((p) => p.id === post.id ? { ...p, views: p.views + 1 } : p);
              setPosts(updated);
              localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
              alert(`Detalhes da Publicação:\n\n"${post.text || 'Imagem'}"\n\nAutor: ${post.author.name}\nVisualizações: ${post.views + 1}\nLikes: ${post.stars}`);
            }}
          />
        )}

        {currentView === 'publish' && (
          <PublishView
            currentUser={currentUser}
            onPublishSuccess={handlePublishPost}
            onCancel={() => setView('feed')}
          />
        )}

        {currentView === 'eyes42h' && (
          <Eyes42hView
            currentUser={currentUser}
            onPublishSuccess={handlePublishStory}
            onCancel={() => setView('feed')}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onCancel={() => setView('feed')}
            onTriggerAction={handleActionTrigger}
          />
        )}

        {currentView === 'account' && (
          <MyAccountView
            currentUser={currentUser}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onCancel={() => setView('feed')}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </main>

      {/* Floating Side Panel Menu component */}
      <Sidebar
        currentView={currentView}
        setView={setView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onTriggerAction={handleActionTrigger}
      />

      {/* Stories visualizer component */}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onStar={handleStoryStar}
        />
      )}

      {/* CORE CYBER DEVELOPMENT NOTIFICATION ACTION POPUP MODAL */}
      {activeAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[20000] flex items-center justify-center p-6">
          <div className="w-full max-w-[420px] bg-white border-2 border-[#1A1A1A] rounded-none p-6 shadow-[8px_8px_0px_#1A1A1A] text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-none bg-neutral-100 border border-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <Terminal className="w-8 h-8 text-[#1A1A1A]" />
            </div>

            <h3 className="text-lg font-bold text-[#1A1A1A] tracking-wider font-serif uppercase mb-2">
              CONEXÃO RESTREITA
            </h3>
            
            <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-4">
              Ação: {activeAction} // pendente
            </p>

            <div className="bg-[#F9F7F2] border border-[#1A1A1A] p-4 rounded-none text-left mb-6 font-sans text-xs leading-relaxed text-[#1A1A1A]">
              <p className="text-[#E63946] font-bold mb-1 flex items-center gap-1 font-serif italic">
                <ShieldAlert className="w-4 h-4 animate-pulse" /> REDE QUÂNTICA EM ATUALIZAÇÃO
              </p>
              A funcionalidade de <span className="font-bold underline">“{activeAction.toUpperCase()}”</span> está presentemente a ser integrada na rede quântica nacional de Moçambique. Requer conexão certificada para sincronicidade global de dados.
            </div>

            <button
              onClick={() => setActiveAction(null)}
              className="editorial-btn w-full py-2.5 px-6 font-bold text-xs"
            >
              FECHAR CONEXÃO [OK]
            </button>
          </div>
        </div>
      )}

      {/* Humble Footer Info */}
      <footer className="text-center text-[10px] text-neutral-500 font-mono tracking-widest uppercase mt-12 z-10 relative pb-4">
        © {new Date().getFullYear()} Eyes Open MZ — DIÁRIO DE NOTÍCIAS QUANTICAS — MAPUTO, MOÇAMBIQUE
      </footer>
    </div>
  );
}
