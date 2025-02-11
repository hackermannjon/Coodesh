import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWordDetails } from "../api/dictionaryService";

export const fetchWord = createAsyncThunk(
  "wordList/fetchWord",
  async (word: string, { rejectWithValue }) => {
    try {
      const data = await fetchWordDetails(word);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const wordListSlice = createSlice({
  name: "wordList",
  initialState: {
    words: [] as any[],
    status: "idle", // idle | loading | succeeded | failed
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWord.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWord.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.words = [...state.words, ...action.payload];
      })
      .addCase(fetchWord.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Erro ao buscar palavras";
      });
  },
});

export default wordListSlice.reducer;
