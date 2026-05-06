import type { DiceRollResult } from "@shared/types/dice";

interface Props {
  dice: DiceRollResult;
}

function getRollStyle(roll: number, sides: number) {
  if (roll === sides) {
    return {
      color: "#ffd54a",
      fontWeight: 900,
      textShadow: "0 0 8px rgba(255, 213, 74, 0.45)",
    };
  }

  if (roll === 1) {
    return {
      color: "#ff5a5a",
      fontWeight: 900,
      textShadow: "0 0 8px rgba(255, 90, 90, 0.45)",
    };
  }

  return {
    color: "#ffffff",
    fontWeight: 500,
  };
}

export default function DiceChatMessage({ dice }: Props) {
  return (
    <div
      style={{
        animation:
          dice.outcome === "critical"
            ? "diceCriticalPulse 0.8s ease-in-out"
            : dice.outcome === "fumble"
              ? "diceFumbleShake 0.45s ease-in-out"
              : undefined,
      }}
    >
      <strong>
        {dice.outcome === "critical"
          ? "🌟 CRÍTICO!"
          : dice.outcome === "fumble"
            ? "💀 FALHA CRÍTICA!"
            : dice.isGmRoll
              ? "🎭 GM Roll"
              : "🎲 Rolagem"}
      </strong>

      <div style={{ marginTop: 4 }}>
        {dice.expression}: [
        {dice.rolls.map((roll, index) => (
          <span key={`${roll}-${index}`}>
            <span style={getRollStyle(roll, dice.sides)}>{roll}</span>
            {index < dice.rolls.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
        {dice.modifier !== 0 &&
          ` ${dice.modifier > 0 ? "+" : "-"} ${Math.abs(dice.modifier)}`}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: dice.outcome === "normal" ? 18 : 24,
          fontWeight: 800,
        }}
      >
        Total: {dice.total}
      </div>
    </div>
  );
}