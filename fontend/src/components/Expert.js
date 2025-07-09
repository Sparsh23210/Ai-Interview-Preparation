
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Gauge from "./Gauge";
import FormWithParticles  from "../FormWithParticles";
import VantaBackgroundWrapper from "../VantaBackgroundWrapper";

import Webgazer from "webgazer"
import ScrollToBottom from 'react-scroll-to-bottom'
import Navbar from "./Navbar";
window.webgazer = Webgazer;



const Expert= () => {
  const scrollRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    education: "",
    fatherName: "",
    motherName: "",
    siblings: "",
    resume: null,
  });
let silenceTimer = null;
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

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  
  useEffect(() => {
  if (showCamera || aiQuestion) {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [showCamera, aiQuestion]);


  const fetchUniqueQuestion = async () => {
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/question/expert`);
      const newQuestion = response.data.question;
      if (!questionHistory.includes(newQuestion)) {
        setQuestionHistory((prev) => [...prev, newQuestion]);
        return newQuestion;
      }
    }
    return "Unable to generate a unique question. Please try again later.";
  };
  const fetchAnswer = async (question) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/answer/expert`, { text: question });
      const newAnswer = response.data.answer;
      
      return newAnswer;
    } catch (error) {
      console.error("Error fetching AI answer:", error);
      
      return "Unable to generate answer. Please try again later.";
    }
  };
 const startEyeTracking = () => {
   if (Webgazer && Webgazer.setGazeListener) {
     Webgazer.setGazeListener((data,timestamp) => {
       if (data) {
         console.log("Gaze at:", data.x, data.y);
       }
     }).begin();

     Webgazer
       .showVideo(false)
       .showFaceOverlay(false)
       .showFaceFeedbackBox(false);
   } else {
     console.warn("webgazer is not available.");
   }
 };
 const provideanswer=async()=>{
  const result=await fetchAnswer(aiQuestion);
  setAnswer(result);
  setIsAnswered(true);
  console.log("ai answer",result);
 }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
     
      const question = await fetchUniqueQuestion();
      setAiQuestion(question);
      resetTranscript();
      setAnalysis(null);
      setShowCamera(true);
    startEyeTracking();
    
    
    } catch (error) {
      console.error("Error sending data to GPT API:", error);
    }
    setLoading(false);
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

      let feedback = "Needs improvement";
      if (calculatedWPM >= 90) feedback = "Excellent fluency!";
      else if (calculatedWPM >= 80) feedback = "Very good fluency!";
      else if (calculatedWPM >= 70) feedback = "Good fluency!";
      else if (calculatedWPM >= 60) feedback = "Good, but can improve.";
      setFluencyFeedback(feedback);
    }
  };
  

  const analyzeTranscript = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/analyze-answer`, { text: transcript });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing transcript:", error);
    }
  };

  
const stopCameraAndEyeTracking = () => {
  
  if (window.webgazer && typeof window.webgazer.end === "function") {
    try {
      window.webgazer.end();
      console.log("WebGazer stopped.");
    } catch (e) {
      console.warn("Error stopping WebGazer:", e);
    }
  }

  
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
    console.log("Camera stopped.");
  }

 
  setShowCamera(false);
};

  const handleNextQuestion = async () => {
    setLoading(true);
    try {
      
      const question = await fetchUniqueQuestion();
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
    if (window.webgazer && typeof window.webgazer.end === "function") {
      try {
        window.webgazer.end();
      } catch (e) {
        
        console.warn("webgazer.end() cleanup error:", e);
      }
    }
    setShowCamera(false);
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    if (window.webgazer && typeof window.webgazer.end === "function") {
      try {
        window.webgazer.end();
      } catch (e) {
        console.warn("webgazer.end() cleanup error:", e);
      }
    }
    setShowCamera(false);
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
const resetSilenceTimer = () => {
  if (silenceTimer) clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => {
    stopListening();
    console.log("Auto-stopped due to silence.");
  }, 4000); 
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

useEffect(() => {
  if (listening) {
    resetSilenceTimer();
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


 
}

  
  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <>
    
     <Navbar/>
    <VantaBackgroundWrapper>
    
    <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }}>
       <VantaBackgroundWrapper>
      <div className="card shadow-lg rounded-3 "style={{ marginTop: "100px"}}>
        <div className="card-body">
          

          <h2 className="card-title mb-4">Expert language Improvement</h2>

         
         { showCamera&&(<div className="mb-4 ">
            <h4 className="h6 fw-bold">Eye Tracking Camera (Live)</h4>
            <video ref={videoRef} autoPlay playsInline className="w-100 rounded border" style={{ maxHeight: "220px" }} />
         <button
  className="btn btn-danger"
  onClick={stopCameraAndEyeTracking}
    
    
>
  Close Camera
</button>

  </div>)
//   :( <button
//   className="btn btn-danger"
//   onClick={() => { setShowCamera(true); startEyeTracking(); }}>
//   Open Camera
// </button>))
}

    

          {aiQuestion ?(
            <div className="mt-5 p-3 bg-light rounded border">
              <h4 className="h4 fw-bold mb-2"> Question {questionNumber}:</h4>
              <h2>{aiQuestion}</h2>
              {!isAnswered && (
                <button onClick={provideanswer} className="btn btn-secondary mb-3">
                  Check Answer
                </button>
              )}
              {isAnswered && (
                <div className="alert alert-info mt-2">
                  <strong>AI Answer:</strong> {answer}
                </div>
              )}

              <div className="mt-3">
                <h3 className="h4 fw-bold">Your Answer (Voice Input)</h3>
                <h2 className="text-secondary mb-2">{transcript || "Your speech will appear here..."}</h2>

                <div className="d-flex gap-3 mb-3">
                <div className="d-flex justifyContent-space-between pd-5" >
                  <button type="button" onClick={startListening} className="btn btn-success hover-effect">
                    Start Talking
                  </button>
                  <button type="button" onClick={stopListening} className="btn btn-danger"style={{ marginLeft: '10px' }}>
                    Stop
                  </button>
                  <button type="button" onClick={resetanalysis} className="btn btn-secondary"style={{ marginLeft: '10px' }}>
                    Reset
                  </button>
                </div>
                <button onClick={analyzeTranscript} className="btn btn-primary">Check Analyasis</button>
                </div>
              </div>
              
              {analysis && (<div>
                 <h4 className="h6 fw-bold mb-2"> Answer Analysis</h4>
                <div className="d-flex flex-row gap-2">
                  <div className="mt-4 p-3 bg-warning bg-opacity-25 rounded">
                   
                    <p>Fluency Feedback: {fluencyFeedback}</p>
                    
                    <div>
                      <Gauge value={wpm}/>
                      
                    </div>
                  </div>
                   <div className="mt-4 p-3 bg-warning bg-opacity-25 rounded">
                   
                    
                    <p>Grammar Accuracy: {analysis.grammar}%</p>
                    <div>
                      
                      <Gauge value={analysis.grammar}/>
                    </div>
                  </div>
                </div></div>
              )}
             <div className="d-flex justify-content-between mt-">
                 <button
    onClick={handlePreviousQuestion}
    className="btn btn-outline-primary"
    disabled={questionNumber <= 1}
  >
    Previous Question
  </button>
                    <button onClick={handleNextQuestion} className="btn btn-info mt-2">
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
            
          ):(<div className="d-flex justify-content-center  my-4">
  <button
    onClick={handleSubmit}
    className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow"
    style={{ transition: "0.3s" }}
    onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
  >
    Check&nbsp;&gt;&gt;
  </button>
</div>)}
        </div>
      </div></VantaBackgroundWrapper>
    </div> </VantaBackgroundWrapper></>
  );
};

export default Expert;