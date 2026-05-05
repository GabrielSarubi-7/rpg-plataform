import { useState } from "react";
import { useLobbyStore } from "./store/lobbyStore";

export default function LobbyScreen() {
  const playerName = useLobbyStore((s) => s.playerName);
  const setPlayerName = useLobbyStore((s) => s.setPlayerName);
  const createLobby = useLobbyStore((s) => s.createLobby);
  const joinLobby = useLobbyStore((s) => s.joinLobby);
  const error = useLobbyStore((s) => s.error);
  const isLoading = useLobbyStore((s) => s.isLoading);

  const [code, setCode] = useState("");

  const canContinue = playerName.trim().length > 0 && !isLoading;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#1f1f1f",
          padding: 32,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>RPG Platform</h1>

        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Seu nome na aventura"
          style={{
            padding: 12,
            borderRadius: 8,
            border: "1px solid #444",
            background: "#2b2b2b",
            color: "white",
          }}
        />

        <button disabled={!canContinue} onClick={createLobby}>
          {isLoading ? "Conectando..." : "Criar Lobby"}
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código do lobby"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #444",
              background: "#2b2b2b",
              color: "white",
            }}
          />

          <button
            disabled={!canContinue || !code.trim()}
            onClick={() => joinLobby(code)}
          >
            Entrar
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#3a1f1f",
              border: "1px solid #884444",
              padding: 10,
              borderRadius: 8,
              color: "#ffb3b3",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}