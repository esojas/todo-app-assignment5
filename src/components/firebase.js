// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgq312zmy32K-yjccN0CHUgcG9yW6B1-Q",
  authDomain: "todo-app-project-eeb4d.firebaseapp.com",
  projectId: "todo-app-project-eeb4d",
  storageBucket: "todo-app-project-eeb4d.firebasestorage.app",
  messagingSenderId: "520815676336",
  appId: "1:520815676336:web:b3ff18c0a2a81d1ae9e475"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();