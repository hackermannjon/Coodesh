import CustomMenu from "@/src/components/customMenu";
import { Stack } from "expo-router";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "../src/store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}></Stack>
        <CustomMenu></CustomMenu>
      </View>
    </Provider>
  );
}
