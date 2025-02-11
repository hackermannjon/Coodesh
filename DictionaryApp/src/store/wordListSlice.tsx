import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { COMMON_WORDS } from "../utils/wordList";

const STORAGE_KEY = "customWordList";

// Função para carregar palavras salvas pelo usuário
const loadStoredWords = async (): Promise<string[]> => {
  try {
    const storedWords = await AsyncStorage.getItem(STORAGE_KEY);
    return storedWords ? JSON.parse(storedWords) : [];
  } catch (error) {
    console.error("Erro ao carregar palavras salvas:", error);
    return [];
  }
};

// Função para adicionar novas palavras ao AsyncStorage
export const addNewWord = async (word: string) => {
  try {
    const storedWords = await loadStoredWords();
    const updatedWords = [...storedWords, word];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
  } catch (error) {
    console.error("Erro ao adicionar palavra:", error);
  }
};

// Fetch inicial para carregar todas as palavras
export const fetchAllWords = createAsyncThunk(
  "wordList/fetchAllWords",
  async (_, { rejectWithValue }) => {
    try {
      const storedWords = await loadStoredWords();
      return [...COMMON_WORDS, ...storedWords]; // Retorna todas as palavras
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const wordListSlice = createSlice({
  name: "wordList",
  initialState: {
    words: [] as string[], // Lista de palavras
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWords.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllWords.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.words = action.payload; // Armazena todas as palavras na store
      })
      .addCase(fetchAllWords.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Erro ao carregar palavras";
      });
  },
});

export default wordListSlice.reducer;
