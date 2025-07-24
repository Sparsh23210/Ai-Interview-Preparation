import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Gauge from "./Gauge";
import { useLocation ,useNavigate} from "react-router-dom";
import VantaBackgroundWrapper from "../VantaBackgroundWrapper";
import Navbar from "./Navbar";
import circle from "../circle.gif";

const Question= () => {
  const navigate=useNavigate();
  const location = useLocation();
  const { question, resumeFile } = location.state || {};
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef(null);
  const [load,setLoad]=useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
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
  } = useSpeechRecognition();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        const audioURL = URL.createObjectURL(blob);
        if (audioRef.current) audioRef.current.src = audioURL;
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing mic:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const fetchAnswer = async () => {
    setAns(true);
    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("resume", resumeFile);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/engineering/answer`, 
        formData  ,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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
    if(!question){
      alert("No question selected")
    }
    const result = await fetchAnswer(question);
    setAnswer(result);
    setIsAnswered(true);
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

      let feedback = "";
      if (calculatedWPM >= 90) feedback = "Excellent fluency!";
      else if (calculatedWPM >= 80) feedback = "Very good fluency!";
      else if (calculatedWPM >= 70) feedback = "Good fluency!";
      else if (calculatedWPM >= 60) feedback = "Good, but can improve.";
      else if (calculatedWPM < 60) feedback = "Need Improvement";
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
      console.log("Voice command 'stop' detected. Stopping...");
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
        <div className="container-fluid py-5 px-4" style={{ marginTop: "20px", marginBottom: "20px" ,width:"1100px"}}>
          <VantaBackgroundWrapper> 
            <div className="card shadow-lg rounded-3 "style={{ marginTop: "50px", marginBottom: "20px" }}>
              <div className="card-body">
                {showCamera ? (
                  <div className="mb-4 ">
                    <h4 className="h6 fw-bold">Camera (Live)</h4>
                    <video ref={videoRef} autoPlay playsInline className="w-100 rounded border" style={{ maxHeight: "220px" }} />
                    <button
                      className="btn btn-danger "
                      style={{borderRadius:"20px"}}
                      onClick={closeCamera}
                    >
                      Close Camera
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-danger"
                    style={{borderRadius:"20px"}}
                    onClick={openCamera}
                  >
                    Open Camera
                  </button>
                )}

                <div className="mt-5 p-3 bg-light rounded border">
                  <h3 className="h4 fw-bold mb-2"> Question:</h3>
                  <h2>{question}</h2>
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
                    <div><p className="text-secondary mb-2">{transcript || "Your speech will appear here..."}</p></div>

                    <div className="d-flex gap-3 mb-3">
                      <div className="d-flex  justifyContent-space-between " >
                        <button type="button" onClick={startListening} className="btn btn-success hover-effect" style={{borderRadius:"20px"}} >
                          Start Talking
                        </button>
                        <button type="button" onClick={stopListening} className="btn btn-danger" style={{ marginLeft: '10px',borderRadius:"20px" }} >
                          Stop
                        </button>
                        <button type="button" onClick={resetanalysis} className="btn btn-secondary" style={{ marginLeft: '10px',borderRadius:"20px" }} >
                          Reset
                        </button>
                      </div>
                      <button onClick={analyzeTranscript} className="btn btn-primary" disabled={load}>
                        {!load ? "Check Analysis" : (<img src={circle} alt="Loading" style={{ width: "20px", height: "20px" }} />)}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5>Record your voice for Self-Evaluation</h5>
                    <div className="mb-2">
                      <button
                        className="btn btn-outline-success me-2"style={{borderRadius:"20px" }}
                        onClick={startRecording}
                        disabled={isRecording}
                      >
                        Start Recording
                      </button>
                      <button
                        className="btn btn-outline-danger"style={{ borderRadius:"20px" }}
                        onClick={stopRecording}
                        disabled={!isRecording}
                      >
                        Stop Recording
                      </button>
                    </div>
                    {recordedBlob && (
                      <>
                        <audio ref={audioRef} controls className="mb-3" />
                      </>
                    )}
                  </div>

                  {analysis && (<div>
                    <h3 className="h6 fw-bold mb-2">Answer Analysis</h3>
                    <div className="d-flex flex-row gap-2">
                      <div className="mt-4 p-3 bg-warning bg-opacity-25 rounded">
                        <p>Fluency Feedback: {fluencyFeedback}</p>
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
                    </div></div>
                  )}
                </div>
              </div>
            </div>
          </VantaBackgroundWrapper> 
        </div>
      </VantaBackgroundWrapper>
    </>
  );
};

export default Question;