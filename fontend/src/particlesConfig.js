
const particlesConfig = {
  background: {
    color: { value: "#33ffe0 " }
  },
  particles: {
    number: {
      value: 50,
      density: { enable: true, area: 800 }
    },
    color: { value: "#00ffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: { min: 1, max: 5 } },
    links: {
      enable: true,
      distance: 150,
      color: "#00ffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      outModes: "bounce"
    }
  },
  detectRetina: true
};
export default particlesConfig;
