import { useState } from "react";

import FloatingPanel from "@/shared/components/ui/FloatingPanel";
import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import { emitDiceRoll } from "../services/diceSocketService";

const DICE = [4, 6, 8, 10, 12, 20, 100];
const COUNTS = [1, 2, 3, 4, 5, 6];

export default function DicePanel() {
  const [isGmRoll, setIsGmRoll] = useState(false);
  const [customExpression, setCustomExpression] = useState("");

  const lobbyCode = useLobbyStore((s) => s.lobbyCode);
  const playerName = useLobbyStore((s) => s.playerName);

  const roll = (expression: string) => {
    if (!lobbyCode) return;

    emitDiceRoll({
      roomCode: lobbyCode,
      playerName,
      expression,
      isGmRoll,
    });
  };

  const rollCustom = () => {
    const expression = customExpression.trim();

    if (!expression) return;

    roll(expression);
    setCustomExpression("");
  };

  return (
    <FloatingPanel panelId="dice" title="Rolo de dados" width={430} height={470}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#ddd",
          }}
        >
          <input
            type="checkbox"
            checked={isGmRoll}
            onChange={(e) => setIsGmRoll(e.target.checked)}
          />
          Rolo de GM
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px repeat(6, 1fr)",
            gap: 6,
            alignItems: "center",
          }}
        >
          <div />

          {COUNTS.map((count) => (
            <div
              key={count}
              style={{
                fontSize: 12,
                color: "#999",
                textAlign: "center",
              }}
            >
              {count}
            </div>
          ))}

          {DICE.map((sides) => (
            <div
              key={sides}
              style={{
                display: "contents",
              }}
            >
              <button
                type="button"
                onClick={() => roll(`1d${sides}`)}
                className="game-button"
                style={{
                  textAlign: "left",
                  fontWeight: 700,
                }}
              >
                D{sides}
              </button>

              {COUNTS.map((count) => (
                <button
                  key={`${count}d${sides}`}
                  type="button"
                  onClick={() => roll(`${count}d${sides}`)}
                  className="game-button"
                >
                  {count}
                </button>
              ))}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            rollCustom();
          }}
          style={{
            display: "flex",
            gap: 8,
            borderTop: "1px solid #282828",
            paddingTop: 14,
          }}
        >
          <input
            className="game-input"
            value={customExpression}
            onChange={(e) => setCustomExpression(e.target.value)}
            placeholder="Adv. rolo: 2d20+5"
            style={{ flex: 1 }}
          />

          <button type="submit" className="game-button game-button-primary">
            Rolar
          </button>
        </form>
      </div>
    </FloatingPanel>
  );
}