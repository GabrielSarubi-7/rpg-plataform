import type { InputHTMLAttributes } from "react";

export default function NumberInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  return <input className="game-input" type="number" {...props} />;
}