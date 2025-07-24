import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Gauge from "./Gauge";
import FormChecking  from "../FormChecking";
import VantaBackgroundWrapper from "../VantaBackgroundWrapper";
import circle from "../circle.gif";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Checking= () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    education: "",
  });
  let silenceTimer = useRef(null);
  const [load, setLoad] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionHistory, setQuestionHistory] = useState([]);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answer,setAnswer]=useState("");
  const [isAnswered,setIsAnswered]=useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fluencyFeedback, setFluencyFeedback] = useState("");
const [ans,setAns]=useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const resetSilenceTimer = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      stopListening();
    }, 4000); 
  };

  useEffect(() => {
    if (listening) {
      resetSilenceTimer();
    }
  }, [transcript]);

  const fetchUniqueQuestion = async (formData) => {
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/question/check`, formData);
      const newQuestion = response.data.question;
      if (!questionHistory.includes(newQuestion)) {
        setQuestionHistory((prev) => [...prev, newQuestion]);
        return newQuestion;
      }
    }
    return;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreviousQuestion = () => {
    if (questionNumber > 1) {
      const prevIndex = questionNumber - 2;
      const prevQuestion = questionHistory[prevIndex];
      setQuestionNumber(prevIndex + 1); 
      setAiQuestion(prevQuestion);
      resetTranscript();
      setAnalysis(null);
      setAnswer("");
      setIsAnswered(false);
    }
  };

  const fetchAnswer = async (question) => {
    setAns(true);
    try {
      
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/answer/check`, { text: question });
      const newAnswer = response.data.answer;
      setAns(false);
      return newAnswer;
    } catch (error) {
      console.error("Error fetching AI answer:", error);
      return "Unable to generate answer. Please try again later.";
    }
    finally{
      setAns(false);
    }
  };

  const provideanswer=async()=>{
    const result=await fetchAnswer(aiQuestion);
    setAnswer(result);
    setIsAnswered(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const question = await fetchUniqueQuestion(formData);
      setAiQuestion(question);
      resetTranscript();
      setAnalysis(null);
      setShowCamera(true);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending data to GPT API:", error);
    }
    setLoading(false);
  };

  
  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Error stopping camera track:", e);
        }
      });
      videoRef.current.srcObject = null;
    }
    try {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    } catch (e) {
      console.error("Error cleaning up video element:", e);
    }
    setShowCamera(false);
  };

  const startListening = () => {
    resetTranscript();
    setStartTime(Date.now()); 
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    const end = Date.now();
    setEndTime(end);
    if (startTime) {
      const duration = (end - startTime) / 1000;
      const words = transcript.trim().split(/\s+/).filter(Boolean).length;
      const calculatedWPM = (words / (duration / 60));
      setDuration(duration);
      setWpm(calculatedWPM.toFixed(2));

      let feedback = "Error Generating Accuracy";
      if (calculatedWPM > 140) {
        feedback = "Expert : Excellent fluency and confidence!";
      } else if (calculatedWPM > 110) {
        feedback = "Advanced/expert: Very fluent and natural speech.";
      } else if (calculatedWPM >= 80) {
        feedback = "Intermediate : Good, but can improve pace and fluency.";
      } else {
        feedback = "Beginner:Try to speak more fluently and confidently.";
      }
      setFluencyFeedback(feedback);
    }
  };

  const analyzeTranscript = async () => {
    try {
      setLoad(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/analyze-answer`,
        { text: transcript }
      );
      setAnalysis(response.data);
    } catch (error) {
      alert("Error Analyzing Grammar");
      console.error("Error analyzing transcript:", error);
    } finally {
      setLoad(false);
    }
  };

  const handleNextQuestion = async () => {
    setLoading(true);
    try {
      const question = await fetchUniqueQuestion(formData);
      setAiQuestion(question);
      resetTranscript();
      setAnalysis(null);
      setQuestionNumber((prev) => prev + 1);
      setAnswer("");
      setIsAnswered(false);
    } catch (error) {
      console.error("Error generating next question:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      closeCamera();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      closeCamera();
    };
  }, []);

  useEffect(() => {
    if (showCamera) {
      const start = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access denied or not available", err);
        }
      };
      start();
    }
  }, [showCamera]);

  useEffect(() => {
    if (transcript.toLowerCase().includes("stop")) {
      stopListening();
    }
  }, [transcript]);

  const resetanalysis=()=>{
    if (SpeechRecognition && typeof SpeechRecognition.stopListening === "function") {
      SpeechRecognition.stopListening();
    }
    setAnalysis(null);
    setFluencyFeedback("");
    setWpm(0);
    setDuration(0);
    setIsAnswered(false);
    setAnswer("");
    setStartTime(null);
    setEndTime(null); 
    resetTranscript();
  };

  

  return (
    <>
      <Navbar/>
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
        <div className="container py-5" style={{ marginTop: "20px", marginBottom: "20px" }}>
          <VantaBackgroundWrapper> 
            <div className="card shadow-lg rounded-3 "style={{ marginTop: "50px", marginBottom: "20px" }}>
              <div className="card-body">
                {isSubmitted && (
                  showCamera ? (
                    <div className="mb-4 ">
                      <h4 className="h6 fw-bold">Camera (Live)</h4>
                      <video ref={videoRef} autoPlay playsInline className="w-100 rounded border" style={{ maxHeight: "220px" }} />
                      <button
                        className="btn btn-danger"style={{borderRadius:"20px"}}
                        onClick={closeCamera}
                      >
                        Close Camera
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-danger"style={{borderRadius:"20px"}}
                      onClick={openCamera}
                    >
                      Open Camera
                    </button>
                  )
                )}

                {!isSubmitted && (
                  <FormChecking
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                  />
                )}

                {aiQuestion && (
                  <div className="mt-5 p-3 bg-light rounded border">
                    <h4 className="h4 fw-bold mb-2"> Question {questionNumber}:</h4>
                    <h2>{aiQuestion}</h2>
                    {!isAnswered && (
                      <button onClick={provideanswer} className="btn btn-secondary mb-3"style={{borderRadius:"20px"}}>
                       {!ans ? "Check Answer" : (<img src={circle} alt="Loading" style={{ width: "20px", height: "20px" }} />)}
                        </button>
                      
                    )}
                    {isAnswered && (
                      <div className="alert alert-info mt-2">
                        <strong>AI Answer:</strong> {answer}
                      </div>
                    )}

                    <div className="mt-3">
                      <h3 className="h4 fw-bold"> Your Answer (Voice Input)</h3>
                      <div className="text-secondary mb-2">
                        <strong>Live Transcript:</strong> {transcript || "Your speech will appear here..."}
                      </div>

                      <div className="d-flex gap-3 mb-3">
                        <div className="d-flex  justifyContent-space-between " >
                          <button type="button" onClick={startListening} className="btn btn-success hover-effect"style={{borderRadius:"20px"}}  >
                            Start Talking
                          </button>
                          <button type="button" onClick={stopListening} className="btn btn-danger" style={{ marginLeft: '10px',borderRadius:"20px" }} >
                            Stop
                          </button>
                          <button type="button" onClick={resetanalysis} className="btn btn-secondary" style={{ marginLeft: '10px',borderRadius:"20px" }} >
                            Reset
                          </button>
                        </div>
                        <button onClick={analyzeTranscript} className="btn btn-primary" disabled={load}style={{borderRadius:"20px"}}>
                          {!load ? "Check Analysis" : (<img src={circle} alt="Loading" style={{ width: "20px", height: "20px" }} />)}
                        </button>
                      </div>
                    </div>
                    
                    {analysis && (
                      <div>
                        <h4 className="h6 fw-bold mb-2">Answer Analysis</h4>
                        <div className="d-flex flex-row gap-2">
                          <div className="mt-4 p-3 bg-warning bg-opacity-25 rounded">
                            <p>Fluency Feedback: {fluencyFeedback}</p>
                            <p>Words per Minute:</p>
                            <div>
                              <Gauge value={wpm}/>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-warning bg-opacity-25 rounded">
                            <p>Grammar Accuracy: {analysis.grammar?Number(analysis.grammar):"Error Generating"}</p>
                            {!isNaN(Number(analysis.grammar)) ? (
                              <>
                                <Gauge value={Number(analysis.grammar)} />
                              </>
                            ) : (
                              <p className="text-danger">Invalid grammar score received.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mt-">
                      <button
                        onClick={handlePreviousQuestion}
                        className="btn btn-outline-primary"style={{borderRadius:"20px"}}
                        disabled={questionNumber <= 1}
                      >
                        Previous Question
                      </button>
                      <button onClick={handleNextQuestion} className="btn btn-info mt-2"style={{borderRadius:"20px"}}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Generating...
                          </>
                        ) : (
                          "Next Question"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </VantaBackgroundWrapper> 
        </div>
      </VantaBackgroundWrapper>
    </>
  );
};

export default Checking;