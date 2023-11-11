// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMst8zBOSQvfA9OXDqRoBx3CzMkAFGDEU",
    authDomain: "react-moving.firebaseapp.com",
    projectId: "react-moving",
    storageBucket: "react-moving.appspot.com",
    messagingSenderId: "1037768965187",
    appId: "1:1037768965187:web:91be8ee45bcb26a6fde8f6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
