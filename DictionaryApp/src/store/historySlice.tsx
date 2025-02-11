import { auth, db } from "@/firebase"; // Importa Firestore e Auth
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
      state.history = state.history.filter((word) => word !== action.payload);
      state.history.unshift(action.payload);
    },
    setHistory: (state, action: PayloadAction<string[]>) => {
      state.history = action.payload;
    },
  },
});

// **Função para carregar histórico do Firestore ou AsyncStorage**
export const loadHistoryFromStorage = () => async (dispatch: any) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatch(setHistory(docSnap.data().history || []));
      }
    } else {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        dispatch(setHistory(JSON.parse(storedHistory)));
      }
    }
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
  }
};

// **Função para adicionar histórico no Firestore ou AsyncStorage**
export const addToHistoryStorage =
  (word: string) => async (dispatch: any, getState: any) => {
    try {
      const user = auth.currentUser;
      const { history } = getState().history;
      const updatedHistory = [word, ...history];

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, { history: updatedHistory }); // Cria o documento se não existir
        } else {
          await updateDoc(docRef, { history: updatedHistory }); // Atualiza se já existir
        }
      } else {
        await AsyncStorage.setItem(
          HISTORY_STORAGE_KEY,
          JSON.stringify(updatedHistory)
        );
      }

      dispatch(addToHistory(word));
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }
  };

export const { addToHistory, setHistory } = historySlice.actions;
export default historySlice.reducer;
