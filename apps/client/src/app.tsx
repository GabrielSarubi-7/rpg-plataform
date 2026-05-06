import MapCanvas from "@/features/map/MapCanvas";
import LobbyScreen from "@/features/lobby/LobbyScreen";
import ChatPanel from "@/features/chat/components/ChatPanel";
import DicePanel from "@/features/dice/components/DicePanel";

import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import { useRoomSocketEvents } from "@/multiplayer/hooks/useRoomSocketEvents";

export default function App() {
  useRoomSocketEvents();

  const lobbyCode = useLobbyStore((s) => s.lobbyCode);

  if (!lobbyCode) {
    return <LobbyScreen />;
  }

  return (
    <>
      <MapCanvas />
      <DicePanel />
      <ChatPanel />
    </>
  );
}