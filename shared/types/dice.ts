export type DiceRollOutcome = "normal" | "critical" | "fumble";

export interface DiceRollRequest {
  roomCode: string;
  playerName: string;
  expression: string;
  isGmRoll: boolean;
}

export interface DiceRollResult {
  expression: string;
  total: number;
  rolls: number[];
  sides: number;
  modifier: number;
  isGmRoll: boolean;
  outcome: DiceRollOutcome;
}