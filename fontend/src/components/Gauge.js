import React from "react";
import GaugeChart from "react-gauge-chart";

const GaugeComponent = ({ value }) => {
  return (
    <div style={{ width: "300px" }}>
      <GaugeChart
        id="fluency-gauge"
        nrOfLevels={30}
        colors={["#FF5F6D", "#FFC371", "#00FF00"]}
        arcWidth={0.3}
        percent={value / 100}  
        textColor="#000000"
        formatTextValue={val => `${value} `}
      />
    </div>
  );
};

export default GaugeComponent;
