import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDU_tfadaAo8wwVEtRkpdGHjG97t1hJjyM",
  authDomain: "coodesh-a8b1f.firebaseapp.com",
  projectId: "coodesh-a8b1f",
  storageBucket: "coodesh-a8b1f.firebasestorage.app",
  messagingSenderId: "140017141561",
  appId: "1:140017141561:web:3d5428064f4a9c517a4ae8",
  measurementId: "G-252EBTMMHK",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
