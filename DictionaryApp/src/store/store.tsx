import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import historyReducer from "./historySlice";
import wordListReducer from "./wordListSlice";

export const store = configureStore({
  reducer: {
    wordList: wordListReducer,
    favorites: favoritesReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
