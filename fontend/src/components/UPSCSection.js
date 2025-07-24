import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
export default function UPSCSection() {
  const navigate=useNavigate();
  return (<>
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
    <div className='d-flex justify-content-center align-item-center'>
        <h1>Coming Soon...</h1>
      
    </div></>
  )
}
