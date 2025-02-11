import { addFavorite, removeFavorite } from "@/src/store/favoritesSlice";
import { AppDispatch, RootState } from "@/src/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

const FAVORITES_STORAGE_KEY = "favoritesList";

const addFavoriteToStorage = async (word: string): Promise<void> => {
  try {
    const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    const favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];
    if (!favoritesArray.includes(word)) {
      favoritesArray.push(word);
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favoritesArray)
      );
    }
  } catch (error) {
    console.error("Erro ao adicionar favorito no storage:", error);
  }
};

const removeFavoriteFromStorage = async (word: string): Promise<void> => {
  try {
    const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    let favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];
    favoritesArray = favoritesArray.filter((w: string) => w !== word);
    await AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoritesArray)
    );
  } catch (error) {
    console.error("Erro ao remover favorito do storage:", error);
  }
};

const screenWidth = Dimensions.get("window").width;

interface WordDefinitionModalProps {
  visible: boolean;
  onClose: () => void;
  wordIndex: number;
  setWordIndex: (index: number) => void;
  wordsList?: any[];
  showNavigation?: boolean;
}

export default function WordDefinitionModal({
  visible,
  onClose,
  wordIndex,
  setWordIndex,
  wordsList,
  showNavigation = true,
}: WordDefinitionModalProps) {
  const globalWords = useSelector((state: RootState) => state.wordList.words);
  const words = wordsList || globalWords;
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const dispatch = useDispatch<AppDispatch>();

  if (!words || words.length === 0) return null;
  const wordData = words[wordIndex];
  if (!wordData || typeof wordData !== "object") return null;

  let phoneticText = "N/A";
  if (wordData.phonetics && Array.isArray(wordData.phonetics)) {
    phoneticText = wordData.phonetics.find((p: any) => p.text)?.text || "N/A";
  } else if (wordData.phonetic) {
    phoneticText = wordData.phonetic;
  }

  const isFavorite = favorites.includes(wordData.word);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(wordData.word));
      removeFavoriteFromStorage(wordData.word);
      Alert.alert("Removido", `"${wordData.word}" foi removido dos favoritos.`);
      if (!showNavigation) {
        onClose();
      }
    } else {
      dispatch(addFavorite(wordData.word));
      addFavoriteToStorage(wordData.word);
      Alert.alert(
        "Favoritado",
        `"${wordData.word}" foi adicionado aos favoritos.`
      );
    }
  };

  const handlePrevious = () => {
    if (wordIndex > 0) setWordIndex(wordIndex - 1);
  };

  const handleNext = () => {
    if (wordIndex < words.length - 1) setWordIndex(wordIndex + 1);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Overlay>
        <ModalContainer>
          <CloseButton onPress={onClose}>
            <CloseButtonText>X</CloseButtonText>
          </CloseButton>
          <WordBox>
            <WordText>{wordData.word}</WordText>
            <PhoneticText>{phoneticText}</PhoneticText>
          </WordBox>
          <Title>Meanings</Title>
          <ScrollView>
            {wordData.meanings &&
              wordData.meanings.map((meaning: any, index: number) => (
                <MeaningText key={index}>
                  {meaning.definitions && meaning.definitions[0]?.definition
                    ? meaning.definitions[0].definition
                    : "Sem definição disponível"}
                </MeaningText>
              ))}
          </ScrollView>
          <ActionButton onPress={handleToggleFavorite}>
            <ButtonText>
              {isFavorite ? "Desfazer\nFavorito" : "Favoritar"}
            </ButtonText>
          </ActionButton>
          {showNavigation && (
            <ButtonContainer>
              <NavBackButton
                onPress={handlePrevious}
                disabled={wordIndex === 0}
              >
                <ButtonText>Voltar</ButtonText>
              </NavBackButton>
              <NavButton
                onPress={handleNext}
                disabled={wordIndex === words.length - 1}
              >
                <ButtonText>Próximo</ButtonText>
              </NavButton>
            </ButtonContainer>
          )}
        </ModalContainer>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 90%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const CloseButton = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  left: 10px;
`;

const CloseButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const WordBox = styled.View`
  width: ${screenWidth * 0.8}px;
  background-color: pink;
  padding: 16px;
  border-radius: 10px;
  align-items: center;
  margin-top: 30px;
`;

const WordText = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const PhoneticText = styled.Text`
  font-size: 18px;
  color: gray;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
`;

const MeaningText = styled.Text`
  font-size: 16px;
  margin-top: 10px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding: 12px 20px;
  background-color: #3f51b5;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  bottom: 20px;
  position: absolute;
`;

const NavButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  padding: 12px 20px;
  background-color: ${({ disabled }: { disabled?: boolean }) =>
    disabled ? "gray" : "#3f51b5"};
  border-radius: 8px;
  align-items: center;
`;
const NavBackButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  padding: 12px 30px;
  background-color: ${({ disabled }: { disabled?: boolean }) =>
    disabled ? "gray" : "#3f51b5"};
  border-radius: 8px;
  align-items: center;
`;
