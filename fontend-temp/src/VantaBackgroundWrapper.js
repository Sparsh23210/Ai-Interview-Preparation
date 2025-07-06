import React, { useEffect, useRef } from "react";

const VantaBackgroundWrapper = ({ children }) => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect = null;

    if (window.VANTA && window.VANTA.WAVES && vantaRef.current) {
      vantaEffect = window.VANTA.WAVES({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x5588,
        shininess: 30,
        waveHeight: 15,
        waveSpeed: 1,
        zoom: 1,
      });
    }

    return () => {
      if (vantaEffect){ vantaEffect.destroy();
        vantaEffect.current = null;}
    };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
      
      <div
        ref={vantaRef}
        style={{
          position: "fixed", 
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />
      
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};

export default VantaBackgroundWrapper;
