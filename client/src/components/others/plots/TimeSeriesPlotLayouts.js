import React from "react";
import Plot from "react-plotly.js";

const TimeSeriesPlotLayouts = ({
  plotArray,
  plotData,
  availableVariables,
  unitsVariables,
  thresholdsArray,
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

  if (availableVariables.length == 1) {
    layouts = {
      autosize: true,
      title: plotData[0].properties.location_id.replace("_", " ").toUpperCase(),
      yaxis: {
        title: availableVariables[0] + "[" + unitsVariables[0] + "]",
      },
      font: {
        family: "Arial",
        size: 16,
      },
      showlegend: true,
      legend: {
        x: 1.05,
        y: 1,
        font: {
          size: 12,
        },
      },
      // updatemenus: updatemenus,
    };
  } else if (availableVariables.length == 2) {
    layouts = {
      title: plotData[0].properties.location_id.replace("_", " ").toUpperCase(),
      font: {
        family: "Arial",
        size: 16,
      },
      showlegend: true,
      legend: {
        x: 1.2,
        y: 1,
        font: {
          size: 12,
        },
      },
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

  if (true) {
    return (
      <>
        <Plot
          data={plotArray.concat([
            {
              x: [plotArray[0].x[0], plotArray[0].x.slice(-1)[0]],
              y: [80, 80],
              legendgroup: "group2",
              type: "scatter",
              mode: "lines",
              yaxis: "y",
              name: "Threshold",
              line: { dash: "dot", color: "red" },
            },
          ])}
          layout={layouts}
        />
      </>
    );
  } else {
    return (
      <>
        <Plot data={plotArray} layout={layouts} />
      </>
    );
  }
};

export default TimeSeriesPlotLayouts;
