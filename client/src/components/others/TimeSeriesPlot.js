import React, { useState, useEffect } from "react";
import "../../style/TimeSeriePlot.css";
import useSWR from "swr";
import axios from "axios";
import TimeSeriesPlotLayouts from "./TimeSeriesPlotLayouts";

const TimeSeriesPlot = ({ timeSeriesUrl }) => {
  const [plotData, setPlotData] = useState(null);
  const [plotArray, setPlotArray] = useState(null);
  const [availableVariables, setAvailableVariables] = useState(null);

  const fetcher = (url) => axios.get(url).then((res) => res.data);

  const { data: apiData, error } = useSWR(timeSeriesUrl, fetcher, {
    suspense: true,
  });
  if (error) return <div>failed to load</div>;
  if (!apiData) return <div>loading...</div>;

  // Aux variables to set data used for plots
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

    setAvailableVariables(
      plotArrayAux
        .map((serie) => serie.name.slice(0, 1))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort()
        .reverse()
    );
    setPlotData(plotDataAux);
    setPlotArray(plotArrayAux);
  };

  useEffect(() => getPlotData(), [timeSeriesUrl]);

  return (
    <>
      {plotArray && (
        <div>
          <TimeSeriesPlotLayouts
            plotArray={plotArray}
            plotData={plotData}
            availableVariables={availableVariables}
          />
        </div>
      )}
    </>
  );
};

export default TimeSeriesPlot;
