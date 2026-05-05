import { create } from "zustand";
import type { ChatMessage } from "@shared/types/chat";

interface ChatStore {
  messages: ChatMessage[];
  isCollapsed: boolean;

  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  toggleCollapsed: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isCollapsed: false,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  toggleCollapsed: () =>
    set((state) => ({
      isCollapsed: !state.isCollapsed,
    })),
}));