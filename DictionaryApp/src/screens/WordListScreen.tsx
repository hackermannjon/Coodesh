import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import SearchBar from "../components/SearchBar";
import WordDefinitionModal from "../components/WordDefinitionModal";
import { AppDispatch, RootState } from "../store/store";
import { fetchAllWords } from "../store/wordListSlice";

interface WordData {
  word: string;
  phonetic?: string;
  meanings?: { definitions: { definition: string }[] }[];
}

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth * 0.3;

export default function WordListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { words, status } = useSelector((state: RootState) => state.wordList);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchAllWords());
  }, [dispatch]);

  const renderItem = ({
    item,
    index,
    style,
  }: {
    item: WordData;
    index: number;
    style?: any;
  }) => (
    <WordItem style={style} onPress={() => setSelectedWordIndex(index)}>
      <WordText>{item.word}</WordText>
    </WordItem>
  );

  return (
    <Container>
      <Title>Word List</Title>
      <SearchBarContainer>
        <SearchBar />
      </SearchBarContainer>
      <WrapperView>
        {status === "loading" ? (
          <ActivityIndicator size="large" />
        ) : (
          <Carousel
            data={words}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={itemWidth}
            loop={true}
            autoplay={false}
          />
        )}
      </WrapperView>
      {selectedWordIndex !== null && (
        <WordDefinitionModal
          visible={selectedWordIndex !== null}
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
