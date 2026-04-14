import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCIg0Q4MBUnoC8bwyEeWoStHZ81vtzSz6o",
  authDomain: "epharmacy-f9947.firebaseapp.com",
  projectId: "epharmacy-f9947",
  storageBucket: "epharmacy-f9947.firebasestorage.app",
  messagingSenderId: "33977308152",
  appId: "1:33977308152:web:865d0c98825e4cb0d5bc0d",
  measurementId: "G-CF7563N6ND"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);