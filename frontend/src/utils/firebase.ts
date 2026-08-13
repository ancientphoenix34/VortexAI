import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'vortexai-64dce.firebaseapp.com',
  projectId: 'vortexai-64dce',
  storageBucket: 'vortexai-64dce.firebasestorage.app',
  messagingSenderId: '134063376534',
  appId: '1:134063376534:web:9343fcf7d89ad4617e5ab7',
  measurementId: 'G-692P1H3HBE',
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
