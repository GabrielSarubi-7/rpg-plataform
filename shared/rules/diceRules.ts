import type { DiceRollOutcome, DiceRollResult } from "../types/dice";

const ALLOWED_DICE = [4, 6, 8, 10, 12, 20, 100];

function getDiceOutcome(rolls: number[], sides: number): DiceRollOutcome {
  if (rolls.length !== 1) return "normal";

  const natural = rolls[0];

  if (natural === sides) return "critical";
  if (natural === 1) return "fumble";

  return "normal";
}

export function rollDiceExpression(
  expression: string,
  isGmRoll = false
): DiceRollResult {
  const normalized = expression
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  const match = normalized.match(/^(\d*)d(\d+)([+-]\d+)?$/);

  if (!match) {
    throw new Error("Expressão inválida. Use algo como d20, 2d6 ou 1d20+5.");
  }

  const count = Number(match[1] || 1);
  const sides = Number(match[2]);
  const modifier = Number(match[3] || 0);

  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("Quantidade de dados inválida.");
  }

  if (!ALLOWED_DICE.includes(sides)) {
    throw new Error("Tipo de dado não permitido.");
  }

  const rolls = Array.from({ length: count }, () => {
    return Math.floor(Math.random() * sides) + 1;
  });

  const total = rolls.reduce((sum, value) => sum + value, 0) + modifier;
  const outcome = getDiceOutcome(rolls, sides);

  return {
    expression: normalized,
    total,
    rolls,
    sides,
    modifier,
    isGmRoll,
    outcome,
  };
}

export function formatDiceResultText(
  playerName: string,
  result: DiceRollResult
) {
  const gmPrefix = result.isGmRoll ? "[GM] " : "";

  const modifierText =
    result.modifier > 0
      ? ` + ${result.modifier}`
      : result.modifier < 0
        ? ` - ${Math.abs(result.modifier)}`
        : "";

  const outcomeText =
    result.outcome === "critical"
      ? " CRÍTICO!"
      : result.outcome === "fumble"
        ? " FALHA CRÍTICA!"
        : "";

  return `${gmPrefix}${playerName} rolou ${result.expression}: [${result.rolls.join(
    ", "
  )}]${modifierText} = ${result.total}${outcomeText}`;
}