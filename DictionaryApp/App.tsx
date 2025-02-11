// App.tsx
import CustomMenu from "@/src/components/CustomMenu";
import { useAuth } from "@/src/hooks/useAuth";
import { RootState, store } from "@/src/store/store";
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Provider, useSelector } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

function MainApp() {
  const { user } = useAuth();
  const noAuth = useSelector((state: RootState) => state.auth.noAuth);

  return (
    <View style={{ flex: 1 }}>
      {/* Renderiza o roteador (todas as telas definidas em _layout.tsx e demais rotas) */}
      <Slot />
      {/* Renderiza o CustomMenu fora da árvore de navegação, com os dados de usuário */}
      {(user || noAuth) && <CustomMenu />}
    </View>
  );
}
