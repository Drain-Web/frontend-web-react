import React from "react";
import TimeSeriesPlot from "./TimeSeriesPlot";
import "../style/Panel.css";

const Panel = ({ isHidden, setIsHidden, timeSerieUrl, position }) => {
  const buttonHandler = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div>
      <button className="boton-prueba" onClick={() => buttonHandler()}>
        {isHidden ? "Show" : "Hide"}
      </button>

      <div className={`${isHidden ? "Panel hide" : "Panel"} ${position}`}>
        <p>{timeSerieUrl}</p>

        {timeSerieUrl && <TimeSeriesPlot />}

      </div>
    </div>
  );
};

export default Panel;
