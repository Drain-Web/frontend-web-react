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
    <div>
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
const DraggableTimeseriesDiv = () => {
  const divRef = useRef(null);
  const { varsState, setVarState } = useContext(VarsState);

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
            <div>
              <LoadTimeSeriesData />
              {varsState.domObjects.timeSeriesData.availableVariables && (
                <Tabs
                  defaultActiveKey={
                    varsState.domObjects.timeSeriesData.availableVariables[0]
                  }
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  {
                    /* Add one tab per time series */
                    Object.keys(
                      varsState.domObjects.timeSeriesData.availableVariables
                    ).map((variable) => {
                      return (
                        <Tab
                          eventKey={variable}
                          title={
                            { Q: "Streamflow", H: "Stream Level" }[variable]
                          } /* TODO: remove hard code */
                          key={variable}
                        >
                          {showTimeseriesPlot(variable, varsState)}
                        </Tab>
                      );
                    })
                  }
                  <Tab eventKey={"Metrics"} title={"Metrics"}>
                    <MetricsTable
                      timeSeriesMetrics={{
                        evaluations: {
                          RMSE: {
                            ImportHLModelHist01: 16.156 /* TODO: remove hard code */,
                            Dist050t065USGSobs: 31.041,
                            Dist115t140USGSobs: 20.745,
                          },
                          KGE: {
                            ImportHLModelHist01: 0.31,
                            Dist050t065USGSobs: 0.572,
                            Dist115t140USGSobs: 0.722,
                          },
                        },
                        version: "1.25",
                      }}
                      className="justify-content-md-center"
                    />
                  </Tab>
                </Tabs>
              )}
            </div>
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

const PanelTabs = ({ position }) => {
  /* TimeSeriesPlot */
  return <DraggableTimeseriesDiv />;
};

export default PanelTabs;
