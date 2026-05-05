interface Props {
  x: number;
  y: number;
}

export default function GridHighlight({ x, y }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 40,
        height: 40,
        background: "rgba(0, 255, 0, 0.3)",
        pointerEvents: "none"
      }}
    />
  );
}