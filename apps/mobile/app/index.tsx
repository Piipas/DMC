import { Alert, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { webSocketClient } from "@/lib/websocket";

export default function Index() {
  const [hasPermission, setHasPermission] = useState(false);
  const [uniqueUuid, setUniqueUuid] = useState<string>();
  const fileUri = `${FileSystem.documentDirectory}dmc`;

  const writeFile = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(fileUri, uuid());
        Alert.alert(
          "File written",
          "The file first_file.txt has been written."
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermission();
  }, []);

  useEffect(() => {
    if (hasPermission) writeFile();
  }, [hasPermission]);

  useEffect(() => {
    const getUuid = async () => {
      const uuid = await FileSystem.readAsStringAsync(fileUri);
      setUniqueUuid(uuid);
    };
    getUuid();
  }, []);

  useMemo(() => {
    if (uniqueUuid) webSocketClient(uniqueUuid);
  }, [uniqueUuid]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the most trusted mobile app.</Text>
    </View>
  );
}
