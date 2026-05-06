import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
}

export default function Field({ label, children }: FieldProps) {
  return (
    <div className="game-field">
      <label>{label}</label>
      {children}
    </div>
  );
}