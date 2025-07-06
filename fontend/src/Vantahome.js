import React, { useEffect, useRef } from "react";

const VantaBackgroundCDN = ({ children }) => {
  const vantaRef = useRef(null);

  useEffect(() => {
    if (window.VANTA && window.VANTA.BIRDS && vantaRef.current) {
      const vantaEffect = window.VANTA.BIRDS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0xcfe2ff,
        backgroundAlpha: 1,
        color1: 0xff0000,
        color2: 0x0d1ff,
        colorMode: "varianceGradient",
        quantity: 5,
        birdSize: 1,
        wingSpan: 30,
        speedLimit: 5,
        separation: 20,
        alignment: 20,
        cohesion: 20,
      });

      return () => {
        if (vantaEffect && vantaEffect.destroy) vantaEffect.destroy();
      };
    }
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};

export default VantaBackgroundCDN;
