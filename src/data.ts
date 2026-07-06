/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, Story } from './types';

export const PROVINCES = [
  'Niassa',
  'Cabo Delgado',
  'Nampula',
  'Zambézia',
  'Tete',
  'Manica',
  'Sofala',
  'Inhambane',
  'Gaza',
  'Maputo Província',
  'Maputo Cidade'
];

export const INITIAL_USERS = [
  {
    id: 'user1',
    phone: '+25884000111',
    email: 'alex@openmz.com',
    fullname: 'Alexandre MZ',
    firstname: 'Alexandre',
    surname: 'MZ',
    nickname: 'Alex MZ',
    province: 'Maputo Cidade',
    created: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    stats: { likes: 1250, posts: 14, friends: 342, views: 5600 }
  },
  {
    id: 'user2',
    phone: '+25886222333',
    email: 'helena.santos@openmz.com',
    fullname: 'Helena Santos',
    firstname: 'Helena',
    surname: 'Santos',
    nickname: 'Helena',
    province: 'Sofala',
    created: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
    stats: { likes: 3400, posts: 28, friends: 512, views: 9800 }
  },
  {
    id: 'user3',
    phone: '+25887333444',
    email: 'lucilio@openmz.com',
    fullname: 'Lucílio Mucavele',
    firstname: 'Lucílio',
    surname: 'Mucavele',
    nickname: 'Lucilio',
    province: 'Inhambane',
    created: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    stats: { likes: 890, posts: 6, friends: 120, views: 2300 }
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    text: 'Amanhecer incrível na Praia do Tofo, Inhambane! Moçambique é simplesmente maravilhoso. 🇲🇿☀️',
    style: { font: 'Poppins', color: '#00ffea' },
    author: {
      name: 'Lucílio Mucavele',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
      id: 'user3',
      province: 'Inhambane'
    },
    stars: 45,
    views: 312,
    starred: false,
    timestamp: Date.now() - 3600000 * 2 // 2 hours ago
  },
  {
    id: 'post-2',
    image: null,
    text: '“Sua visão é a Nossa Missão” - Eyes Open MZ conectando mentes brilhantes de Niassa à Maputo. O futuro é tecnológico e cibernético!',
    style: { font: 'Courier New', color: '#ff00ff' },
    author: {
      name: 'Alexandre MZ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      id: 'user1',
      province: 'Maputo Cidade'
    },
    stars: 128,
    views: 890,
    starred: true,
    timestamp: Date.now() - 3600000 * 5 // 5 hours ago
  },
  {
    id: 'post-3',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600',
    text: 'Preparando os últimos detalhes do novo curta-metragem sobre o ritmo Marrabenta nas ruas de Maputo! Quem aí apoia o cinema moçambicano? 🎬🎵',
    style: { font: 'Impact', color: '#ffffff' },
    author: {
      name: 'Alexandre MZ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      id: 'user1',
      province: 'Maputo Cidade'
    },
    stars: 89,
    views: 450,
    starred: false,
    timestamp: Date.now() - 3600000 * 12 // 12 hours ago
  },
  {
    id: 'post-4',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600',
    text: 'A inovação tecnológica em Beira está decolando! Orgulho de fazer parte deste ecossistema digital incrível. 💡🔥',
    style: { font: 'Georgia', color: '#00d9ff' },
    author: {
      name: 'Helena Santos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
      id: 'user2',
      province: 'Sofala'
    },
    stars: 210,
    views: 1205,
    starred: false,
    timestamp: Date.now() - 3600000 * 24 // 1 day ago
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    type: 'photo',
    src: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=300',
    text: 'Matapa deliciosa ao almoço de hoje! 🇲🇿🍤',
    author: {
      name: 'Helena Santos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
      id: 'user2'
    },
    stars: 24,
    views: 110,
    timestamp: Date.now() - 3600000
  },
  {
    id: 'story-2',
    type: 'photo',
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300',
    text: 'Novos tênis cyberpunk para correr nas praias da Costa do Sol.',
    author: {
      name: 'Alexandre MZ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      id: 'user1'
    },
    stars: 12,
    views: 65,
    timestamp: Date.now() - 3600000 * 3
  }
];
