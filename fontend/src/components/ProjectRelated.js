import React, { useState ,useEffect} from "react";
import axios from "axios";
import Navbar from "./Navbar";
import VantaBackgroundWrapper from "../VantaBackgroundWrapper";
import { useNavigate,useLocation } from "react-router-dom";
import downImg from "../down.png";

const ProjectRelated = () => {
    const { state } = useLocation();
  const navigate = useNavigate();
 
  const [questionsList, setQuestionsList] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
 const [resumeFile, setResumeFile] = useState(null);

   useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions"));
    const storedResumeFile = localStorage.getItem("resumeFile");

    if (storedQuestions) setQuestionsList(storedQuestions);
    if (storedResumeFile) setResumeFile(storedResumeFile);
  }, []);

  
const generateQuestionsmore = async () => {
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("resume", resumeFile);

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/engineering`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        
        setQuestionsList((prev) => [
            ...prev,
            ...(response.data.question || [])
        ]);
    } catch (err) {
        console.error("Failed to generate more questions", err);
    } finally {
        setLoading(false);
    }
};

  const fetchAnswer = async (question) => {
    if (answers[question]) return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/engineering/answer`,
        {
          question,
          resume: resumeFile, 
        }
      );
      setAnswers((prev) => ({ ...prev, [question]: response.data.answer }));
    } catch (error) {
      console.error("Answer fetch failed", error);
    }
  };

  return (
    <>
      <Navbar />
      <button
  onClick={() => navigate(-1)}
  style={{
    position: "fixed",
    top: "65px",
    left: "20px",
    zIndex: 990,
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
      <VantaBackgroundWrapper>
        <div className="container-fluid py-5 px-4">
             
         
             
              <div className="card shadow rounded mx-auto" style={{ width: "1100px",height:"1100px" }}>
                 <div className="card-body " style={{ maxWidth: "1100px",overflowY: "auto" }}>
                  <h3 className="my-4 text-center">
                    Projects Related Questions
                  </h3>
                  {questionsList.map((q, idx) => (
                    <div
                      key={idx}
                      className="list-group-item mb-2 border rounded shadow mx-auto p-3 px-4"
                    >
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h5 className="mb-2">Q{idx + 1}: {q}</h5>
                        
                        <div className="d-flex gap-3">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => fetchAnswer(q)}
                            disabled={!!answers[q]}
                          >
                            {answers[q] ? "Answer Fetched" : "Get Answer"}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                                
                              navigate("/Question", {
                                state: { question: q, resumeFile },
                              })
                            }
                          >
                            Practice
                          </button>
                        </div>
                      </div>
                      {answers[q] && (
                        <div className="alert alert-info mt-2 mb-0">
                          <strong>AI Answer:</strong> {answers[q]}
                        </div>
                      )}
                    </div>
                  ))}
                
              </div>
              <button className="btn btn-success mt-2" style={{width:"100%"}}
                onClick={generateQuestionsmore}>
                More <img src={downImg} alt="down arrow" style={{width:"20px",height:"20px"}} />
              </button>
              </div>
            </div>
          
           
        
      </VantaBackgroundWrapper>
    </>
  );
};

export default ProjectRelated;
