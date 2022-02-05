import React, { Suspense, useEffect, useRef, useContext } from "react";
import Draggable from "react-draggable";
import { DomEvent } from "leaflet";
import Spinner from "react-bootstrap/Spinner";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";

// import components
import LoadTimeSeriesData from "./plots/LoadTimeSeriesData";
import TimeSeriesPlot from "./plots/TimeSeriesPlot";
import CloseButton from "react-bootstrap/CloseButton";
import MetricsTable from "./MetricsTable";
import GetMetricsData from "./plots/GetMetricsData";

// import contexts
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

// import styles
import "../../style/Panel.css";

/* Panel open with the list of timeseries of a Location to be plot and the timeseries plot
 * Referenced by MapControler.
 */

//
const showLoading = () => {
  return (
    <div className="loading-spinner">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

//
const showTimeseriesPlot = (variable, varsState) => {
  return (
    <TimeSeriesPlot
      plotData={varsState.domObjects.timeSeriesData.plotData[variable]}
      plotArray={varsState.domObjects.timeSeriesData.plotArrays[variable]}
      availableVariables={
        varsState.domObjects.timeSeriesData.availableVariables[variable]
      }
      unitsVariables={
        varsState.domObjects.timeSeriesData.unitsVariables[variable]
      }
      thresholdsArray={
        varsState.domObjects.timeSeriesData.thresholdsArray[variable]
      }
    />
  );
};

//
const DraggableTimeseriesDiv = ({ settings }) => {
  const divRef = useRef(null);
  const { varsState, setVarState } = useContext(VarsState);

  const plotStyles = settings["plotStyles"];

  useEffect(() => {
    if (divRef.current !== null) {
      DomEvent.disableClickPropagation(divRef.current);
    }
  });

  // ${position}
  return (
    <div
      className={`${
        varsStateLib.getPanelTabsShow(varsState) ? "Panel" : "Panel hide"
      }`}
      ref={divRef}
    >
      {/* <Draggable bounds='parent'> */}
      {/* <Draggable> */}
      <div className="Panel-content">
        {varsStateLib.getTimeSerieUrl(varsState) && (
          <Suspense fallback={showLoading()}>
            <LoadTimeSeriesData plotStyles={plotStyles} />
            {varsState.domObjects.timeSeriesData.availableVariables && (
              <Suspense fallback={showLoading()}>
                <GetMetricsData />
                <div>
                  {varsState.domObjects.timeSeriesData.evaluationMetrics && (
                    <Suspense fallback={showLoading()}>
                      <Tabs
                        defaultActiveKey={
                          varsState.domObjects.timeSeriesData
                            .availableVariables[0]
                        }
                        id="uncontrolled-tab-example"
                        className="mb-3"
                      >
                        {
                          /* Add one tab per time series */
                          Object.keys(
                            varsState.domObjects.timeSeriesData
                              .availableVariables
                          ).map((variable) => {
                            return (
                              <Tab
                                eventKey={variable}
                                title={
                                  { Q: "Streamflow", H: "Stream Level" }[
                                    variable
                                  ]
                                } /* TODO: remove hard code */
                                key={variable}
                              >
                                {showTimeseriesPlot(variable, varsState)}
                              </Tab>
                            );
                          })
                        }

                        {Object.keys(
                          varsState.domObjects.timeSeriesData.evaluationMetrics
                        ).map((variable) => {
                          let variableName = {
                            Q: "Streamflow",
                            H: "Stream Level",
                          }[variable];
                          return (
                            <Tab
                              eventKey={`Metrics ${variableName}`}
                              title={`Metrics ${variableName}`}
                            >
                              <MetricsTable
                                timeSeriesMetrics={
                                  varsState.domObjects.timeSeriesData
                                    .evaluationMetrics[variable]
                                }
                                className="justify-content-md-center"
                              />
                            </Tab>
                          );
                        })}
                      </Tabs>
                    </Suspense>
                  )}
                </div>
              </Suspense>
            )}
          </Suspense>
        )}
      </div>
      {/* </Draggable> */}
      <div className="close-button">
        <CloseButton
          onClick={() => {
            varsStateLib.hidePanelTabs(varsState);
            setVarState(Math.random());
          }}
        />
      </div>

      {/* </Draggable> */}
    </div>
  );
};

const PanelTabs = ({ settings }) => {
  /* TimeSeriesPlot */
  return <DraggableTimeseriesDiv settings={settings} />;
};

export default PanelTabs;
