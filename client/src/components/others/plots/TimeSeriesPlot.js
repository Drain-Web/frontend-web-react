import React, { useState, useEffect } from "react";
import "../../../style/TimeSeriePlot.css";
import TimeSeriesPlotLayouts from "./TimeSeriesPlotLayouts";

const TimeSeriesPlot = ({
  plotData,
  plotArray,
  availableVariables,
  unitsVariables,
}) => {
  return (
    <>
      {plotArray && (
        <div>
          <TimeSeriesPlotLayouts
            plotArray={plotArray}
            plotData={plotData}
            availableVariables={availableVariables}
            unitsVariables={unitsVariables}
          />
        </div>
      )}
    </>
  );
};

export default TimeSeriesPlot;
