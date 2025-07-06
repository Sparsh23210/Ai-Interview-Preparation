// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASrgqRnCVfgelj8XSt0Mera2QpTm6VXGU",
  authDomain: "student-ai-interview.firebaseapp.com",
  projectId: "student-ai-interview",
  storageBucket: "student-ai-interview.firebasestorage.app",
  messagingSenderId: "564546030199",
  appId: "1:564546030199:web:661ea12f560ff1ec405472",
  measurementId: "G-B9BN7LLW9F"
};

const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const db = getFirestore(app);
export { db,auth, googleProvider, githubProvider };
