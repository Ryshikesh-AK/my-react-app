// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpeFqfX_l88L1su7vzGjy-Ufapluqf5TM",
  authDomain: "sstracker-cdd5f.firebaseapp.com",
  projectId: "sstracker-cdd5f",
  storageBucket: "sstracker-cdd5f.firebasestorage.app",
  messagingSenderId: "668666223510",
  appId: "1:668666223510:web:37bef8a1ad605c3ed55bb7",
  measurementId: "G-E7V58FS771"
};

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// 2. Initialize Firestore (the database)
const db = getFirestore(app);
// 3. EXPORT the database so other files can see it
export { db };