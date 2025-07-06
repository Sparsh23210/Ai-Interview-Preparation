import React from 'react';
import { Link } from 'react-router-dom';
import Prepare from '../Prepare.png';
export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top w-100 shadow" style={{ zIndex: 1000 }}>
            <div className="container-fluid">
                
                 <Link className="navbar-brand" to="/">
      <img src={Prepare} alt="Logo" width="30" height="24" class="d-inline-block align-text-top" />
      PreBoost
    </Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/About">About</Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/engineering">Enginnering</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/english">Learn English</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/upsc">Prepare UPSC</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
