import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();
let isLoggingIn = false;
  const handleGoogleLogin = async () => {
     if (isLoggingIn) return;
  isLoggingIn = true;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
       
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
        window.location.replace("/home");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error("Google Login Failed:", err.message);
      alert("Google Login Error: " + err.message);
    } finally {
    isLoggingIn = false;
  }
  };

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
