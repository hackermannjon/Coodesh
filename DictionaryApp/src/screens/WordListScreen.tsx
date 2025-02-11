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
  const { words, status, error } = useSelector(
    (state: RootState) => state.wordList
  );
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );
  // Controlamos a página atual e se ainda há palavras a carregar
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<FlatList<WordData>>(null);

  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(loadHistoryFromStorage());
  }, [dispatch]);

  // Sempre que a "page" muda, disparamos o fetch para os próximos 50 itens
  useEffect(() => {
    dispatch(fetchAllWords(page)).then((action: any) => {
      // Se a página retornou um array vazio, não há mais itens para carregar
      if (action.payload && action.payload.length === 0) {
        setHasMore(false);
      }
    });
  }, [dispatch, page]);

  // Renderiza cada item da lista
  const renderItem = ({ item, index }: ListRenderItemInfo<WordData>) => (
    <WordItem
      onPress={() => setSelectedWordIndex(index)}
      style={{ width: itemWidth }}
    >
      <WordText>{item.word}</WordText>
    </WordItem>
  );

  // Função para o SearchBar (ao adicionar a palavra, a lista é rolada para o item)
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

  // Quando o usuário chegar ao final da lista, tenta carregar mais itens
  const handleEndReached = () => {
    if (status !== "loading" && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Footer para indicar que a lista está carregando mais itens
  const renderFooter = () => {
    if (status === "loading") {
      return <ActivityIndicator size="large" style={{ marginVertical: 20 }} />;
    }
    return null;
  };

  return (
    <Container>
      <Title>Word List</Title>
      <SearchBarContainer>
        <SearchBar onWordAdded={handleWordAdded} />
      </SearchBarContainer>
      <WrapperView>
        {error ? (
          <ErrorText>{error}</ErrorText>
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
            maxToRenderPerBatch={500}
            windowSize={5}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
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

const ErrorText = styled.Text`
  color: red;
  margin: 20px;
  text-align: center;
`;
