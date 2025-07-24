import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../firebase";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider); // Redirect to Google login
    } catch (err) {
      console.error("Google Redirect Failed:", err.message);
      alert("Google Login Error: " + err.message);
    }
  };

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

          alert("Login Success");
          navigate("/home"); // ✅ React Router navigation
        }
      } catch (err) {
        console.error("Redirect login error:", err.message);
        alert("Login error: " + err.message);
      }
    };

    handleRedirectResult();
  }, [navigate]);

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn btn-outline-primary d-flex align-items-center gap-2"
    >
      <FcGoogle size={20} />
      Login with Google
    </button>
  );
};

export default GoogleLogin;
