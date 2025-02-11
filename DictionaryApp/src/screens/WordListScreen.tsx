import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { AppDispatch, RootState } from "../store/store";
import { fetchWord } from "../store/wordListSlice";

const screenWidth = Dimensions.get("window").width;
const containerWidth = screenWidth * 0.95;
const itemWidth = containerWidth / 3;

export default function WordListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { words, status } = useSelector((state: RootState) => state.wordList);

  useEffect(() => {
    dispatch(fetchWord("example"));
  }, []);

  const handleWordPress = (word: string) => {
    console.log("Palavra selecionada:", word);
    // Redirecionamento ou outra ação pode ser implementada aqui
  };

  // Função para formatar os dados, preenchendo com itens vazios
  const formatData = (data: any[], numColumns: number) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    const newData = [...data];
    if (numberOfElementsLastRow !== 0) {
      for (let i = numberOfElementsLastRow; i < numColumns; i++) {
        newData.push({ empty: true, key: `empty-${i}` });
      }
    }
    return newData;
  };

  const formattedData = formatData(words, 3);

  const renderItem = ({ item }: { item: any }) => {
    if (item.empty) {
      return <EmptyWordItem style={{ width: itemWidth }} />;
    }
    return (
      <WordItem
        onPress={() => handleWordPress(item.word)}
        style={{ width: itemWidth }}
      >
        <WordText>{item.word}</WordText>
      </WordItem>
    );
  };

  return (
    <Container>
      <Title>Word List</Title>
      <WrapperView>
        <FlatList
          data={formattedData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: "flex-start" }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            status === "loading" ? <ActivityIndicator size="large" /> : null
          }
        />
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
