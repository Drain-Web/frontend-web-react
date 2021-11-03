import React, { Suspense, useEffect, useRef, useContext } from "react";
import Draggable from "react-draggable";
import { DomEvent } from "leaflet";
import TimeSeriesPlot from "./plots/TimeSeriesPlot";
import LoadTimeSeriesData from "./plots/LoadTimeSeriesData";
// import "../../style/Panel.css";
import Spinner from "react-bootstrap/Spinner";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import CloseButton from "react-bootstrap/CloseButton";
import VarsState from "../contexts/VarsState";

/* Panel open with the list of timeseries of a Location to be plot and the timeseries plot
 * Referenced by MapControler.
 */

const DraggableTimeseriesDiv = ({ isHidden, setIsHidden, timeSerieUrl }) => {
  const divRef = useRef(null);
  const { varsState, setVarsState } = useContext(VarsState);

  useEffect(() => {
    if (divRef.current !== null)
      DomEvent.disableClickPropagation(divRef.current);
  });

  // ${position}
  return (
    <div className={`${isHidden ? "Panel hide" : "Panel"}`} ref={divRef}>
      {/* <Draggable bounds='parent'> */}
      <Draggable>
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
              <div>
                <LoadTimeSeriesData timeSerieUrl={timeSerieUrl} />

                {varsState.context.timeSeriesData.availableVariables && (
                  <Tabs
                    defaultActiveKey={
                      varsState.context.timeSeriesData.availableVariables[0]
                    }
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    {Object.keys(
                      varsState.context.timeSeriesData.availableVariables
                    ).map((variable) => {
                      return (
                        <Tab eventKey={variable} title={variable}>
                          <TimeSeriesPlot
                            plotData={
                              varsState.context.timeSeriesData.plotData[
                                variable
                              ]
                            }
                            plotArray={
                              varsState.context.timeSeriesData.plotArrays[
                                variable
                              ]
                            }
                            availableVariables={
                              varsState.context.timeSeriesData
                                .availableVariables[variable]
                            }
                            unitsVariables={
                              varsState.context.timeSeriesData.unitsVariables[
                                variable
                              ]
                            }
                          />
                        </Tab>
                      );
                    })}
                  </Tabs>
                )}
              </div>
            </Suspense>
          )}
        </div>
      </Draggable>
      <div className="close-button">
        <CloseButton
          onClick={() => {
            setIsHidden(!isHidden);
          }}
        ></CloseButton>
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
