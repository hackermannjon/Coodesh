import React, { useEffect } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { AppDispatch, RootState } from "../store/store";
import { fetchWord } from "../store/wordListSlice";

const WORDS = [
  "example",
  "dictionary",
  "code",
  "language",
  "mobile",
  "react",
  "redux",
  "navigation",
]; // Lista fixa de palavras

export default function WordListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { words, status } = useSelector((state: RootState) => state.wordList);

  useEffect(() => {
    loadMoreWords();
  }, []);

  const loadMoreWords = () => {
    if (status !== "loading") {
      const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      dispatch(fetchWord(randomWord));
    }
  };

  return (
    <Container>
      <FlatList
        data={words}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <WordItem>
            <WordText>{item.word}</WordText>
            <PhoneticText>
              {item.phonetics?.[0]?.text || "No phonetic available"}
            </PhoneticText>
          </WordItem>
        )}
        onEndReached={loadMoreWords}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          status === "loading" ? <ActivityIndicator size="large" /> : null
        }
      />
    </Container>
  );
}

// Estilos com Styled Components
const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: white;
`;

const WordItem = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const WordText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const PhoneticText = styled.Text`
  font-size: 14px;
  color: #555;
`;
