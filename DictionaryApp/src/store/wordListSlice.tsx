import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWordDetails } from "../api/dictionaryService";

const STORAGE_KEY = "userWords";

export interface WordData {
  word: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings?: { definitions: { definition: string }[] }[];
}

// Função para carregar as palavras adicionadas pelo usuário do AsyncStorage
const loadUserWords = async (): Promise<string[]> => {
  try {
    const storedWords = await AsyncStorage.getItem(STORAGE_KEY);
    return storedWords ? JSON.parse(storedWords) : [];
  } catch (error) {
    console.error("Erro ao carregar palavras salvas:", error);
    return [];
  }
};

// Função utilitária para dividir um array em blocos menores
const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Função para carregar as palavras do dicionário via fetch do GitHub
const loadDictionaryWords = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json"
    );
    const json = await response.json();
    // Extraímos as chaves do objeto (cada chave representa uma palavra)
    const words: string[] = Object.keys(json);
    return words;
  } catch (error) {
    console.error("Erro ao carregar palavras do dicionário:", error);
    return [];
  }
};

// Função para adicionar uma palavra personalizada ao AsyncStorage
export const addNewWord = async (word: string): Promise<boolean> => {
  try {
    const storedWords = await loadUserWords();
    if (storedWords.includes(word)) {
      return false;
    }
    const updatedWords = [...storedWords, word];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
    return true;
  } catch (error) {
    console.error("Erro ao adicionar palavra:", error);
    return false;
  }
};

// Thunk para buscar palavras do GitHub e do AsyncStorage, carregando os detalhes via API em blocos menores.
// Agora, este thunk aceita um parâmetro "page" para implementar a paginação. A cada chamada, ele busca
// um slice de palavras de acordo com o número da página e faz append à lista anterior.
export const fetchAllWords = createAsyncThunk(
  "wordList/fetchAllWords",
  async (page: number, { rejectWithValue }) => {
    try {
      const userWords = await loadUserWords();
      const dictionaryWords = await loadDictionaryWords();
      // Combina as palavras do dicionário e as palavras do usuário, evitando duplicatas
      const allWords = Array.from(new Set([...dictionaryWords, ...userWords]));

      // Define o tamanho da página
      const pageSize = 50;
      const start = page * pageSize;
      const end = start + pageSize;
      const pagedWords = allWords.slice(start, end);

      // Se não houver palavras na página solicitada, retorna um array vazio
      if (pagedWords.length === 0) {
        return [];
      }

      // Define o tamanho dos blocos para as chamadas à API (exemplo: 20 palavras por bloco)
      const chunkSize = 20;
      const wordChunks = chunkArray(pagedWords, chunkSize);

      let completeWords: WordData[] = [];
      // Processa os blocos sequencialmente para evitar sobrecarga
      for (const chunk of wordChunks) {
        const chunkResults = await Promise.all(
          chunk.map(async (word) => {
            const data = await fetchWordDetails(word);
            return data ? data[0] : { word, phonetics: [], meanings: [] };
          })
        );
        completeWords = completeWords.concat(chunkResults);
      }

      return completeWords;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

interface WordListState {
  words: WordData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WordListState = {
  words: [],
  status: "idle",
  error: null,
};

const wordListSlice = createSlice({
  name: "wordList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWords.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllWords.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Ao invés de substituir a lista, fazemos append dos novos dados
        state.words = state.words.concat(action.payload);
      })
      .addCase(fetchAllWords.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Erro ao carregar palavras";
      });
  },
});

export default wordListSlice.reducer;
