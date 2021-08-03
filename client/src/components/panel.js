import React from "react";
import TimeSeriesPlot from "./TimeSeriesPlot";
import "../style/Panel.css";
import { Suspense } from "react";

/* Panel open with the list of timeseries of a Location to be plot
 */

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
        {timeSerieUrl && (
          <Suspense fallback={<div>loading...</div>}>
            <p>{timeSerieUrl}</p>
            <TimeSeriesPlot timeSeriesUrl={timeSerieUrl} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Panel;
