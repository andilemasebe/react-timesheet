// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_5EbFYsP4oXxyDWlcsa1FwlbTcUoNsWs",
  authDomain: "login-auth-b28d9.firebaseapp.com",
  projectId: "login-auth-b28d9",
  storageBucket: "login-auth-b28d9.appspot.com",
  messagingSenderId: "607188604735",
  appId: "1:607188604735:web:f488b275b5f6162dbe258a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// Pass the app instance to getAuth
export const auth = getAuth(app);
export default app;