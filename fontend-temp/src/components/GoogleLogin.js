import { auth, googleProvider } from "../firebase";  // or "./firebase" if in the same folder
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate=useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if(result.user){alert(" Login Success");
        navigate("/home");
      }
      else{
        alert("Login failed");
        
      }
      }
     catch (err) {
      console.error("Google Login Failed:", err.message);
    }
  };


  return (
    <button onClick={handleGoogleLogin} className="btn btn-outline-primary d-flex align-items-center gap-2">
      <FcGoogle size={20} />
      Login with Google
    </button>);
};

export default GoogleLogin;
