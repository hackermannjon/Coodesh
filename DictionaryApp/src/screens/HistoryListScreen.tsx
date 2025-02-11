import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import WordDefinitionModal from "../components/WordDefinitionModal";
import { AppDispatch, RootState } from "../store/store";

interface WordData {
  word: string;
  phonetic?: string;
  meanings?: { definitions: { definition: string }[] }[];
}

const screenWidth = Dimensions.get("window").width;
const containerWidth = screenWidth * 0.95;
const itemWidth = containerWidth / 3;

export default function HistoryListScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const history = useSelector((state: RootState) => state.history.history);
  const words = useSelector((state: RootState) => state.wordList.words);
  const [displayWords, setDisplayWords] = useState<WordData[]>([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    // Filtra a lista de palavras para exibir apenas as palavras que estão no histórico
    const historyWords = words.filter((word) => history.includes(word.word));
    setDisplayWords(historyWords);
  }, [history, words]);

  return (
    <Container>
      <Title>History</Title>
      <WrapperView>
        {displayWords.length === 0 ? (
          <NoHistoryText>Nenhuma palavra visualizada.</NoHistoryText>
        ) : (
          <FlatList
            data={displayWords}
            keyExtractor={(item, index) => `${item.word}-${index}`}
            renderItem={({ item, index }) => (
              <WordItem
                onPress={() => setSelectedWordIndex(index)}
                style={{ width: itemWidth }}
              >
                <WordText>{item.word}</WordText>
              </WordItem>
            )}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        )}
      </WrapperView>

      {selectedWordIndex !== null && (
        <WordDefinitionModal
          visible={selectedWordIndex !== null}
          onClose={() => setSelectedWordIndex(null)}
          wordIndex={selectedWordIndex}
          setWordIndex={setSelectedWordIndex}
          wordsList={displayWords} // Passa a lista correta para o modal
          showNavigation={false} // Não permite navegação no histórico
        />
      )}
    </Container>
  );
}

// Estilos com Styled Components
const Container = styled.View`
  flex: 1;
  margin-top: 75px;
  background-color: white;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  position: absolute;
  top: 10px;
  left: 5%;
`;

const WrapperView = styled.View`
  width: 95%;
  top: 50px;
`;

const WordItem = styled(TouchableOpacity)`
  aspect-ratio: 1;
  background-color: #ffffff;
  border-width: 1px;
  align-items: center;
  justify-content: center;
`;

const WordText = styled.Text`
  color: #1d1d1b;
  font-size: 16px;
  font-weight: bold;
`;

const NoHistoryText = styled.Text`
  color: gray;
  font-size: 16px;
  margin-top: 20px;
`;
