import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import SearchBar from "../components/SearchBar";
import WordDefinitionModal from "../components/WordDefinitionModal";
import { loadFavorites } from "../store/favoritesSlice";
import { loadHistoryFromStorage } from "../store/historySlice";
import { AppDispatch, RootState } from "../store/store";
import { fetchAllWords } from "../store/wordListSlice";

interface WordData {
  word: string;
  phonetic?: string;
  meanings?: { definitions: { definition: string }[] }[];
}

const screenWidth = Dimensions.get("window").width;
const containerWidth = screenWidth * 0.95;
const itemWidth = containerWidth / 3;
const numColumns = 3;

export default function WordListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { words, status } = useSelector((state: RootState) => state.wordList);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );
  const flatListRef = useRef<FlatList<WordData>>(null);

  useEffect(() => {
    dispatch(fetchAllWords());
    dispatch(loadFavorites());
    dispatch(loadHistoryFromStorage());
  }, [dispatch]);

  const renderItem = ({ item, index }: ListRenderItemInfo<WordData>) => (
    <WordItem
      onPress={() => setSelectedWordIndex(index)}
      style={{ width: itemWidth }}
    >
      <WordText>{item.word}</WordText>
    </WordItem>
  );

  // Função chamada a partir do SearchBar, que localiza o índice da palavra adicionada na lista completa
  const handleWordAdded = (word: string) => {
    const indexInWords = words.findIndex(
      (item) => item.word.toLowerCase() === word.toLowerCase()
    );
    if (indexInWords !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: indexInWords,
        animated: true,
      });
      setSelectedWordIndex(indexInWords);
    }
  };

  return (
    <Container>
      <Title>Word List</Title>
      <SearchBarContainer>
        <SearchBar onWordAdded={handleWordAdded} />
      </SearchBarContainer>
      <WrapperView>
        {status === "loading" ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={words}
            keyExtractor={(item, index) => `${item.word}-${index}`}
            renderItem={renderItem}
            numColumns={numColumns}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            getItemLayout={(_, index: number) => {
              const rowIndex = Math.floor(index / numColumns);
              const offset = rowIndex * itemWidth;
              return { length: itemWidth, offset, index };
            }}
            initialNumToRender={20}
            maxToRenderPerBatch={300}
            windowSize={5}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                if (flatListRef.current) {
                  const fallbackIndex = Math.max(
                    0,
                    Math.min(info.index, words.length - 1)
                  );
                  flatListRef.current.scrollToIndex({
                    index: fallbackIndex,
                    animated: false,
                  });
                }
              }, 500);
            }}
          />
        )}
      </WrapperView>
      {selectedWordIndex !== null && (
        <WordDefinitionModal
          visible={true}
          onClose={() => setSelectedWordIndex(null)}
          wordIndex={selectedWordIndex}
          setWordIndex={setSelectedWordIndex}
        />
      )}
    </Container>
  );
}

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

const SearchBarContainer = styled.View`
  width: 100%;
  margin-top: 7px;
  left: 30%;
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
