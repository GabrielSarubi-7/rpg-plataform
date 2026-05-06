import { useEffect } from "react";

import { socket } from "@/core/socket/socket";

import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import { useTokenStore } from "@/features/tokens/store/tokenStore";
import { useChatStore } from "@/features/chat/store/chatStore";
import { useMapStore } from "@/features/map/store/mapStore";

import type { RoomState } from "@shared/types/multiplayer";
import type { ChatMessage } from "@shared/types/chat";

export function useRoomSocketEvents() {
  const setRoomState = useLobbyStore((s) => s.setRoomState);

  const setTokens = useTokenStore((s) => s.setTokens);
  const moveTokenLocal = useTokenStore((s) => s.moveToken);

  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);

  const setMapSettings = useMapStore((s) => s.setMapSettings);

  useEffect(() => {
    const handleRoomState = (room: RoomState) => {
      setRoomState(room);
      setTokens(room.tokens);
      setMapSettings(room.mapSettings);
    };

    const handleTokenMoved = (data: {
      tokenId: string;
      x: number;
      y: number;
    }) => {
      moveTokenLocal(data.tokenId, data.x, data.y);
    };

    const handleChatHistory = (messages: ChatMessage[]) => {
      setMessages(messages);
    };

    const handleChatMessage = (message: ChatMessage) => {
      addMessage(message);
    };

    socket.on("room:state", handleRoomState);
    socket.on("token:moved", handleTokenMoved);
    socket.on("chat:history", handleChatHistory);
    socket.on("chat:message", handleChatMessage);

    return () => {
      socket.off("room:state", handleRoomState);
      socket.off("token:moved", handleTokenMoved);
      socket.off("chat:history", handleChatHistory);
      socket.off("chat:message", handleChatMessage);
    };
  }, [
    setRoomState,
    setTokens,
    moveTokenLocal,
    setMessages,
    addMessage,
    setMapSettings,
  ]);
}