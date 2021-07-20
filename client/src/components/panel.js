import React from "react";
import TimeSeriesPlot from "./timeSeriesPlot"; 
import "../style/Panel.css";

const Panel = ({ isHidden, setIsHidden, timeSerieUrl }) => {
  const buttonHandler = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div>
      <button className="boton-prueba" onClick={() => buttonHandler()}>
        {isHidden ? "Show" : "Hide"}
      </button>

      <div className={`${isHidden ? "Panel hide" : "Panel"}`}>
        <p>{timeSerieUrl}</p>

        {timeSerieUrl && <TimeSeriesPlot />}
      </div>
    </div>
  );
};

export default Panel;
