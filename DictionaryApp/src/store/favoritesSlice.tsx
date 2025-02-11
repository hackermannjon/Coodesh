import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const FAVORITES_STORAGE_KEY = "favoritesList";

export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Opcional: thunk para salvar os favoritos após atualizações
export const saveFavorites = createAsyncThunk(
  "favorites/saveFavorites",
  async (favorites: string[], { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites)
      );
      return favorites;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

interface FavoritesState {
  favorites: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  status: "idle",
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (word) => word !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        loadFavorites.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.status = "succeeded";
          state.favorites = action.payload;
        }
      )
      .addCase(loadFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Falha ao carregar favoritos";
      })
      // Se utilizar o thunk de salvar, atualiza o estado após salvar
      .addCase(
        saveFavorites.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.favorites = action.payload;
        }
      );
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
