import { useAuth } from "@/src/hooks/useAuth";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <Input placeholder="E-mail" onChangeText={setEmail} value={email} />
      <Input
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <RegisterButton onPress={() => register(email, password)}>
        <ButtonText>Registrar</ButtonText>
      </RegisterButton>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Input = styled(TextInput)`
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

const RegisterButton = styled(TouchableOpacity)`
  padding: 12px;
  background-color: #34a853;
  border-radius: 8px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
