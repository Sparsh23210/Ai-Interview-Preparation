import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Prepare from '../Prepare.png';
import Streak from './Streak';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top w-100 shadow" style={{ zIndex: 1000 }}>
      <div className="container-fluid">

        
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={Prepare} alt="Logo" width="30" height="30" className="d-inline-block align-text-top" />
          <strong>PreBoost</strong>
        </Link>

        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
         
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/About">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/engineering">Engineering</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/english">Learn English</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upsc">Prepare UPSC</Link>
            </li>
          </ul>

          
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row gap-2 align-items-center">
            <li className="nav-item">
              <Streak />
            </li>
            <li className="nav-item">
              <button
                onClick={() => navigate('/Dashboard')}
                style={{
                  color: "black",
                  backgroundColor: "#41dc8e",
                  border: "none",
                  borderRadius: "25px",
                  padding: "8px 16px",
                  fontWeight: "bold"
                }}
              >
                Dashboard
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
