import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const TimeSeriesPlotLayouts = ({ plotArray, plotData, availableVariables }) => {
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

  if (availableVariables.length > 1) {
    layouts = {
      autosize: true,
      title: plotData[0].properties.location_id.replace("_", " ").toUpperCase(),
      font: {
        family: "Arial",
        size: 16,
      },
      legend: true,
      updatemenus: updatemenus,
    };
  } else {
    layouts = {
      title: "Prueba",
      font: {
        family: "Arial",
        size: 36,
      },
      legend: true,
    };
  }

  return (
    <>
      <Plot data={plotArray} layout={layouts} />
    </>
  );
};

export default TimeSeriesPlotLayouts;
