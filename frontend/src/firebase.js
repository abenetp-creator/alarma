import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDeZLGHwybOtHoPBr60Wr9qBwYy7rAaJHw",
  authDomain: "alarma-escola.firebaseapp.com",
  databaseURL: "https://alarma-escola-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "alarma-escola",
  storageBucket: "alarma-escola.firebasestorage.app",
  messagingSenderId: "54029780189",
  appId: "1:54029780189:web:40e7c88341e1d713bb0734"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);