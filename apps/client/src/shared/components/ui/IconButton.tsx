import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function IconButton({
  className = "",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button className={`game-icon-button ${className}`} {...props}>
      {children}
    </button>
  );
}