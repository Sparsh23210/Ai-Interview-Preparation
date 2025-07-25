import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "../Loginstyle.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "./GoogleLogin";
import GithubLogin from "./GithubLogin";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (message) {
      alert(message);
      setMessage("");
    }
  }, [message]);

  const checkEmailExists = async (email) => {
    try {
      // Check if email exists in authentication system
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const initiateSignup = async () => {
    if (!signupData.email || !signupData.password) {
      setMessage("Email and password are required.");
      return;
    }

    try {
      // First check if email is already registered
      const emailExists = await checkEmailExists(signupData.email);
      if (emailExists) {
        setMessage("Email already registered. Please login instead.");
        setIsLogin(true);
        return;
      }

      // Create temporary auth user (will be deleted if not verified)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);
      setIsVerifying(true);
      setMessage("Verification email sent. Please check your inbox.");

      // Check for verification every 5 seconds
      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          setIsVerifying(false);
          
          // Only after verification, store user data in Firestore
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            createdAt: new Date(),
            emailVerified: true
          });

          setMessage("Email verified! Account created successfully. Please login.");
          await signOut(auth); // Sign out so they can login fresh
          setIsLogin(true); // Switch to login tab
        }
      }, 5000);

      // Cleanup interval if component unmounts
      return () => {
        clearInterval(interval);
        if (!user.emailVerified) {
          // Delete unverified user after timeout (optional)
          setTimeout(async () => {
            await user.delete();
          }, 3600000); // 1 hour timeout
        }
      };

    } catch (error) {
      setIsVerifying(false);
      if (error.code === "auth/email-already-in-use") {
        setMessage("Email already registered. Please login instead.");
      } else {
        setMessage(`Signup error: ${error.message}`);
      }
    }
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setMessage("Email and password are required.");
      return;
    }

    try {
      // First check if user exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", loginData.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage("Account not found. Please sign up first.");
        setIsLogin(false);
        return;
      }

      // User exists in Firestore, proceed with login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      
      navigate("/home");

    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setMessage("Account not found. Please sign up first.");
        setIsLogin(false);
      } else if (error.code === "auth/wrong-password") {
        setMessage("Incorrect password.");
      } else {
        setMessage(`Login error: ${error.message}`);
      }
    }
  };

  return (
    <div className="form-structor">
      
      <div className={`signup ${isLogin ? "slide-up" : ""}`}>
        <h2 className="form-title" onClick={() => !isVerifying && setIsLogin(false)}>
          <span>or</span>Sign up
        </h2>
        <div className="form-holder">
          <div className="d-flex justify-content-center align-items-center mt-2">
  <div>
    <GoogleLogin />
    <GithubLogin />
  </div>
  
</div>
<div className="d-flex align-items-center my-3">
  <div className="flex-grow-1 border-top"></div>
  <span className="mx-3 text-muted">Or</span>
  <div className="flex-grow-1 border-top"></div>
</div>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={signupData.email}
            onChange={(e) => setSignupData({...signupData, email: e.target.value})}
            disabled={isVerifying}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={signupData.password}
            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
            disabled={isVerifying}
          />
        </div>
        <button 
          className="submit-btn" 
          onClick={initiateSignup}
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Sign up"}
        </button>
      </div>

    
      <div className={`login ${isLogin ? "" : "slide-up"}`}>
        <div className="center">
          <h2 className="form-title" onClick={() => setIsLogin(true)}>
            <span>or</span>Log in
          </h2>
          <div className="form-holder">
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            />
          </div>
          <button className="submit-btn" onClick={handleLogin}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;