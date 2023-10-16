import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBu6vQIy10Qn5nia7HgoaHKPd4lADnP76I",
    authDomain: "inventopro-6abd2.firebaseapp.com",
    projectId: "inventopro-6abd2",
    storageBucket: "inventopro-6abd2.appspot.com",
    messagingSenderId: "255818188996",
    appId: "1:255818188996:web:e25dae16e2d83f66416191"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app)
export const signIn = signInWithEmailAndPassword;
export const storage = getStorage(app);
export const sendResetEmail = sendPasswordResetEmail;