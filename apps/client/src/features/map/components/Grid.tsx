interface Props {
  zoom: number;
  cellSize: number;
}

const MAJOR_GRID_EVERY = 5;

export default function Grid({ zoom, cellSize }: Props) {
  const minorOpacity = zoom < 0.25 ? 0 : zoom < 0.45 ? 0.06 : 0.12;
  const majorOpacity = zoom < 0.25 ? 0.16 : 0.22;

  const lineWidth = Math.max(1 / zoom, 0.5);
  const majorLineWidth = Math.max(1.5 / zoom, 0.75);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",

        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,${minorOpacity}) ${lineWidth}px, transparent ${lineWidth}px),
          linear-gradient(to bottom, rgba(255,255,255,${minorOpacity}) ${lineWidth}px, transparent ${lineWidth}px),
          linear-gradient(to right, rgba(255,255,255,${majorOpacity}) ${majorLineWidth}px, transparent ${majorLineWidth}px),
          linear-gradient(to bottom, rgba(255,255,255,${majorOpacity}) ${majorLineWidth}px, transparent ${majorLineWidth}px)
        `,

        backgroundSize: `
          ${cellSize}px ${cellSize}px,
          ${cellSize}px ${cellSize}px,
          ${cellSize * MAJOR_GRID_EVERY}px ${cellSize * MAJOR_GRID_EVERY}px,
          ${cellSize * MAJOR_GRID_EVERY}px ${cellSize * MAJOR_GRID_EVERY}px
        `,
      }}
    />
  );
}
