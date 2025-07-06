// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Engineeringsuggest from "./components/Engineeringsuggest";
import EnglishLearning from "./components/EnglishLearning";
import UPSCSection from "./components/UPSCSection";
import Home from "./components/Home";
import "./App.css";
import Checking  from "./components/Checking";
import Beginner  from "./components/Beginner";
import Intermediate  from "./components/Intermediate";
import Expert  from "./components/Expert";
import About from "./components/About";
import Login from "./components/Login";


function App() {
  return (
    <Router>
     
     
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/checking" element={<Checking/>}/>
          <Route path="/Beginner" element={<Beginner/>}/>
          <Route path="/Intermediate" element={<Intermediate/>}/>
          <Route path="/Expert" element={<Expert/>}/>
          <Route path="/engineering" element={<Engineeringsuggest />} />
          <Route path="/english" element={<EnglishLearning />} />
          <Route path="/upsc" element={<UPSCSection />} />
          <Route path="/About" element={<About />} />

        </Routes>
      
    </Router>
  );
}

export default App;
