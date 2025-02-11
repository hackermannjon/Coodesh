import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { AppDispatch, RootState } from "../store/store";
import { fetchAllWords } from "../store/wordListSlice";

const screenWidth = Dimensions.get("window").width;
const containerWidth = screenWidth * 0.95;
const itemWidth = containerWidth / 3;

export default function WordListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { words, status } = useSelector((state: RootState) => state.wordList);
  const [displayWords, setDisplayWords] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchAllWords()); // Carrega a lista completa no início
  }, []);

  useEffect(() => {
    if (words.length > 0) {
      setDisplayWords([...words, ...words]); // Duplica a lista para efeito infinito
    }
  }, [words]);

  const loadMoreWords = () => {
    if (words.length > 0) {
      setDisplayWords((prev) => [...prev, ...words]); // Continua repetindo a lista
    }
  };

  return (
    <Container>
      <Title>Word List</Title>
      <WrapperView>
        {status === "loading" ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={displayWords}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <WordItem
                onPress={() => console.log("Selecionado:", item)}
                style={{ width: itemWidth }}
              >
                <WordText>{item}</WordText>
              </WordItem>
            )}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            onEndReached={loadMoreWords}
            onEndReachedThreshold={0.5}
          />
        )}
      </WrapperView>
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

const EmptyWordItem = styled.View`
  aspect-ratio: 1;
  background-color: transparent;
`;
