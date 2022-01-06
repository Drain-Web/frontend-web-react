import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const TimeSeriesPlotLayouts = ({
  plotArray,
  plotData,
  availableVariables,
  unitsVariables,
  thresholdsArray
}) => {
  const updatemenus = [
    {
      visible: true,
      anchor: "top",
      buttons: [
        {
          method: "restyle",
          args: [{ "line.color": "red" }],
          label: "red",
        },
        {
          method: "restyle",
          args: [{ "line.color": "blue" }],
          label: "blue",
        },
      ],
    },
  ];

  let layouts = {};
  
  const fontAttrs = {
    family: "Arial",
    size: 16
  }
  const legendAttrs = {
    x: 1.05, y: 1.00,
    font: { size: 12 }
  }

  if (availableVariables.length == 1) {
    layouts = {
      autosize: true,
      title: plotData[0].properties.location_id.replace("_", " ").toUpperCase(),
      yaxis: {
        title: availableVariables[0] + "[" + unitsVariables[0] + "]",
      },
      font: fontAttrs,
      showlegend: true,
      legend: legendAttrs
    };
  } else if (availableVariables.length == 2) {
    layouts = {
      title: plotData[0].properties.location_id.replace("_", " ").toUpperCase(),
      font: fontAttrs,
      showlegend: true,
      legend: legendAttrs,
      yaxis: {
        title: availableVariables[0] + "[" + unitsVariables[0] + "]",
      },
      yaxis2: {
        title: availableVariables[1] + "[" + unitsVariables[1] + "]",
        overlaying: "y",
        side: "right",
      },
    };
  }

  console.log(thresholdsArray);
  const retData = (thresholdsArray != null) ? plotArray.concat(thresholdsArray) : plotArray

  return (
    <Plot data={retData} layout={layouts} />
  )
};

export default TimeSeriesPlotLayouts;
