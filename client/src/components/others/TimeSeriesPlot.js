import React, { useState, useEffect } from "react";
import "../../style/TimeSeriePlot.css";
import useSWR from "swr";
import axios from "axios";
import Plot from "react-plotly.js";

const TimeSeriesPlot = ({ timeSeriesUrl }) => {
  const [plotData, setPlotData] = useState(null);
  const [plotArray, setPlotArray] = useState(null);

  const fetcher = (url) => axios.get(url).then((res) => res.data);

  const { data: apiData, error } = useSWR(timeSeriesUrl, fetcher, {
    suspense: true,
  });
  if (error) return <div>failed to load</div>;
  if (!apiData) return <div>loading...</div>;

  let plotDataAux;
  let plotArrayAux;

  const rearrangeSeries = (series) => {
    const objData = {};

    objData.datetime = series.events.map((timeStep) => {
      return timeStep.date + " " + timeStep.time;
    });

    objData.value = series.events.map((timeStep) => {
      return timeStep.value;
    });

    objData.properties = series.header;

    objData.thresholdValueSets = series.thresholdValueSets;

    return objData;
  };

  const getPlotData = async () => {
    setPlotData(null);
    setPlotArray(null);

    plotDataAux = await apiData.map((series) => {
      return rearrangeSeries(series);
    });

    plotArrayAux = await plotDataAux.map((serie) => {
      return {
        x: serie.datetime,
        y: serie.value,
        type: "scatter",
        mode: "lines",
        name: serie.properties.parameterId,
      };
    });
    console.log(plotDataAux[0].properties);
    console.log(plotDataAux[0].thresholdValueSets);

    setPlotData(plotDataAux);
    setPlotArray(plotArrayAux);
  };

  useEffect(() => getPlotData(), [timeSeriesUrl]);

  const updatemenus = [
    {
      yanchor: "top",
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
        {
          method: "restyle",
          args: [{ "line.color": "green" }],
          label: "green",
        },
      ],
    },
  ];

  return (
    <>
      {plotArray && (
        <div>
          <Plot
            data={plotArray}
            layout={{
              autosize: true,
              title: plotData[0].properties.location_id.replace("_", " "),
              legend: true,
              updatemenus: { updatemenus },
            }}
          />
        </div>
      )}
    </>
  );
};

export default TimeSeriesPlot;
