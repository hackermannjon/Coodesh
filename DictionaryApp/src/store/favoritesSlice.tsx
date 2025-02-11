import { auth, db } from "@/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const FAVORITES_STORAGE_KEY = "favoritesList";

export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let favorites = docSnap.data()?.favorites;
          if (!favorites) {
            favorites = [];
            await updateDoc(docRef, { favorites });
          }
          return favorites;
        } else {
          await setDoc(docRef, { favorites: [] });
          return [];
        }
      } else {
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITES_STORAGE_KEY
        );
        return storedFavorites ? JSON.parse(storedFavorites) : [];
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      return rejectWithValue(error);
    }
  }
);

export const addFavoriteAsync = createAsyncThunk(
  "favorites/addFavorite",
  async (word: string, { getState, rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      const state: any = getState();
      const currentFavorites: string[] = state.favorites.favorites;
      if (currentFavorites.includes(word)) return currentFavorites;
      const updatedFavorites = [...currentFavorites, word];
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, { favorites: updatedFavorites });
        } else {
          const data = docSnap.data();
          let favoritesFromDB: string[] = data?.favorites || [];
          if (!favoritesFromDB.includes(word)) {
            favoritesFromDB.push(word);
          }
          await updateDoc(docRef, { favorites: favoritesFromDB });
        }
      } else {
        await AsyncStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(updatedFavorites)
        );
      }
      return updatedFavorites;
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      return rejectWithValue(error);
    }
  }
);

export const removeFavoriteAsync = createAsyncThunk(
  "favorites/removeFavorite",
  async (word: string, { getState, rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      const state: any = getState();
      const currentFavorites: string[] = state.favorites.favorites;
      const updatedFavorites = currentFavorites.filter((fav) => fav !== word);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          let favoritesFromDB: string[] = data?.favorites || [];
          favoritesFromDB = favoritesFromDB.filter((fav) => fav !== word);
          await updateDoc(docRef, { favorites: favoritesFromDB });
        } else {
          await setDoc(docRef, { favorites: [] });
        }
      } else {
        await AsyncStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(updatedFavorites)
        );
      }
      return updatedFavorites;
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
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
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favorites = action.payload;
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
        state.error = action.error.message || "Erro ao carregar favoritos";
      })
      .addCase(
        addFavoriteAsync.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.favorites = action.payload;
        }
      )
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.error = action.error.message || "Erro ao adicionar favorito";
      })
      .addCase(
        removeFavoriteAsync.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.favorites = action.payload;
        }
      )
      .addCase(removeFavoriteAsync.rejected, (state, action) => {
        state.error = action.error.message || "Erro ao remover favorito";
      });
  },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
