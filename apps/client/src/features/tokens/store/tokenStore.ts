import { create } from "zustand";

interface Token {
  id: string;
  x: number;
  y: number;
  image?: string;
}

interface TokenStore {
  tokens: Record<string, Token>;
  selectedTokenId: string | null;

  addTokenAt: (x: number, y: number) => void;
  moveToken: (id: string, x: number, y: number) => void;

  setSelectedToken: (id: string | null) => void;
  updateTokenImage: (id: string, image: string) => void;
}
const MAP_WIDTH = 2000;
const MAP_HEIGHT = 1500;

export const useTokenStore = create<TokenStore>((set) => ({
  tokens: {},
  selectedTokenId: null,

  addTokenAt: (x, y) =>
    set((state) => {
      const clampedX = Math.max(0, Math.min(MAP_WIDTH - 40, x));
      const clampedY = Math.max(0, Math.min(MAP_HEIGHT - 40, y));

      const id = crypto.randomUUID();

      return {
        tokens: {
          ...state.tokens,
          [id]: { id, x: clampedX, y: clampedY },
        },
      };
    }),

  moveToken: (id, x, y) =>
    set((state) => {
      const clampedX = Math.max(0, Math.min(MAP_WIDTH - 40, x));
      const clampedY = Math.max(0, Math.min(MAP_HEIGHT - 40, y));

      return {
        tokens: {
          ...state.tokens,
          [id]: {
            ...state.tokens[id],
            x: clampedX,
            y: clampedY,
          },
        },
      };
    }),

  setSelectedToken: (id) =>
    set({
      selectedTokenId: id,
    }),

  updateTokenImage: (id, image) =>
    set((state) => ({
      tokens: {
        ...state.tokens,
        [id]: {
          ...state.tokens[id],
          image,
        },
      },
    })),
}));
