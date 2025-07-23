import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Engineeringsuggest from "./components/Engineeringsuggest";
import EnglishLearning from "./components/EnglishLearning";
import UPSCSection from "./components/UPSCSection";
import Home from "./components/Home";

import Checking  from "./components/Checking";
import Beginner  from "./components/Beginner";
import Intermediate  from "./components/Intermediate";
import Expert  from "./components/Expert";
import About from "./components/About";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Practicedaily from "./components/Practisedaily";
import ProjectRelated from "./components/ProjectRelated";
import SubjectSpecific from "./components/SubjectSpecific";
import Question from "./components/Question";
import UploadResume from "./components/Resumeupload";
import Ai from "./components/Artificial";
import Cn from "./components/Cn";
import Dbms from "./components/Dbms";
import Os from "./components/Os";
import Sd from "./components/SystemDesign";
import Oops from "./components/Oops";
import Dsa from "./components/Dsa";
import Devops from "./components/Devops";
import Common from "./components/Common";
import Answer from "./components/Answer";



function App() {
  return (
    <Router>
     
     
        <Routes>
          <Route path="/" element={<Login/>} />
           <Route path="/Dashboard" element={<Dashboard/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/checking" element={<Checking/>}/>
          <Route path="/Practice" element={<Practicedaily/>}/>
          <Route path="/Beginner" element={<Beginner/>}/>
          <Route path="/Intermediate" element={<Intermediate/>}/>
          <Route path="/Expert" element={<Expert/>}/>
          <Route path="/engineering" element={<Engineeringsuggest />} />
          <Route path="/english" element={<EnglishLearning />} />
          <Route path="/upsc" element={<UPSCSection />} />
          <Route path="/About" element={<About />} />
           <Route path="/projects" element={<ProjectRelated />} />
           <Route path="/Subject" element={<SubjectSpecific/>} />
           <Route path="/Question" element={<Question/>} />
           <Route path="/Upload" element={<UploadResume/>} />
            <Route path="/ai" element={<Ai/>} /> 
            <Route path="/cn" element={<Cn/>} /> 
            <Route path="/dbms" element={<Dbms/>} /> 
            <Route path="/os" element={<Os/>} /> 
            <Route path="/sd" element={<Sd/>} /> 
            <Route path="/oops" element={<Oops/>} /> 
             <Route path="/dsa" element={<Dsa/>} /> 
              <Route path="/devops" element={<Devops/>} /> 
        <Route path="/common" element={<Common/>} /> 
        <Route path="/Answer" element={<Answer/>} /> 
        
        </Routes>
      
    </Router>
  );
}

export default App;
