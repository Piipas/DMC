import { Text, View } from "react-native";
import { useEffect, useMemo } from "react";
import { socket, webSocketClient } from "@/lib/websocket";

export default function Index() {
  useEffect(() => {
    socket.emit("register", { clientId: "unique_device_id" });
    webSocketClient();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
