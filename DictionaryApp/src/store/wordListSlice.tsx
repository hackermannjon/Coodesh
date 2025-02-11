import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWordDetails } from "../api/dictionaryService";
import { COMMON_WORDS } from "../utils/wordList";

const STORAGE_KEY = "customWordList";

export interface WordData {
  word: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings?: { definitions: { definition: string }[] }[];
}

const loadStoredWords = async (): Promise<string[]> => {
  try {
    const storedWords = await AsyncStorage.getItem(STORAGE_KEY);
    return storedWords ? JSON.parse(storedWords) : [];
  } catch (error) {
    console.error("Erro ao carregar palavras salvas:", error);
    return [];
  }
};

export const addNewWord = async (word: string): Promise<boolean> => {
  try {
    const storedWords = await loadStoredWords();

    // Se a palavra já existir, retorna false
    if (storedWords.includes(word)) {
      return false;
    }

    const updatedWords = [...storedWords, word];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
    return true; // Retorna true se a palavra foi adicionada
  } catch (error) {
    console.error("Erro ao adicionar palavra:", error);
    return false;
  }
};

export const fetchAllWords = createAsyncThunk(
  "wordList/fetchAllWords",
  async (_, { rejectWithValue }) => {
    try {
      const storedWords = await loadStoredWords();
      const allWords = [...COMMON_WORDS, ...storedWords];

      const completeWords = await Promise.all(
        allWords.map(async (word) => {
          const data = await fetchWordDetails(word);
          return data ? data[0] : { word, phonetic: "", meanings: [] };
        })
      );

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
        state.words = action.payload;
      })
      .addCase(fetchAllWords.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Erro ao carregar palavras";
      });
  },
});

export default wordListSlice.reducer;
