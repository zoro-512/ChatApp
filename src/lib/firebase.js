// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5p8Ojsbd_69bBbLYE2RwPNgg27Q60YSY",
  authDomain: "react-chat-70e76.firebaseapp.com",
  projectId: "react-chat-70e76",
  storageBucket: "react-chat-70e76.firebasestorage.app",
  messagingSenderId: "1029415750928",
  appId: "1:1029415750928:web:130427d028e35456956995"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore();
