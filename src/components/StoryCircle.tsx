/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus } from 'lucide-react';
import { Story } from '../types';

interface StoryCircleProps {
  story?: Story;
  isAddButton?: boolean;
  onAddClick?: () => void;
  onStoryClick?: () => void;
  key?: any;
}

export default function StoryCircle({
  story,
  isAddButton = false,
  onAddClick,
  onStoryClick,
}: StoryCircleProps) {
  if (isAddButton) {
    return (
      <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group" onClick={onAddClick}>
        <div className="w-[84px] h-[84px] sm:w-24 sm:h-24 rounded-none border-2 border-dashed border-[#1A1A1A] bg-white hover:bg-[#F2EFE9] flex items-center justify-center transition-all duration-200">
          <Plus className="w-8 h-8 text-black group-hover:rotate-90 transition-transform duration-200" />
        </div>
        <span className="text-[10px] sm:text-xs font-mono font-bold text-black uppercase tracking-wider mt-2 group-hover:underline">
          Eyes 42h
        </span>
      </div>
    );
  }

  if (!story) return null;

  return (
    <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group" onClick={onStoryClick}>
      <div className="relative">
        {/* Outer border offset highlight */}
        <div className="absolute inset-0 rounded-none border border-black scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Story square image */}
        <div
          className="w-[84px] h-[84px] sm:w-24 sm:h-24 rounded-none bg-cover bg-center border-2 border-black transition-all duration-200 relative overflow-hidden shadow-[2px_2px_0px_#1A1A1A] group-hover:shadow-[4px_4px_0px_#1A1A1A]"
          style={{ backgroundImage: `url(${story.src})` }}
        >
          {/* Subtle vignette/shading overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
          
          {/* mini icon of the creator */}
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-none border border-black overflow-hidden bg-white">
            <img src={story.author.avatar} alt={story.author.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
      
      <span className="text-[10px] sm:text-xs text-neutral-800 font-bold mt-2 max-w-[80px] truncate text-center font-mono">
        {story.author.name}
      </span>
    </div>
  );
}
