import React from 'react'
import Navbar from './Navbar'
import {Link, useNavigate} from 'react-router-dom'
import VantaHome from '../Vantahome';
export default function SubjectSpecific() {
  const navigate=useNavigate();
  return (
    <><VantaHome>
         <div>
            <Navbar/>
         </div >
         <button
  onClick={() => navigate(-1)}
  style={{
    position: "fixed",
    top: "65px",
    left: "20px",
    zIndex: 9999,
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
       <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-dark">🎓 Student AI Interview Preparation</h1>
        <div className="container my-5">
  <div className="row justify-content-center shadow-lg rounded-4 border p-4 bg-white">
    <div className="col-md-4 mb-4">
      <Link
        to="/dsa"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title"> Data Structures & Algorithms</h5>
            <p className="card-text">AI Technical Dsa Interview</p>
          </div>
        </div>
      </Link>
    </div>
    <div className="col-md-4 mb-4">
      <Link
        to="/dbms"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title"> Database Management System</h5>
            <p className="card-text">Database include SQL+ RDBMS  interview</p>
          </div>
        </div>
      </Link>
    </div>
    <div className="col-md-4 mb-4">
      <Link
        to="/os"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title">Operating System</h5>
            <p className="card-text">Boost your System information</p>
          </div>
        </div>
      </Link>
    </div>
     <div className="col-md-4 mb-4">
      <Link
        to="/sd"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title"> System Design</h5>
            <p className="card-text"></p>
          </div>
        </div>
      </Link>
    </div>
     <div className="col-md-4 mb-4">
      <Link
        to="/cn"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title">Computer Networks</h5>
            <p className="card-text">Be prepared with Computer Network</p>
          </div>
        </div>
      </Link>
    </div>
     <div className="col-md-4 mb-4">
      <Link
        to="/ai"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title">Artificial Intelligence</h5>
            <p className="card-text">Get Interviewed with Artificial Intelligence</p>
          </div>
        </div>
      </Link>
    </div>
     <div className="col-md-4 mb-4">
      <Link
        to="/devops"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title">Cloud/DevOps for AI</h5>
           
          </div>
        </div>
      </Link>
    </div>
  </div>
</div>

    </div></VantaHome>
    </>
  )
}
