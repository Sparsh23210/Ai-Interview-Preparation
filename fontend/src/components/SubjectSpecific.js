import React from 'react';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import VantaHome from '../Vantahome';

export default function SubjectSpecific() {
  const navigate = useNavigate();

  const subjects = [
    {
      to: "/dsa",
      title: "Data Structures & Algorithms",
      text: "AI Technical DSA Interview",
    },
    {
      to: "/dbms",
      title: "Database Management System",
      text: "Database includes SQL + RDBMS interview",
    },
    {
      to: "/os",
      title: "Operating System",
      text: "Boost your System information",
    },
    {
      to: "/sd",
      title: "System Design",
      text: "",
    },
    {
      to: "/cn",
      title: "Computer Networks",
      text: "Be prepared with Computer Network",
    },
    {
      to: "/ai",
      title: "Artificial Intelligence",
      text: "Get Interviewed with Artificial Intelligence",
    },
    {
      to: "/devops",
      title: "Cloud/DevOps for AI",
      text: "",
    },
  ];

  return (
    <>
      <VantaHome>
        <div>
          <Navbar />
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            position: "fixed",
            top: "65px",
            left: "20px",
            zIndex: 990,
            backgroundColor: "white",
            color: "black",
            border: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-3">
          <h1 className="text-4xl font-bold text-center mt-5 text-dark">
            Subject Specific
          </h1>

          <div className="container my-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center shadow-lg rounded-4 border p-4 bg-white">
              {subjects.map((item, idx) => (
                <div key={idx} className="col">
                  <Link to={item.to} className="text-decoration-none text-dark">
                    <div className="card h-100 shadow-sm rounded-3 hover-shadow">
                      <div className="card-body text-center">
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-text">{item.text}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </VantaHome>
    </>
  );
}
