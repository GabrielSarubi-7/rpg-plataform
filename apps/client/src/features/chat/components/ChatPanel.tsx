import { useEffect, useRef, useState } from "react";
import { socket } from "@/core/socket/socket";
import { useChatStore } from "../store/chatStore";
import { useLobbyStore } from "@/features/lobby/store/lobbyStore";

export default function ChatPanel() {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useChatStore((s) => s.messages);
  const isCollapsed = useChatStore((s) => s.isCollapsed);
  const toggleCollapsed = useChatStore((s) => s.toggleCollapsed);

  const lobbyCode = useLobbyStore((s) => s.lobbyCode);
  const playerName = useLobbyStore((s) => s.playerName);
  const players = useLobbyStore((s) => s.players);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = () => {
    const value = text.trim();

    if (!value || !lobbyCode) return;

    socket.emit("chat:send", {
      roomCode: lobbyCode,
      playerName,
      text: value,
    });

    setText("");
  };

  if (isCollapsed) {
    return (
      <button
        onClick={toggleCollapsed}
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          zIndex: 20,
          padding: "10px 12px",
          background: "#222",
          color: "white",
          border: "1px solid #555",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Chat
      </button>
    );
  }

  return (
    <aside
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: 320,
        height: "100vh",
        background: "#181818",
        color: "white",
        borderLeft: "1px solid #333",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>Chat</strong>

          <button onClick={toggleCollapsed}>Recolher</button>
        </div>

        <div style={{ fontSize: 13, color: "#bbb" }}>
          Sala: <strong>{lobbyCode}</strong>
        </div>

        <div style={{ fontSize: 12, color: "#999" }}>
          Jogadores: {players.map((p) => p.name).join(", ") || "—"}
        </div>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            <div style={{ fontSize: 12, color: "#aaa" }}>
              {msg.playerName}
            </div>

            <div
              style={{
                background: "#242424",
                padding: 8,
                borderRadius: 8,
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
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
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #444",
            background: "#242424",
            color: "white",
          }}
        />

        <button type="submit">Enviar</button>
      </form>
    </aside>
  );
}