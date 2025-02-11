import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const HISTORY_STORAGE_KEY = "historyList";

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
      // Remove a palavra se já estiver na lista, para reinseri-la no topo
      state.history = state.history.filter((word) => word !== action.payload);
      state.history.unshift(action.payload);
    },
    setHistory: (state, action: PayloadAction<string[]>) => {
      state.history = action.payload;
    },
  },
});

// **Função para carregar o histórico do AsyncStorage para o Redux na inicialização**
export const loadHistoryFromStorage = () => async (dispatch: any) => {
  try {
    const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (storedHistory) {
      dispatch(setHistory(JSON.parse(storedHistory)));
    }
  } catch (error) {
    console.error("Erro ao carregar histórico do AsyncStorage:", error);
  }
};

// **Função para adicionar ao AsyncStorage somente se ainda não estiver salvo**
export const addToHistoryStorage =
  (word: string) => async (dispatch: any, getState: any) => {
    try {
      const { history } = getState().history;

      if (!history.includes(word)) {
        const updatedHistory = [word, ...history]; // Adiciona ao topo
        await AsyncStorage.setItem(
          HISTORY_STORAGE_KEY,
          JSON.stringify(updatedHistory)
        );
      }

      dispatch(addToHistory(word)); // Atualiza Redux
    } catch (error) {
      console.error("Erro ao salvar histórico no AsyncStorage:", error);
    }
  };

export const { addToHistory, setHistory } = historySlice.actions;
export default historySlice.reducer;
