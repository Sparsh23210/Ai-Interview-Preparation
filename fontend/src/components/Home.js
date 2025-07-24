import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import VantaHome from '../Vantahome';

export default function Home() {
  return (
    <>
      <VantaHome>
        <div>
          <Navbar />
        </div>
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-3">
          <h1 className="text-3xl text-center font-bold mt-5 text-dark">
             Student AI Interview Preparation
          </h1>

          <div className="container-fluid">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
              {[
                {
                  to: "/engineering",
                  title: "Engineering",
                  text: "AI Interview Questions + Voice Analysis",
                },
                {
                  to: "/english",
                  title: "English Learning",
                  text: "Practice Basic English with AI",
                },
                {
                  to: "/upsc",
                  title: "UPSC Section",
                  text: "Interview Preparation",
                },
                {
                  to: "/Upload",
                  title: "Project Related Interview",
                  text: "Get Boost with your Project Related Interview",
                },
                {
                  to: "/common",
                  title: "Common Interview Questions",
                  text: "Be prepared with Common Interview Questions",
                },
                {
                  to: "/Subject",
                  title: "Subject Specific",
                  text: "Practice with specific subjectwise interview",
                },
              ].map((item, idx) => (
                <div key={idx} className="col">
                  <Link to={item.to} className="text-decoration-none text-dark">
                    <div className="card h-100 shadow-sm rounded-3 hover-shadow w-100">
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
