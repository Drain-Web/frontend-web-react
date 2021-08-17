import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Line,
  Legend,
} from "recharts";
import "../style/TimeSeriePlot.css";
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

    objData["datetime"] = series.events.map((timeStep) => {
      return timeStep.date + " " + timeStep.time;
    });

    objData["value"] = series.events.map((timeStep) => {
      return timeStep.value;
    });

    objData["properties"] = series.header;

    objData["thresholdValueSets"] = series.thresholdValueSets;

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
        x: serie["datetime"],
        y: serie["value"],
        type: "scatter",
        mode: "lines",
        name: serie["properties"]["parameterId"],
      };
    });

    setPlotData(plotDataAux);
    setPlotArray(plotArrayAux);
  };

  // getPlotData();
  useEffect(() => getPlotData(), []);

  // const title = "Station " + plotData[0]["properties"]["stationName"];

  return (
    <>
      {plotArray && (
        <div>
          {console.log(plotArray)}
          <Plot
            data={plotArray}
            layout={{
              autosize: true,
              title: plotData[0]["properties"]["stationName"],
              legend: true,
            }}
          />
        </div>
      )}
    </>
  );
};

export default TimeSeriesPlot;

// data={[
//   {
//     x: {plotData["date"]},
//     y: {plotData["value"]},
//     type: 'scatter',
//     mode: 'lines',
//   },

// ]}
// layout={ {autosize: true, title: 'A Fancy Plot'} }
