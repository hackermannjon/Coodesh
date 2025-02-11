import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: boolean; // Indica se o usuário está autenticado
  noAuth: boolean; // Indica se o usuário entrou sem login
}

const initialState: AuthState = {
  user: false,
  noAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<boolean>) => {
      state.user = action.payload;
    },
    setNoAuth: (state, action: PayloadAction<boolean>) => {
      state.noAuth = action.payload;
    },
  },
});

export const { setUser, setNoAuth } = authSlice.actions;
export default authSlice.reducer;
