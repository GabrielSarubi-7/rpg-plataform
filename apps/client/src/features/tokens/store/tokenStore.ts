import { create } from "zustand";

export interface Token {
  id: string;
  x: number;
  y: number;
  image?: string;
}

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
    set((state) => ({
      tokens: {
        ...state.tokens,
        [id]: {
          ...state.tokens[id],
          x,
          y,
        },
      },
    })),

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
