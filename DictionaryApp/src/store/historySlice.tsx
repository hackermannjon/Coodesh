import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HistoryState {
  history: string[];
}

const initialState: HistoryState = {
  history: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<string>) => {
      if (!state.history.includes(action.payload)) {
        state.history.push(action.payload);
      }
    },
  },
});

export const { addToHistory } = historySlice.actions;
export default historySlice.reducer;
