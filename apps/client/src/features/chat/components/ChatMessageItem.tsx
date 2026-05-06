import type { ChatMessage } from "@shared/types/chat";
import DiceChatMessage from "./DiceChatMessage";
import TextChatMessage from "./TextChatMessage";

interface Props {
  message: ChatMessage;
}

export default function ChatMessageItem({ message }: Props) {
  const isDice = message.type === "dice" && message.dice;
  const outcome = message.dice?.outcome;

  return (
    <div>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 3 }}>
        {message.playerName}
      </div>

      <div
        style={{
          background:
            isDice && outcome === "critical"
              ? "linear-gradient(135deg, #2d2600, #463a00)"
              : isDice && outcome === "fumble"
                ? "linear-gradient(135deg, #2a0505, #450909)"
                : isDice
                  ? "#202818"
                  : "#242424",

          border:
            isDice && outcome === "critical"
              ? "1px solid #ffd54a"
              : isDice && outcome === "fumble"
                ? "1px solid #ff4a4a"
                : isDice
                  ? "1px solid #425a2a"
                  : "1px solid transparent",

          padding: 8,
          borderRadius: 8,
          wordBreak: "break-word",
        }}
      >
        {isDice && message.dice ? (
          <DiceChatMessage dice={message.dice} />
        ) : (
          <TextChatMessage text={message.text} />
        )}
      </div>
    </div>
  );
}