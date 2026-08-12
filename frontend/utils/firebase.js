// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vortexai-64dce.firebaseapp.com",
  projectId: "vortexai-64dce",
  storageBucket: "vortexai-64dce.firebasestorage.app",
  messagingSenderId: "134063376534",
  appId: "1:134063376534:web:9343fcf7d89ad4617e5ab7",
  measurementId: "G-692P1H3HBE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();