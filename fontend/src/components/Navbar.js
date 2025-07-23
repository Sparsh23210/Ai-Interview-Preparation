import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Prepare from '../Prepare.png';
import Streak from './Streak';
import Dashboard from './Dashboard';
export default function Navbar() {
    const navigate = useNavigate();
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
                     <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row gap-2">
                        <li className="nav-item">
                            <Streak />
                        </li>
                        <li className="nav-item">
                           <button  onClick={() => navigate('/Dashboard')}  style={{color:"black",backgroundColor:"#41dc8e", border: "none",
    borderRadius: "25px",
    padding: "8px 16px",
    fontWeight: "bold"}}>DashBoard</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
