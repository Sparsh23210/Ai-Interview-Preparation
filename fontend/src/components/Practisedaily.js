import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Gauge from "./Gauge";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import dayjs from "dayjs";
import VantaBackgroundWrapper from "../VantaBackgroundWrapper";
import trophyGif from '../Trophy.gif';
import Navbar from "./Navbar";
import circle from "../circle.gif";
import { useNavigate } from "react-router-dom";
const Practicedaily= () => {
  const [isanalysed,setIsanalysed]=useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showStreakAnimation,setShowStreakAnimation]=useState(false);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef(null);
  const [aiQuestion, setAiQuestion] = useState("");
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
const[ans,setAns]=useState(false);
const navigate=useNavigate();
  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try{
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/learn`);
      const question = response.data.question;
      setAiQuestion(question);
    }
    catch(err){
      console.log("Unable to generate a unique question. Please try again later.");
    }
    setLoading(false);
  };

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

  const fetchAnswer = async (question) => {
    setAns(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/learn/answer`, { text: question });
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

  const startListening = () => {
    resetTranscript();
    setStartTime(Date.now());
    setCountdown(60); 
    SpeechRecognition.startListening({ continuous: true });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      stopListening();
      clearInterval(intervalRef.current);
    }, 30000);
  };

  const stopListening = async() => {
    SpeechRecognition.stopListening();
    const end = Date.now();
    setEndTime(end);
    setCountdown(0); 
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);

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
      if (calculatedWPM > 1) {
        
         await analyzeTranscript(transcript, calculatedWPM);
      }
     
    }
  };

  const analyzeTranscript = async (text, wpm) => {
    setIsanalysed(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/analyze-answer`, { text });
      const analysisResult = response.data;
      setAnalysis(analysisResult);
      setIsanalysed(false);
      if (wpm > 1 && analysisResult!==undefined) {
        await updateDailyPerformance(Number(analysisResult.grammar), wpm);
      }
    } catch (error) {
      alert("Error Analying Grammer");
      console.error("Error analyzing transcript:", error);
    }
    finally{
      setIsanalysed(false);
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

  const updateDailyPerformance = async (grammar, wpm) => {
    const user = auth.currentUser;
    if (!user) return;

    if (wpm <= 1) {
      return;
    }
    const today = dayjs().format("YYYY-MM-DD");
    const perfRef = doc(db, "users", user.uid, "performance", today);
    const streakRef = doc(db, "users", user.uid);
    try{
      const existingDoc = await getDoc(perfRef);
      if (existingDoc.exists()) {
        const data = existingDoc.data();
        await setDoc(perfRef, {
          wpm: Math.max(wpm, data.wpm), 
          grammar: grammar !== null ? Math.max(grammar, data.grammar|| 0) : (data.grammar || 0),
          attempts: (data.attempts || 0) + 1,
          timestamp: new Date()
        }, { merge: true });
      } else {
        await setDoc(perfRef, {
          wpm,
          grammar,
          attempts: 1,
          timestamp: new Date()
        });
      }
    } catch (e) {
      return;
    }

    try {
      const streakSnap = await getDoc(streakRef);
      const todayDate = dayjs();
      let currentStreak = 1;

      if (!streakSnap.exists()) {
        await setDoc(
          streakRef,
          {
            streak: {
              currentStreak: 1,
              lastPracticed: today,
            },
          },
          { merge: true }
        );
        window.dispatchEvent(new Event("streak-updated"));
        setShowStreakAnimation(true);
        setTimeout(() => setShowStreakAnimation(false), 4000);
        return;
      }

      const streakData = streakSnap.data().streak || {};
      const lastDate = dayjs(streakData.lastPracticed);

      if (!lastDate.isValid()) {
        await setDoc(
          streakRef,
          {
            streak: {
              currentStreak: 1,
              lastPracticed: today,
            },
          },
          { merge: true }
        );
        window.dispatchEvent(new Event("streak-updated"));
        setShowStreakAnimation(true);
        setTimeout(() => setShowStreakAnimation(false), 4000);
        return;
      }

      const diff = todayDate.diff(lastDate, "day");

      if (diff === 1) {
        currentStreak = (streakData.currentStreak || 0) + 1;
      } else if (diff > 1) {
        currentStreak = 1; 
      } else if (diff === 0) {
        if (!streakData.currentStreak || !streakData.lastPracticed) {
          await setDoc(
            streakRef,
            {
              streak: {
                currentStreak: 1,
                lastPracticed: today,
              },
            },
            { merge: true }
          );
          window.dispatchEvent(new Event("streak-updated"));
          setShowStreakAnimation(true);
          setTimeout(() => setShowStreakAnimation(false), 4000);
        }
        return;
      }

      await setDoc(
        streakRef,
        {
          streak: {
            currentStreak,
            lastPracticed: today,
          },
        },
        { merge: true }
      );
      window.dispatchEvent(new Event("streak-updated"));
      setShowStreakAnimation(true);
      setTimeout(() => setShowStreakAnimation(false), 4000);
    } catch (error) {}
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
        <div className="d-flex flex-row ">
          <div className="container py-5" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <VantaBackgroundWrapper>
              {!showStreakAnimation && (
                 
                
                <div className="d-flex flex-row flex-wrap justify-content-between align-items-start gap-4">
                  <div className="card shadow-lg rounded-20  "style={{ marginTop: "50px", marginBottom: "20px" }}>
                    <div className="card-body">
                      {showCamera ? (
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
                      )}
                      <button className="btn btn-success" onClick={fetchQuestions}style={{borderRadius:"20px"}}>
                        {loading
                          ? "Generating..."
                          : aiQuestion
                          ? "Refresh"
                          : "Click To Generate"}
                      </button>
                      {aiQuestion && (
                        <div className="mt-5 p-3 bg-light rounded border">
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
                            <div><p className="text-secondary mb-2">{transcript || "Speak for 60 seconds..."}</p></div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex gap-3 mb-3">
                              <div className="d-flex  justifyContent-space-between " >
                                <button type="button" onClick={startListening} className="btn btn-success hover-effect"style={{borderRadius:"20px"}}  >
                                  Start Talking
                                </button>
                              </div>
                           
                          
                          <div className="mt-4">
                            <h5>Record your voice for Self-Evaluation</h5>
                            <div className="mb-2">
                              <button
                                className="btn btn-outline-success me-2"style={{borderRadius:"20px"}}
                                onClick={startRecording}
                                disabled={isRecording}
                              >
                                Start Recording
                              </button>
                              <button
                                className="btn btn-outline-danger"style={{borderRadius:"20px"}}
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
                          </div> </div>
                           <div >
                      {listening && (
                        <div className="text-center">
                          <svg width="120" height="120">
                            <circle
                              cx="60"
                              cy="60"
                              r="54"
                              stroke="#e0e0e0"
                              fill="none"
                              strokeWidth="10"
                            />
                            <circle
                              cx="60"
                              cy="60"
                              r="54"
                              stroke="#007bff"
                              fill="none"
                              strokeWidth="10"
                              strokeDasharray={339.292}
                              strokeDashoffset={(countdown / 30) * 339.292}
                              transform="rotate(-90 60 60)"
                              style={{ transition: "stroke-dashoffset 1s linear" }}
                            />
                            <text x="60" y="65" textAnchor="middle" fontSize="20" fill="#000">
                              {countdown}s
                            </text>
                          </svg>
                          <div>
                            <small className="text-muted">Auto-stop after 60 seconds</small>
                          </div>
                        </div>
                      )}</div>
                        </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-row flex-wrap justify-content-between align-items-start gap-1">
                    <div className="card shadow-lg rounded-20  "style={{ marginTop: "50px", marginBottom: "20px" }}>
                     
                      {isanalysed&&(<div className="d-flex justify-content-center align-items-center"><h3>Analysing</h3><img src={circle} alt="Loading" style={{ width: "70px", height: "70px" }} /></div>)}
                      {analysis && (
                        <div>
                          <h3 className="h6 fw-bold mb-2 text-center">Answer Analysis</h3>
                          <div className="d-flex flex-column gap-2">
                            <div className="mt-4 p-3 bg-warning bg-opacity-25 rounded">
                              <p>Fluency Feedback: {fluencyFeedback}</p>
                              <div>
                                <h3>Words Per Minute:</h3>
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
                    </div>
                  </div>
                </div>
              )}
              {showStreakAnimation && (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="my-3 text-center">
                    <img
                      src={trophyGif}
                      alt="Streak Updated"
                      style={{ width: "150px", height: "auto" }}
                    />
                    <p className="text-success fw-bold">🔥 Streak Updated!</p>
                  </div>
                </div>
              )}
            </VantaBackgroundWrapper>
          </div>
        </div>
      </VantaBackgroundWrapper>
    </>
  );
};

export default Practicedaily;