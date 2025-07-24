import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function Streak() {
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentStreak = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const streak = docSnap.data().streak;
        if (streak && typeof streak.currentStreak === "number") {
          setCurrentStreak(streak.currentStreak);
        } else {
          setCurrentStreak(0);
        }
      } else {
        setCurrentStreak(0);
      }
    } catch (err) {
      console.error("❌ Error fetching streak:", err);
      setCurrentStreak(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentStreak();
    const handleStreakUpdate = () => {
      fetchCurrentStreak();
    };

    window.addEventListener("streak-updated", handleStreakUpdate);

    
    return () => {
      window.removeEventListener("streak-updated", handleStreakUpdate);};
  }, []);

  return (
    <div className="d-flex flex-row gap-3 align-items-center">
      <h5 style={{ margin: 0 }}>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span
              style={{
                color: currentStreak > 0 ? "#FFD700" : "#ccc",
                fontSize: "1.8rem",
              }}
            >
              {currentStreak > 0 ? "★" : "☆"}
            </span>{" "}
            {currentStreak} 
          </>
        )}
      </h5>
      <button
        onClick={() => navigate("/Practice")}
        style={{
          color: "black",
          backgroundColor: "#41dc8e",
          border: "none",
          borderRadius: "25px",
          padding: "8px 16px",
          fontWeight: "bold",
        }}
      >
        Daily Question
      </button>
    </div>
  );
}
