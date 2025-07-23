import React from "react";
import Particles from "@tsparticles/react";
import particlesConfig from "./particlesConfig";


const FormChecking = ({
  handleSubmit,
  handleChange,
  
  loading
}) => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center">
        <div><h3>Fill Form Below to continue..</h3></div>
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        options={particlesConfig}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none"
        }}
      />
      
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "100%", position: "relative", zIndex: 2 }}
      >
        <form
          onSubmit={handleSubmit}
          className="row g-3 bg- p-4 rounded" 
          style={{
            minWidth: "60%",
            boxShadow: "0 0 20px #00ffff99",
            color: "#0ff",
            backgroundColor:"#E8E7E5" 
          }}
        >
          <div className="col-12 col-md-6">
            <input name="name" placeholder="Your Name" className="form-control" onChange={handleChange} />
          </div>
          
          <div className="col-12 col-md-6">
            <input name="education" placeholder="Education" className="form-control" onChange={handleChange} />
          </div>
          
          
          <div className="col-12">
            <button type="submit" className="btn btn-info mt-2 w-100 text-black fw-bold">
              {loading ? "Generating..." : "Submit & Generate AI Question"}
            </button>
          </div>
        </form>
      </div></div>
    </div>
  );
};

export default FormChecking;
