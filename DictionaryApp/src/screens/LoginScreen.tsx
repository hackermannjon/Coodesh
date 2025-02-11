import { useAuth } from "@/src/hooks/useAuth";
import { setNoAuth } from "@/src/store/authSlice";
import { AppDispatch } from "@/src/store/store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { fetchAllWords } from "../store/wordListSlice";

export default function LoginScreen() {
  const { login, register } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllWords(0));
    };
    fetchData();
  }, [dispatch]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const user = await login(email, password);
      if (user) {
        router.replace("/wordList");
      }
    } catch (error: any) {
      Alert.alert(
        "Erro ao entrar",
        error.message || "Verifique suas credenciais."
      );
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Digite um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const user = await register(email, password);
      if (user) {
        Alert.alert("Conta criada!", "Agora você será redirecionado.");
        router.replace("/wordList");
      }
    } catch (error: any) {
      Alert.alert("Erro ao registrar", error.message || "Tente novamente.");
    }
  };

  const handleContinueWithoutLogin = () => {
    dispatch(setNoAuth(true)); // Define que o usuário entrou sem login
    router.replace("/wordList");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          width: 250,
          height: 40,
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: 250,
          height: 40,
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#1E90FF",
          padding: 10,
          borderRadius: 8,
          marginTop: 10,
          width: 250,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister} style={{ marginTop: 10 }}>
        <Text style={{ color: "#1E90FF", fontSize: 14 }}>Criar uma conta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleContinueWithoutLogin}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "gray", fontSize: 14 }}>Continuar sem login</Text>
      </TouchableOpacity>
    </View>
  );
}
