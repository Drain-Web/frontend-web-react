import React, { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";

import TimeSeriesPlotLayouts from "./TimeSeriesPlotLayouts";

import "../../../style/TimeSeriePlot.css"

const TimeSeriesPlot = ({ plotData, plotArray, availableVariables, unitsVariables, thresholdsArray }) => {
  return (
    plotArray
      ?
        (
          <div>
            <TimeSeriesPlotLayouts
              plotArray={plotArray}
              plotData={plotData}
              availableVariables={availableVariables}
              unitsVariables={unitsVariables}
              thresholdsArray={thresholdsArray}
            />
          </div>
        )
      :
        (<></>)
  )
}

export default TimeSeriesPlot
