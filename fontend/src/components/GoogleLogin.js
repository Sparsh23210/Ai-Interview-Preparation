import React, { useEffect } from "react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

const GoogleLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const user = result.user;

          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          if (!userSnap.exists()) {
            await setDoc(userDocRef, {
              email: user.email,
              name: user.displayName || "",
              createdAt: new Date(),
              emailVerified: user.emailVerified,
            });
          }

          alert("Login Success!");
          navigate("/home");
          setTimeout(() => window.location.replace("/home"), 1000);
        }
      } catch (error) {
        console.error("Redirect login failed:", error);
      }
    };

    handleRedirectResult();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2>Login with Google</h2>
      <button onClick={handleLogin} className="btn btn-primary">
        Sign In With Google
      </button>
    </div>
  );
};

export default GoogleLogin;
