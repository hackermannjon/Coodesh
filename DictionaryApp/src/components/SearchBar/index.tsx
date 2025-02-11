import { fetchWordDetails } from "@/src/api/dictionaryService";
import { AppDispatch } from "@/src/store/store";
import { addNewWord } from "@/src/store/wordListSlice";
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";
import WordDefinitionModal from "../WordDefinitionModal";

interface SearchBarProps {
  onWordAdded?: (word: string) => void;
}

export default function SearchBar({ onWordAdded }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [directWord, setDirectWord] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const result = await fetchWordDetails(searchTerm.toLowerCase());
    if (result && result.length > 0) {
      const wordDetail = result[0];
      await addNewWord(wordDetail.word);
      if (onWordAdded) {
        onWordAdded(wordDetail.word);
      }
      setDirectWord(wordDetail);
      setModalVisible(true);
      setSearchTerm("");
    } else {
      Alert.alert("Erro", "Palavra não existe na api!");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setDirectWord(null);
  };

  return (
    <>
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
      {directWord && (
        <WordDefinitionModal
          visible={modalVisible}
          onClose={handleCloseModal}
          wordIndex={0}
          setWordIndex={() => {}}
          wordsList={[directWord]}
          showNavigation={false}
        />
      )}
    </>
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
