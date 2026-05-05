export default function Grid() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundSize: "40px 40px",
        backgroundImage:
          "linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)"
      }}
    />
  );
}