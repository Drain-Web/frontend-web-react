import React from "react";
import Plot from "react-plotly.js";

import { cloneDeep } from 'lodash'


// ** AUX FUNCTIONS ****************************************************************************

// 
const createBasicPlotLayoutDict = (plotData) => {

  // define minimum and maximum values for Y axis limits
  let [minValue, maxValue] = [null, null]
  for (const curPlotData of plotData) {
    const curMissValue = curPlotData.properties.missVal
    for (const curValue of curPlotData.value) {
      if (curValue === curMissValue) { continue }
      if ((minValue === null) || (minValue > curValue)) { minValue = curValue }
      if ((maxValue === null) || (maxValue < curValue)) { maxValue = curValue }
    }
  }

  // if everything is zero, set artificial limits from 0 to 1.5
  if ((minValue === 0) && (maxValue === 0)) {
    [minValue, maxValue] = [0, 1.5]
  }

  // build legend layout
  return {
    title: plotData[0].properties.location_id.replace("_", " ").toUpperCase(),
    font: { family: "Arial", size: 16 },
    legend: { x: 1.05, y: 1.00, font: { size: 12 } },
    showlegend: true,
    yaxis: {
      range: [minValue, maxValue]
    }
  }
}


// 
const getPlotLayoutDict1var = (availableVariables, unitsVariables, baseDict) => {
  if (!baseDict['yaxis']) {
    baseDict['yaxis'] = {}
  }
  baseDict['yaxis'].title = availableVariables[0] + " [" + unitsVariables[0] + "]"
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
