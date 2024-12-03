import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Persist auth state in localStorage
export const authAtom = atomWithStorage<boolean>('auth', false);
export const userAtom = atomWithStorage<{
  id: string;
  name: string;
  email: string;
  role: string;
} | null>('user', null);