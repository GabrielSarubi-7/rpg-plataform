import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger";
  children: ReactNode;
}

export default function Button({
  variant = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "game-button-primary"
      : variant === "danger"
        ? "game-button-danger"
        : "";

  return (
    <button
      className={`game-button ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}