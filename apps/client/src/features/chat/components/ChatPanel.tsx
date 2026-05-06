import { useEffect, useRef, useState } from "react";

import { useChatStore } from "../store/chatStore";
import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import { emitChatMessage } from "../services/chatSocketService";

import ChatMessageItem from "./ChatMessageItem";

export default function ChatPanel() {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useChatStore((s) => s.messages);

  const lobbyCode = useLobbyStore((s) => s.lobbyCode);
  const playerName = useLobbyStore((s) => s.playerName);
  const players = useLobbyStore((s) => s.players);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = () => {
    const value = text.trim();

    if (!value || !lobbyCode) return;

    emitChatMessage(lobbyCode, playerName, value);
    setText("");
  };

  return (
    <aside
      data-ui-layer="true"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: 320,
        height: "100dvh",
        background: "#181818",
        color: "white",
        borderLeft: "1px solid #333",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: 12,
          borderBottom: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <strong>Chat</strong>

        <div style={{ fontSize: 13, color: "#bbb" }}>
          Sala: <strong>{lobbyCode}</strong>
        </div>

        <div style={{ fontSize: 12, color: "#999" }}>
          Jogadores: {players.map((p) => p.name).join(", ") || "—"}
        </div>
      </header>

      <div
        className="game-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        style={{
          padding: 12,
          borderTop: "1px solid #333",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enviar mensagem..."
          className="game-input"
          style={{
            flex: 1,
          }}
        />

        <button type="submit" className="game-button game-button-primary">
          Enviar
        </button>
      </form>
    </aside>
  );
}
