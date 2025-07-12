import { create } from 'zustand';
import { parseDSA } from '../parser/dsaParser';
import type { DSAItem } from '../parser/dsaParser';


interface VisualStore {
  items: DSAItem[];
  parseInput: (input: string) => void;
}

export const useVisualStore = create<VisualStore>((set) => ({
  items: [],
  parseInput: (input) => {
    const parsed = parseDSA(input);
    set({ items: parsed });
  },
}));