import { fetchWordDetails } from "@/src/api/dictionaryService";
import { AppDispatch } from "@/src/store/store";
import { addNewWord, fetchAllWords } from "@/src/store/wordListSlice";
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

interface SearchBarProps {
  onWordAdded?: (word: string) => void;
}

export default function SearchBar({ onWordAdded }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const result = await fetchWordDetails(searchTerm.toLowerCase());

    if (result && result.length > 0) {
      const word = result[0].word;

      // Tenta adicionar a palavra (se já existir, retornará false)
      const added = await addNewWord(word);
      if (added) {
        Alert.alert("Sucesso", `"${word}" foi adicionado à sua lista!`);
      }
      // Atualiza a lista de palavras no Redux
      await dispatch(fetchAllWords());
      // Informa ao componente pai (WordListScreen) a palavra processada
      if (onWordAdded) {
        onWordAdded(word);
      }
      setSearchTerm("");
    } else {
      Alert.alert("Erro", "Palavra não encontrada!");
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        placeholder="Add/Find a word..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <SearchButton onPress={handleSearch}>
        <ButtonText>OK</ButtonText>
      </SearchButton>
    </SearchContainer>
  );
}

const SearchContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 65%;
  margin-bottom: 16px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const SearchButton = styled(TouchableOpacity)`
  padding: 10px 15px;
  background-color: #1d1d1b;
  border-radius: 8px;
  margin-left: 8px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
