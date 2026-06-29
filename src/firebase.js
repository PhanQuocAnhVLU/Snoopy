import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAvq2UAvAcYthEZXKy36nEJ2eN-w5ELuZc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "snoopy-coffee-take-away.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "snoopy-coffee-take-away",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "snoopy-coffee-take-away.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "624922929249",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:624922929249:web:55ec3d4bf6eb07042fe220",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VCXMTG4QE1"
};

let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn("Firebase initialization failed (probably missing config):", error);
}

export { auth, googleProvider };
