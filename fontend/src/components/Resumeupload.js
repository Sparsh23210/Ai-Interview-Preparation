import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const UploadResume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resumeFile) return alert("Please upload a resume.");
    const formData = new FormData();
    formData.append("resume", resumeFile);

    setLoading(true);
    try {
      
      const questions = [
        "What are your key skills?",
        "Describe a project you worked on.",
        "How do you handle deadlines?",
        "What programming languages do you know?",
        "Explain a challenge you overcame.",
        "What role did you play in the project?",
      "Was it a team project or individual?",
      "What technologies did you use?",
      "Why did you choose this technology stack?",
      "What challenges did you face during development?",
      "How did you handle errors, bugs, or failures in your project?",
      "Can you explain one module/component of your project in detail?",
      "Did you use any design patterns or architecture (e.g., MVC, MVVM)?",
       "Which version control system did you use?",
      "Did you use any third-party libraries or APIs?",
      "How did you test your project?",
      "Was your code optimized for performance?",
      "Did you follow any development methodology (Agile, Scrum)?",
      "How did you communicate and coordinate with your team?",
      "Did you face any conflicts in the team? How did you handle them?",
      "Who reviewed your code?",
      "How were responsibilities divided among team members?",
      "How did you manage timelines and deadlines?",
       "What did you learn from this project?",
      "How would you improve this project now?",
      "Did your project solve the intended problem?",
      "Was your project deployed or live?",
      "What feedback did you receive?"
      ];

      
       localStorage.setItem("resumeFile", resumeFile);
    localStorage.setItem("questions", JSON.stringify(questions));
      navigate("/Projects");
    } catch (err) {
      alert("Failed to generate questions");
     localStorage.setItem("questions", JSON.stringify(["no questions generated", "pls try again"]));
    navigate("/Projects");
    } finally {
      setLoading(false);
    }
  };

  return (<><Navbar/>
  <button
        onClick={() => navigate(-1)}
        style={{
          position: "fixed",
          top: "65px",
          left: "20px",
          zIndex: 9999,
          backgroundColor: "white ",
          color: "black",
          border: "none",
          borderRadius: "20px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
  
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Upload Your Resume (PDF)</h2>
      <input
        type="file"
        accept="application/pdf"
        className="form-control mb-3"
        onChange={handleFileChange}
      />
      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Generate Questions"}
      </button>
    </div></>
  );
};

export default UploadResume;
