import React from 'react'
import Navbar from './Navbar'
import {Link} from 'react-router-dom'
import VantaHome from '../Vantahome';

// import { useNavigate } from "react-router-dom";

export default function EnglishLearning() {
  // const navigate = useNavigate();
  return (
    <><VantaHome>
         <div>
            <Navbar/>
         </div >
         <h3 className="text-4xl font-bold text-center mb-10 text-dark"> Check Your Level?</h3>
         <div className="row justify-content-center  rounded-4 border p-4  w-20">
    <div className="col-md-2 mb-1">
      <Link
        to="/checking"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title">Check Your Level</h5>
            
          </div>
        </div>
      </Link>
    </div></div>
       <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-10">
         
        <h1 className="text-4xl font-bold text-center mb-10 text-dark"> Choose Your Level?</h1>
        <div className="container my-5">
  <div className="row justify-content-center shadow-lg rounded-4 border p-4 bg-white">
    <div className="col-md-4 mb-4">
      <Link
        to="/Beginner"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title">Beginner</h5>
            
          </div>
        </div>
      </Link>
    </div>
    <div className="col-md-4 mb-4">
      <Link
        to="/Intermediate"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title">InterMediate</h5>
           
          </div>
        </div>
      </Link>
    </div>
    <div className="col-md-4 mb-4">
      <Link
        to="/Expert"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title"> Expert</h5>
           
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
