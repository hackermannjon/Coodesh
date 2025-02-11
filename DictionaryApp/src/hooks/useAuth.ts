import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // Estado inicial como undefined

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Erro ao registrar:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return { user, login, register, logout };
}
