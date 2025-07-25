// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  
};

const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const db = getFirestore(app);
export { db,auth, googleProvider, githubProvider };
