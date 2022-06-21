import React from "react";
import Plot from "react-plotly.js";

import { cloneDeep } from 'lodash'


// ** AUX FUNCTIONS ****************************************************************************

// 
const createBasicPlotLayoutDict = (plotData) => {
  return {
    title: plotData[0].properties.location_id.replace("_", " ").toUpperCase(),
    font: { family: "Arial", size: 16 },
    legend: { x: 1.05, y: 1.00, font: { size: 12 } },
    showlegend: true
  }
}


// 
const getPlotLayoutDict1var = (availableVariables, unitsVariables, baseDict) => {
  baseDict['yaxis'] = {
    title: availableVariables[0] + " [" + unitsVariables[0] + "]",
  }
  baseDict['autosize'] = false
}


// 
const getPlotLayoutDict2vars = (availableVariables, unitsVariables, baseDict) => {
  baseDict['yaxis'] = {
    title: availableVariables[0] + " [" + unitsVariables[0] + "]",
  }
  baseDict['yaxis2'] = {
    title: availableVariables[1] + " [" + unitsVariables[1] + "]",
    overlaying: "y",
    side: "right",
  }
}


// ** COMPONENT ********************************************************************************

const TimeSeriesPlotLayouts = ({
  plotArray,
  plotData,
  availableVariables,
  unitsVariables,
  thresholdsArray
}) => {
  const updatemenus = [{
    visible: true,
    anchor: "top",
    buttons: [
      {
        method: "restyle",
        args: [{ "line.color": "red" }],
        label: "red",
      }, {
        method: "restyle",
        args: [{ "line.color": "blue" }],
        label: "blue",
      }
    ]
  }];

  // build layout attributes dictionary
  const layouts = createBasicPlotLayoutDict(plotData);
  if (availableVariables.length == 1) {
    getPlotLayoutDict1var(availableVariables, unitsVariables, layouts);
  } else if (availableVariables.length == 2) {
    getPlotLayoutDict2vars(availableVariables, unitsVariables, layouts);
  } else {
    return (<div>INVALID ARGUMENTS: length {availableVariables.length}</div>)
  }

  // add threshold lines (if needed)
  const retData = (thresholdsArray != null) ? plotArray.concat(thresholdsArray) : plotArray
  
  // builds the plot effectively
  // for some reason, it only works if the data is deep cloned 
  return (<Plot data={cloneDeep(retData)} layout={cloneDeep(layouts)} />)
};

export default TimeSeriesPlotLayouts
