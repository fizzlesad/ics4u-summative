import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyCKb_k__t50WDh55AsXAQz61hdXPRA5u5w",
    authDomain: "summative-9360c.firebaseapp.com",
    projectId: "summative-9360c",
    storageBucket: "summative-9360c.firebasestorage.app",
    messagingSenderId: "283139748870",
    appId: "1:283139748870:web:20ba98e07b018507393f87"
  };

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };