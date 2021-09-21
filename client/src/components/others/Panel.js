import React, { Suspense, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { DomEvent } from "leaflet";
import TimeSeriesPlot from "./TimeSeriesPlot";
import "../../style/Panel.css";
import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";

/* Panel open with the list of timeseries of a Location to be plot and the timeseries plot
 * Referenced by MapControler.
 */

const DraggableTimeseriesDiv = ({ isHidden, setIsHidden, timeSerieUrl }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current !== null)
      DomEvent.disableClickPropagation(divRef.current);
  });

  // ${position}
  return (
    <div className={`${isHidden ? "Panel hide" : "Panel"}`} ref={divRef}>
      {/* <Draggable bounds='parent'> */}
      <div className="Panel-content">
        {timeSerieUrl && (
          <Suspense
            fallback={
              <div>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            }
          >
            <TimeSeriesPlot timeSeriesUrl={timeSerieUrl} />
          </Suspense>
        )}
      </div>
      <div
        className="button-close"
        onClick={() => {
          setIsHidden(!isHidden);
        }}
      >
        ✕
      </div>
      {/* </Draggable> */}
    </div>
  );
};

const Panel = ({ hideAll, isHidden, setIsHidden, timeSerieUrl, position }) => {
  if (hideAll) {
    return (
      <>
        {/* TimeSeriesPlot */}
        <DraggableTimeseriesDiv
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
        />

        {/* over-the-point menu */}
        {/*
        <div className='plotting-panel-button'>
          <button className='boton-prueba' onClick={() => { setIsHidden(!isHidden) }}>
            {isHidden ? 'Show' : 'Hide'}
          </button>
        </div>
        */}
      </>
    );
  } else {
    return <></>;
  }
};

export default Panel;
