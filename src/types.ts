/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  phone: string;
  email: string;
  fullname: string;
  firstname: string;
  surname: string;
  nickname: string;
  password?: string; // hashed
  province: string;
  created: string;
  avatar: string;
  stats: {
    likes: number;
    posts: number;
    friends: number;
    views: number;
  };
}

export interface Post {
  id: string;
  image: string | null;
  text: string | null;
  style?: {
    font: string;
    color: string;
  };
  author: {
    name: string;
    avatar: string;
    id: string;
    province?: string;
  };
  stars: number;
  views: number;
  starred?: boolean;
  timestamp: number;
}

export interface Story {
  id: string;
  type: 'photo' | 'text';
  src: string;
  text?: string;
  music?: string | null;
  musicName?: string;
  style?: {
    font: string;
    color: string;
  };
  author: {
    name: string;
    avatar: string;
    id: string;
  };
  stars: number;
  views: number;
  starred?: boolean;
  timestamp: number;
}

export type ViewType = 'login' | 'register' | 'feed' | 'publish' | 'eyes42h' | 'profile' | 'account';
