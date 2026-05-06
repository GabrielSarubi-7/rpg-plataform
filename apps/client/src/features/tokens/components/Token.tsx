import { useTokenStore } from "../store/tokenStore";

interface Props {
  token: {
    id: string;
    x: number;
    y: number;
    image?: string;
  };
  size: number;
  onMouseDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export default function Token({ token, size, onMouseDown }: Props) {
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
        width: size,
        height: size,

        cursor: "grab",
        userSelect: "none",
        touchAction: "none",

        backgroundColor: token.image ? "transparent" : "red",
        backgroundImage: token.image ? `url(${token.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",

        border: isSelected ? "2px solid #00ffd0" : "1px solid rgba(0,0,0,0.35)",
        borderRadius: 4,
        boxSizing: "border-box",
      }}
    />
  );
}