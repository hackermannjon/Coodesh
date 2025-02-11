import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import WordDefinitionModal from "../components/WordDefinitionModal";
import { AppDispatch, RootState } from "../store/store";

const screenWidth = Dimensions.get("window").width;
const containerWidth = screenWidth * 0.95;
const itemWidth = containerWidth / 3;

export default function FavoriteListScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const words = useSelector((state: RootState) => state.wordList.words);
  const [displayWords, setDisplayWords] = useState<any[]>([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const favoriteWords = words.filter((word) => favorites.includes(word.word));
    setDisplayWords(favoriteWords);
  }, [favorites, words]);

  return (
    <Container>
      <Title>Favorites</Title>
      <WrapperView>
        {displayWords.length === 0 ? (
          <NoFavoritesText>Nenhuma palavra favoritada.</NoFavoritesText>
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
          visible={true}
          onClose={() => setSelectedWordIndex(null)}
          wordIndex={selectedWordIndex}
          setWordIndex={setSelectedWordIndex}
          wordsList={displayWords}
          showNavigation={false}
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

const NoFavoritesText = styled.Text`
  color: gray;
  font-size: 16px;
  margin-top: 20px;
`;
