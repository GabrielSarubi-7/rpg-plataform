import { create } from "zustand";
import { socket } from "@/core/socket/socket";
import type { RoomState } from "@shared/types/multiplayer";

interface LobbyState {
  playerName: string;
  playerId: string | null;
  lobbyCode: string | null;
  players: RoomState["players"];
  error: string | null;
  isLoading: boolean;

  setPlayerName: (name: string) => void;
  createLobby: () => void;
  joinLobby: (code: string) => void;
  leaveLobby: () => void;
  setRoomState: (room: RoomState) => void;
}

export const useLobbyStore = create<LobbyState>((set, get) => ({
  playerName: "",
  playerId: null,
  lobbyCode: null,
  players: [],
  error: null,
  isLoading: false,

  setPlayerName: (playerName) => set({ playerName }),

  createLobby: () => {
    const playerName = get().playerName.trim();

    if (!playerName) {
      set({ error: "Digite seu nome antes de criar um lobby." });
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    set({ isLoading: true, error: null });

    socket.timeout(5000).emit(
      "room:create",
      { playerName },
      (
        err: Error | null,
        response?: {
          ok: boolean;
          room?: RoomState;
          playerId?: string;
          error?: string;
        }
      ) => {
        if (err) {
          set({
            isLoading: false,
            error: "Não foi possível conectar ao servidor.",
          });
          return;
        }

        if (!response?.ok || !response.room) {
          set({
            isLoading: false,
            error: response?.error ?? "Erro ao criar lobby.",
          });
          return;
        }

        set({
          lobbyCode: response.room.code,
          players: response.room.players,
          playerId: response.playerId ?? null,
          error: null,
          isLoading: false,
        });
      }
    );
  },

  joinLobby: (code) => {
    const playerName = get().playerName.trim();

    if (!playerName) {
      set({ error: "Digite seu nome antes de entrar em um lobby." });
      return;
    }

    const roomCode = code.trim().toUpperCase();

    if (!roomCode) {
      set({ error: "Digite o código do lobby." });
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    set({ isLoading: true, error: null });

    socket.timeout(5000).emit(
      "room:join",
      {
        roomCode,
        playerName,
      },
      (
        err: Error | null,
        response?: {
          ok: boolean;
          room?: RoomState;
          playerId?: string;
          error?: string;
        }
      ) => {
        if (err) {
          set({
            isLoading: false,
            error: "Não foi possível conectar ao servidor.",
          });
          return;
        }

        if (!response?.ok || !response.room) {
          set({
            isLoading: false,
            error: response?.error ?? "Erro ao entrar no lobby.",
          });
          return;
        }

        set({
          lobbyCode: response.room.code,
          players: response.room.players,
          playerId: response.playerId ?? null,
          error: null,
          isLoading: false,
        });
      }
    );
  },

  leaveLobby: () =>
    set({
      lobbyCode: null,
      players: [],
      playerId: null,
      error: null,
      isLoading: false,
    }),

  setRoomState: (room) =>
    set({
      lobbyCode: room.code,
      players: room.players,
    }),
}));