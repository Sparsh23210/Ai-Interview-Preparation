
import React from "react";
import { FaGithub } from "react-icons/fa";
import { auth, githubProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const GithubLogin = () => {
  const handleGitHubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("Logged in user:", result.user);
    } catch (error) {
      console.error("GitHub login failed:", error.message);
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
