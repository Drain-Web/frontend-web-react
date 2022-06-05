import React, { useState, useEffect } from "react";
import "../../style/TimeSeriePlot.css";
import useSWR from "swr";
import axios from "axios";
import TimeSeriesPlotLayouts from "./TimeSeriesPlotLayouts";

const TimeSeriesPlot = ({ timeSeriesUrl }) => {
  const [plotData, setPlotData] = useState(null);
  const [plotArray, setPlotArray] = useState(null);
  const [availableVariables, setAvailableVariables] = useState(null);
  const [unitsVariables, setUnitsVariables] = useState(null);

  const fetcher = (url) => axios.get(url).then((res) => res.data);

  const { data: apiData, error } = useSWR(timeSeriesUrl, fetcher, {
    suspense: true,
  });
  if (error) return <div>failed to load</div>;
  if (!apiData) return <div>loading...</div>;

  // Aux variables to set data used for plots
  let plotDataAux;
  let plotArrayAux;
  let countVariables = 0;
  let currentVariable = "";

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

    plotArrayAux = await plotDataAux
      .sort((a, b) =>
        a.properties.parameterId > b.properties.parameterId
          ? 1
          : b.properties.parameterId > a.properties.parameterId
          ? -1
          : 0
      )
      .map((serie) => {
        if (currentVariable != serie.properties.parameterId.slice(0, 1)) {
          countVariables = countVariables + 1;
          currentVariable = serie.properties.parameterId.slice(0, 1);
        } else {
          currentVariable = serie.properties.parameterId.slice(0, 1);
        }

        return {
          x: serie.datetime,
          y: serie.value,
          type: "scatter",
          mode: "lines",
          name: serie.properties.parameterId,
          yaxis: "y" + countVariables.toString(),
          units: serie.properties.units,
        };
      });

    setAvailableVariables(
      plotArrayAux
        .map((serie) => serie.name.slice(0, 1))
        .filter((v, i, a) => a.indexOf(v) === i)
    );

    setUnitsVariables(
      plotArrayAux
        .map((serie) => serie.units)
        .filter((v, i, a) => a.indexOf(v) === i)
    );

    setPlotData(plotDataAux);
    setPlotArray(plotArrayAux);
  };

  useEffect(getPlotData, [timeSeriesUrl]);

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
