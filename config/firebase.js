import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // แก้ไขบรรทัดนี้

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMst8zBOSQvfA9OXDqRoBx3CzMkAFGDEU",
    authDomain: "react-moving.firebaseapp.com",
    projectId: "react-moving",
    storageBucket: "react-moving.appspot.com",
    messagingSenderId: "1037768965187",
    appId: "1:1037768965187:web:91be8ee45bcb26a6fde8f6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // แก้ไขบรรทัดนี้
});


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCMst8zBOSQvfA9OXDqRoBx3CzMkAFGDEU",
//     authDomain: "react-moving.firebaseapp.com",
//     projectId: "react-moving",
//     storageBucket: "react-moving.appspot.com",
//     messagingSenderId: "1037768965187",
//     appId: "1:1037768965187:web:91be8ee45bcb26a6fde8f6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
