import React from 'react'
import Navbar from './Navbar'
import {Link} from 'react-router-dom'
import VantaHome from '../Vantahome';
export default function Home() {
  
  return (
    <><VantaHome>
         <div>
            <Navbar/>
         </div >
       <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-dark">🎓 Student AI Interview Preparation</h1>
        <div className="container my-5">
  <div className="row justify-content-center shadow-lg rounded-4 border p-4 bg-white">
    <div className="col-md-4 mb-4">
      <Link
        to="/engineering"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title"> Engineering</h5>
            <p className="card-text">AI Interview Questions + Voice Analysis</p>
          </div>
        </div>
      </Link>
    </div>
    <div className="col-md-4 mb-4">
      <Link
        to="/english"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title"> English Learning</h5>
            <p className="card-text">Practice Basic English with AI</p>
          </div>
        </div>
      </Link>
    </div>
    <div className="col-md-4 mb-4">
      <Link
        to="/upsc"
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm rounded-3 hover-shadow">
          <div className="card-body text-center">
            <h5 className="card-title"> UPSC Section</h5>
            <p className="card-text">Essay, MCQs and Practice Questions</p>
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
