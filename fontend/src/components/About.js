import React from 'react';
import Navbar from './Navbar';
import { FcAssistant, FcVoicePresentation, FcTimeline, FcSurvey, FcReading } from 'react-icons/fc';
import { FaReact, FaNodeJs, FaBootstrap } from 'react-icons/fa';
import { SiExpress, SiOpenai } from 'react-icons/si';
import myimage from "../myimage.jpg";
export default function About() {
  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ marginTop: "30px", marginBottom: "50px" }}>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">About PreBoost</h1>
          <p className="lead">Revolutionizing Interview Preparation with AI and Advanced Analytics</p>
        </div>

        <div className="card shadow-lg rounded-4 border-0 overflow-hidden mb-5">
          <div className="card-body p-5">
            <h2 className="fw-bold mb-4 text-primary">Our Mission</h2>
            <p className="fs-5">
              PreBoost is an innovative web-based platform designed to empower engineering students with cutting-edge interview preparation tools. 
              We combine AI-generated questions, real-time speech analysis, and eye-tracking technology to create the most realistic and effective 
              interview simulation experience.
            </p>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm rounded-4 border-0">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4 text-primary">Key Features</h3>
                
                <div className="d-flex mb-3">
                  <div className="me-3">
                    <FcAssistant size={30} />
                  </div>
                  <div>
                    <h5 className="fw-bold">AI-Driven Questions</h5>
                    <p>Dynamic technical questions tailored to your education, location, and resume</p>
                  </div>
                </div>

                <div className="d-flex mb-3">
                  <div className="me-3">
                    <FcVoicePresentation size={30} />
                  </div>
                  <div>
                    <h5 className="fw-bold">Smart Speech Analysis</h5>
                    <p>Real-time transcription with WPM & fluency feedback</p>
                  </div>
                </div>

                <div className="d-flex mb-3">
                  <div className="me-3">
                    <FcTimeline size={30} />
                  </div>
                  <div>
                    <h5 className="fw-bold">Eye Tracking</h5>
                    <p>WebGazer.js monitors your focus during responses</p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="me-3">
                    <FcSurvey size={30} />
                  </div>
                  <div>
                    <h5 className="fw-bold">Resume-Based Practice</h5>
                    <p>Upload your resume for personalized question generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 shadow-sm rounded-4 border-0">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4 text-primary">Technology Stack</h3>
                
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <FaReact size={30} className="text-primary mb-2" />
                      <h6>React.js</h6>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <FaBootstrap size={30} className="text-primary mb-2" />
                      <h6>Bootstrap 5</h6>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <FaNodeJs size={30} className="text-success mb-2" />
                      <h6>Node.js</h6>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <SiExpress size={30} className="mb-2" />
                      <h6>Express</h6>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <SiOpenai size={30} className="mb-2" />
                      <h6>OpenAI API</h6>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <FcReading size={30} className="mb-2" />
                      <h6>Camera Setup</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-body p-5">
            <h2 className="fw-bold mb-4 text-primary">Who Can Benefit?</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-4 bg-primary bg-opacity-10 rounded-3 h-100">
                  <h4 className="fw-bold">Engineering Students</h4>
                  <p>
                    Prepare for campus placements, GATE/UPSC technical rounds, and job interviews with 
                    realistic simulations and personalized feedback.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-4 bg-primary bg-opacity-10 rounded-3 h-100">
                  <h4 className="fw-bold">Educational Institutions</h4>
                  <p>
                    Provide your students with cutting-edge interview preparation tools and 
                    track their progress with detailed analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}