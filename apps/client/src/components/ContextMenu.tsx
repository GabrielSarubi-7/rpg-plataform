import { useTokenStore } from "../features/tokens/store/tokenStore";
import TokenUploader from "../features/tokens/components/TokenUploader";

interface Props {
  x: number;
  y: number;
  onAddToken: () => void;
}

export default function ContextMenu({ x, y, onAddToken }: Props) {
  const selectedId = useTokenStore((s) => s.selectedTokenId);
  const updateImage = useTokenStore((s) => s.updateTokenImage);

  return (
    <div
      data-ui-layer="true"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={{
        position: "fixed",
        top: y,
        left: x,
        background: "#2c2c2c",
        padding: 10,
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 999,
        userSelect: "none",
      }}
    >
      <button
        onPointerDown={(e) => e.stopPropagation()} // 🔥 evita fechar antes
        onClick={onAddToken}
      >
        Adicionar Token
      </button>

      {selectedId && (
        <TokenUploader
          onUpload={(img: string) => {
            updateImage(selectedId, img);
          }}
        />
      )}
    </div>
  );
}
