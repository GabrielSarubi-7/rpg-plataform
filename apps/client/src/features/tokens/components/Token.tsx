import { useTokenStore } from "../store/tokenStore";

export default function Token({ token, onMouseDown }: any) {
  const selectedId = useTokenStore((s) => s.selectedTokenId);
  const setSelectedToken = useTokenStore((s) => s.setSelectedToken);

  const isSelected = selectedId === token.id;

  return (
    <div
      draggable={false}
      onPointerDown={(e) => {
        if (e.button !== 0) return;

        e.stopPropagation();

        setSelectedToken(token.id);
        onMouseDown(e);
      }}
      style={{
        position: "absolute",
        left: token.x,
        top: token.y,
        width: 40,
        height: 40,
        cursor: "grab",
        userSelect: "none",

        backgroundColor: token.image ? "transparent" : "red",
        backgroundImage: token.image ? `url(${token.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",

        border: isSelected ? "2px solid #00ffcc" : "none",
        borderRadius: 4,
      }}
    />
  );
}
