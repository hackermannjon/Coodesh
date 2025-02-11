// app/_layout.tsx
import CustomMenu from "@/src/components/CustomMenu";
import { useAuth } from "@/src/hooks/useAuth";
import { RootState, store } from "@/src/store/store";
import { Slot, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Provider, useSelector } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <MyLayout />
    </Provider>
  );
}

function MyLayout() {
  const { user } = useAuth();
  const noAuth = useSelector((state: RootState) => state.auth.noAuth);
  const router = useRouter();
  // Estado para adiar a renderização do CustomMenu até após o primeiro render
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Após o primeiro mount, permite a renderização do CustomMenu
    setShowMenu(true);

    // Redireciona conforme o estado de autenticação
    if (user || noAuth) {
      router.replace("/wordList");
    } else {
      router.replace("/login");
    }
    // O redirecionamento ocorrerá depois que o layout já estiver montado,
    // evitando o erro "Attempted to navigate before mounting the Root Layout component."
  }, [user, noAuth, router]);

  return (
    // Retornamos uma única View que engloba o Slot
    // Na primeira renderização, apenas o Slot (que renderiza as Screens) será visto.
    <View style={{ flex: 1 }}>
      <Slot />
      {showMenu && (user || noAuth) && <CustomMenu />}
    </View>
  );
}
