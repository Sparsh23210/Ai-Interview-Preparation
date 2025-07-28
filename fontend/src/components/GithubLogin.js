import React from "react";
import { FaGithub } from "react-icons/fa";
import { auth, githubProvider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const GithubLogin = () => {
  const navigate = useNavigate();

  const handleGitHubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
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

      alert("GitHub Login Success!");
      navigate("/home");
    } catch (error) {
      console.error("GitHub login failed:", error.message);
      alert("GitHub Login Error: " + error.message);
    }
  };

  return (
    <button
      onClick={handleGitHubLogin}
      className="btn btn-outline-dark d-flex align-items-center gap-2"
    >
      <FaGithub size={20} />
      Login with GitHub
    </button>
  );
};

export default GithubLogin;
