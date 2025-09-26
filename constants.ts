
import type { User } from './types';

export const USER_CREDENTIALS: Record<User, { email: string; pass: string }> = {
  user1: { email: 'alex@gemini.com', pass: 'password123' },
  user2: { email: 'jordan@gemini.com', pass: 'password123' },
};

export const USER_DETAILS: Record<User, { name: string; avatar: string }> = {
  user1: { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex' },
  user2: { name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=jordan' },
};
