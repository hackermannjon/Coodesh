import { usePathname, useRouter } from "expo-router";
import React from "react";
import styled from "styled-components/native";

export default function CustomMenu() {
  const router = useRouter();
  const pathname = usePathname();

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

interface ButtonProps {
  isActive: boolean;
}

const MenuContainer = styled.View`
  flex-direction: row;
  width: 100%;
  background-color: #e3e3e3;
  padding: 16px;
  position: absolute;
  top: 0;
`;

const MenuButton = styled.TouchableOpacity<ButtonProps>`
  flex: 1;
  padding: 10px;
  background-color: ${({ isActive }: ButtonProps) =>
    isActive ? "white " : "#E3E3E3"};
  border: 1px solid;
  border-color: "#1D1D1B";
  border-radius: 8px;
  margin: 0 1px;
`;

const ButtonText = styled.Text<ButtonProps>`
  color: ${({ isActive }: ButtonProps) => (isActive ? "#1D1D1B" : "#3F51B5")};
  font-size: 16px;
  text-align: center;
`;
