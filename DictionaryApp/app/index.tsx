// app/index.tsx
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Carregando...</Text>
    </View>
  );
}
