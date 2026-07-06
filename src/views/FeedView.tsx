/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, PlusCircle, Compass, Flame, Radio } from 'lucide-react';
import { Post, Story } from '../types';
import StoryCircle from '../components/StoryCircle';
import PostCard from '../components/PostCard';

interface FeedViewProps {
  posts: Post[];
  stories: Story[];
  currentUserId: string;
  onToggleSidebar: () => void;
  onAddStoryClick: () => void;
  onStoryClick: (story: Story) => void;
  onPostStar: (index: number) => void;
  onPostDelete: (index: number) => void;
  onPostDetailClick: (post: Post) => void;
}

export default function FeedView({
  posts,
  stories,
  currentUserId,
  onToggleSidebar,
  onAddStoryClick,
  onStoryClick,
  onPostStar,
  onPostDelete,
  onPostDetailClick,
}: FeedViewProps) {
  const [activeTab, setActiveTab] = React.useState<'todos' | 'populares'>('todos');

  const filteredPosts = React.useMemo(() => {
    if (activeTab === 'populares') {
      return [...posts].sort((a, b) => b.stars - a.stars);
    }
    return posts;
  }, [posts, activeTab]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 relative z-10" id="feed-view">
      
      {/* Header Bar */}
      <header className="flex justify-between items-center mb-8 border-b-4 border-double border-[#1A1A1A] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1A1A1A] text-white border border-[#1A1A1A]">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black font-serif uppercase">
              PORTAL <span className="underline decoration-slice">OPEN MZ</span>
            </h1>
            <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono font-bold">
              Diário Quântico Nacional de Moçambique // Port 3000
            </p>
          </div>
        </div>

        {/* Hamburger Floating Trigger Button */}
        <button
          onClick={onToggleSidebar}
          className="w-11 h-11 rounded-none bg-white border border-[#1A1A1A] text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* 1. EYES 42H STORIES SECTION */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Flame className="w-5 h-5 text-[#E63946]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-black font-mono">
            Eyes 42h Stories
          </h2>
          <span className="text-[9px] bg-[#1A1A1A] text-white px-2 py-0.5 rounded-none font-mono uppercase font-bold">
            Recentes
          </span>
        </div>

        {/* Horizontal stories track */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar scroll-smooth">
          {/* Add story button */}
          <StoryCircle isAddButton onAddClick={onAddStoryClick} />

          {/* Stored stories */}
          {stories.map((story) => (
            <StoryCircle
              key={story.id}
              story={story}
              onStoryClick={() => onStoryClick(story)}
            />
          ))}

          {stories.length === 0 && (
            <div className="flex items-center justify-center h-[84px] sm:h-24 px-6 border border-dashed border-[#1A1A1A] bg-white text-xs font-mono text-neutral-500">
              Nenhuma história temporária. Publique a sua!
            </div>
          )}
        </div>
      </section>

      {/* Decorative center divider */}
      <div className="w-full h-[3px] border-b border-double border-[#1A1A1A] mb-10" />

      {/* 2. FEED TAB CHANGER CONTROLS */}
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 text-xs font-bold font-mono tracking-wider rounded-none transition-all border cursor-pointer ${
              activeTab === 'todos'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A]'
                : 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F2EFE9]'
            }`}
          >
            REDE GERAL
          </button>
          <button
            onClick={() => setActiveTab('populares')}
            className={`px-4 py-2 text-xs font-bold font-mono tracking-wider rounded-none transition-all border cursor-pointer ${
              activeTab === 'populares'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A]'
                : 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F2EFE9]'
            }`}
          >
            VIBES EM ALTA 🔥
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[9px] font-mono text-neutral-500 uppercase font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Arraste posts para rotação 4D (Editorial 3D Flip)</span>
        </div>
      </div>

      {/* 3. GRID OF POSTS */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {filteredPosts.map((post, idx) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onStar={() => onPostStar(idx)}
              onDelete={() => onPostDelete(idx)}
              onCardClick={() => onPostDetailClick(post)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-[#1A1A1A] bg-white shadow-[4px_4px_0px_#1A1A1A]">
          <PlusCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-serif font-bold text-black uppercase">O feed está em silêncio...</h3>
          <p className="text-[10px] text-neutral-500 font-mono mt-1 uppercase tracking-wider font-bold">
            Seja o primeiro a publicar sua visão editorial!
          </p>
        </div>
      )}
    </div>
  );
}
