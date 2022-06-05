import React from "react";
import TimeSeriesPlotLayouts from "./TimeSeriesPlotLayouts";

import "../../../style/TimeSeriePlot.css"

const TimeSeriesPlot = ({ plotData, plotArray, availableVariables, unitsVariables, thresholdsArray }) => {
  return (
    plotArray ?
    (
      <TimeSeriesPlotLayouts
        plotArray={plotArray}
        plotData={plotData}
        availableVariables={availableVariables}
        unitsVariables={unitsVariables}
        thresholdsArray={thresholdsArray}
      />
    )
    :
    (<div>No plotArray</div>)
  )
}

export default TimeSeriesPlot
