interface Props {
  x: number;
  y: number;
  size: number;
}

export default function GridHighlight({ x, y, size }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        background: "rgba(0, 255, 0, 0.35)",
        border: "2px solid #00ffd0",
        borderRadius: 4,
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    />
  );
}
