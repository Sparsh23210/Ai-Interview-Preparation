import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/engineering`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const questions = response.data.question || [];

      navigate("/projects", {
        state: { resumeFile, questions },
      });
    } catch (err) {
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
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
    </div>
  );
};

export default UploadResume;
