import { useRouter } from "expo-router";
import React from "react";
import styled from "styled-components/native";

export default function CustomMenu() {
  const router = useRouter();

  return (
    <MenuContainer>
      <MenuButton onPress={() => router.push("/word-list")}>
        <ButtonText>Word List</ButtonText>
      </MenuButton>

      <MenuButton onPress={() => router.push("/history")}>
        <ButtonText>History</ButtonText>
      </MenuButton>

      <MenuButton onPress={() => router.push("/favorites")}>
        <ButtonText>Favorites</ButtonText>
      </MenuButton>
    </MenuContainer>
  );
}

// Estilos com Styled Components
const MenuContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: #3f51b5;
  padding: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const MenuButton = styled.TouchableOpacity`
  padding: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;
