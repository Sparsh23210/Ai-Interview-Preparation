import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import VantaBackgroundWrapper from "../VantaBackgroundWrapper";
import { useNavigate } from "react-router-dom";
import downImg from "../down.png";
import questiondata from "../interview_questions.json";

const Dbms = () => {
  const [questionsList, setQuestionsList] = useState([]);
  const [answers, setAnswers] = useState({});
  const [visibleAnswers, setVisibleAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const generateQuestionsmore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/question/dbms`
      );
      setQuestionsList((prev) => {
        const updated = [...prev, ...(response.data.question || [])];
        localStorage.setItem("db_questions", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to generate more questions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedQuestions = localStorage.getItem("db_questions");
    if (savedQuestions) {
      setQuestionsList(JSON.parse(savedQuestions));
    } else {
      setQuestionsList(questiondata["Databases"] || []);
    }

    const savedAnswers = localStorage.getItem("db_answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const toggleAnswerVisibility = (question) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  const fetchAnswer = async (question) => {
    if (answers[question]) {
      toggleAnswerVisibility(question);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/subject/answer`,
        {
          text: question,
        }
      );
      setAnswers((prev) => {
        const updated = { ...prev, [question]: response.data.answer };
        localStorage.setItem("db_answers", JSON.stringify(updated));
        return updated;
      });
      setVisibleAnswers((prev) => ({
        ...prev,
        [question]: true,
      }));
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
          zIndex: 9999,
          backgroundColor: "white",
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
          <div
            className="card shadow rounded mx-auto"
            style={{ width: "1100px", height: "1100px" }}
          >
            <div
              className="card-body"
              style={{ maxWidth: "1100px", overflowY: "auto" }}
            >
              <h3 className="my-4 text-center">
                DataBase Related Interview Questions
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
                      >
                        {answers[q]
                          ? visibleAnswers[q]
                            ? "Hide Answer"
                            : "Show Answer"
                          : "Get Answer"}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          navigate("/Answer", {
                            state: { question: q },
                          })
                        }
                      >
                        Practice
                      </button>
                    </div>
                  </div>
                  {answers[q] && visibleAnswers[q] && (
                    <div className="alert alert-info mt-2 mb-0">
                      <strong>AI Answer:</strong> {answers[q]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              className="btn btn-success mt-2"
              style={{ width: "100%" }}
              onClick={generateQuestionsmore}
            >
              {loading ? "Wait..." : (
                <>
                  More{" "}
                  <img
                    src={downImg}
                    alt="down arrow"
                    style={{ width: "20px", height: "20px" }}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </VantaBackgroundWrapper>
    </>
  );
};

export default Dbms;
