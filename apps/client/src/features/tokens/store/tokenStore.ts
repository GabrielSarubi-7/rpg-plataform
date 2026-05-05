import { create } from "zustand";
import type { Token } from "@shared/types/token";

interface TokenStore {
  tokens: Record<string, Token>;
  selectedTokenId: string | null;

  setTokens: (tokens: Record<string, Token>) => void;

  addToken: (token: Token) => void;
  addTokenAt: (x: number, y: number) => void;

  moveToken: (id: string, x: number, y: number) => void;

  setSelectedToken: (id: string | null) => void;
  updateTokenImage: (id: string, image: string) => void;
}

export const useTokenStore = create<TokenStore>((set) => ({
  tokens: {},
  selectedTokenId: null,

  setTokens: (tokens) => set({ tokens }),

  addToken: (token) =>
    set((state) => ({
      tokens: {
        ...state.tokens,
        [token.id]: token,
      },
    })),

  addTokenAt: (x, y) =>
    set((state) => {
      const id = crypto.randomUUID();

      return {
        tokens: {
          ...state.tokens,
          [id]: { id, x, y },
        },
      };
    }),

  moveToken: (id, x, y) =>
    set((state) => {
      const token = state.tokens[id];

      if (!token) return state;

      return {
        tokens: {
          ...state.tokens,
          [id]: {
            ...token,
            x,
            y,
          },
        },
      };
    }),

  setSelectedToken: (id) =>
    set({
      selectedTokenId: id,
    }),

  updateTokenImage: (id, image) =>
    set((state) => {
      const token = state.tokens[id];

      if (!token) return state;

      return {
        tokens: {
          ...state.tokens,
          [id]: {
            ...token,
            image,
          },
        },
      };
    }),
}));