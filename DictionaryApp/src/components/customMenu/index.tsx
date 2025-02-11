import { usePathname, useRouter } from "expo-router";
import React from "react";
import styled from "styled-components/native";

export default function CustomMenu() {
  const router = useRouter();
  const pathname = usePathname(); // Obtém a rota atual

  return (
    <MenuContainer>
      <MenuButton
        onPress={() => router.push("/wordList")}
        isActive={pathname === "/wordList"}
      >
        <ButtonText isActive={pathname === "/wordList"}>Word List</ButtonText>
      </MenuButton>

      <MenuButton
        onPress={() => router.push("/history")}
        isActive={pathname === "/history"}
      >
        <ButtonText isActive={pathname === "/history"}>History</ButtonText>
      </MenuButton>

      <MenuButton
        onPress={() => router.push("/favorites")}
        isActive={pathname === "/favorites"}
      >
        <ButtonText isActive={pathname === "/favorites"}>Favorites</ButtonText>
      </MenuButton>
    </MenuContainer>
  );
}

// Tipagem correta para Styled Components
interface ButtonProps {
  isActive: boolean;
}

// Estilos com Styled Components
const MenuContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: #3f51b5;
  padding: 16px;
  position: absolute;
  top: 0;
  width: 100%;
`;

const MenuButton = styled.TouchableOpacity<ButtonProps>`
  padding: 10px;
  background-color: ${({ isActive }) => (isActive ? "#E3E3E3" : "white")};
  border: 1px solid ${({ isActive }) => (isActive ? "#1D1D1B" : "transparent")};
  border-radius: 8px;
`;

const ButtonText = styled.Text<ButtonProps>`
  color: ${({ isActive }) => (isActive ? "#1D1D1B" : "#3F51B5")};
  font-size: 16px;
`;
