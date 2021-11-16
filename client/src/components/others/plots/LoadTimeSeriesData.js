import React, { useEffect, useState, useContext } from "react";
import useSWR from "swr";
import axios from "axios";
import varsStateLib from "../../contexts/varsStateLib";
import VarsState from "../../contexts/VarsState";
import ConsFixed from "../../contexts/ConsFixed";

function filterByValue(array, string) {
  return array.filter((o) =>
    Object.keys(o).some((k) =>
      o[k].toLowerCase().includes(string.toLowerCase())
    )
  );
}

const LoadTimeSeriesData = ({ timeSerieUrl }) => {
  // Get global states and set local states
  const { varsState, setVarsState } = useContext(VarsState);
  const { consFixed } = useContext(ConsFixed);

  const [plotData, setPlotData] = useState(null);
  const [plotArray, setPlotArray] = useState(null);
  const [availableVariables, setAvailableVariables] = useState(null);
  const [unitsVariables, setUnitsVariables] = useState(null);
  const [thresholdsArray, setThresholdsArray] = useState(null);

  console.log(consFixed.locations);

  varsStateLib.setTimeSerieUrl(timeSerieUrl, varsState);
  setVarsState(varsState);

  const fetcher = (url) => axios.get(url).then((res) => res.data);

  const { data: apiData, error } = useSWR(timeSerieUrl, fetcher, {
    suspense: true,
  });
  if (error) return <div>failed to load</div>;
  if (!apiData) return <div>loading...</div>;

  // Aux variables to set data used for plots
  let timeSeriesPlotDataAux;
  let timeSeriesPlotArrayAux;
  let timeSeriesThresholdsArrayAux;

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

  const reorder = (arr) => {
    const variables = arr
      .map((serie) => {
        return serie.properties.parameterId.split(".")[0];
      })
      .filter((v, i, a) => a.indexOf(v) === i);

    let obj = {};
    for (let variable of variables) {
      obj[variable] = [];
    }

    for (let variable of variables) {
      for (let entry of arr) {
        if (entry.properties.parameterId.split(".")[0] == variable) {
          obj[variable].push(entry);
        }
      }
    }

    return Object.keys(obj)
      .sort()
      .reduce((objs, key) => {
        objs[key] = obj[key];
        return objs;
      }, {});
  };

  let opacity = 1;
  let dash = "solid";
  let width = 3;

  const getPlotArrays = (plotData) => {
    let variables = Object.keys(plotData);

    let obj = {};
    for (let variable of variables) {
      obj[variable] = [];
    }

    for (let variable of variables) {
      for (let entry of plotData[variable]) {
        if (entry.properties.parameterId.split(".")[0] == variable) {
          if (entry.properties.parameterId.toLowerCase().includes("obs")) {
            opacity = 1;
            dash = "solid";
            width = 3;
          } else {
            opacity = 0.8;
            dash = "solid";
            width = 1;
          }

          obj[variable].push({
            x: entry.datetime,
            y: entry.value,
            type: "scattergl",
            mode: "lines",
            line: { dash: dash, width: width },
            name: entry.properties.moduleInstanceId,
            yaxis: "y",
            units: entry.properties.units,
            variable: entry.properties.parameterId,
            opacity: opacity,
            legendgroup: "group1",
          });
        }
      }
    }

    return obj;
  };

  const getPlotThresholdsArrays = (plotData) => {
    let variables = Object.keys(plotData);
    let thresholds;
    let locationId;

    let obj = {};
    for (let variable of variables) {
      obj[variable] = [];
    }

    for (let variable of variables) {
      locationId = plotData[variable][0].properties.location_id;

      thresholds = consFixed.locations.locations.filter((obj) => {
        return obj.locationId === locationId;
      });

      if (
        plotData[variable][0].properties.parameterId.split(".")[0] == variable
      ) {
        if (thresholds[0].attributes != null) {
          for (let threshold of thresholds[0].attributes.filter((obj) => {
            return obj.id.includes(variable + "raw");
          })) {
            obj[variable].push({
              x: [
                plotData[variable][0].datetime[0],
                plotData[variable][0].datetime.slice(-1)[0],
              ],
              y: [parseFloat(threshold.number), parseFloat(threshold.number)],
              legendgroup: "group2",
              type: "scattergl",
              mode: "lines",
              yaxis: "y",
              name: threshold.name,
              line: { dash: "dot", color: "black" },
            });
          }
        }
      }
    }
    console.log(obj);
    return obj;
  };

  const getAvailableVariables = (plotData) => {
    let variables = Object.keys(plotData);

    let obj = {};
    for (let variable of variables) {
      obj[variable] = [];
    }

    for (let variable of variables) {
      for (let entry of plotData[variable]) {
        if (entry.properties.parameterId.split(".")[0] == variable) {
          obj[variable].push(entry.properties.parameterId.split(".")[0]);
        }
      }
      obj[variable] = obj[variable].filter((v, i, a) => a.indexOf(v) === i);
    }

    return obj;
  };

  const getUnitsVariables = (plotData) => {
    let variables = Object.keys(plotData);

    let obj = {};
    for (let variable of variables) {
      obj[variable] = [];
    }

    for (let variable of variables) {
      for (let entry of plotData[variable]) {
        if (entry.properties.parameterId.split(".")[0] == variable) {
          obj[variable].push(entry.properties.units);
        }
      }
      obj[variable] = obj[variable].filter((v, i, a) => a.indexOf(v) === i);
    }

    return obj;
  };

  const getTimeSeriesData = async () => {
    timeSeriesPlotDataAux = await apiData.map((series) => {
      return rearrangeSeries(series);
    });

    timeSeriesPlotDataAux = reorder(timeSeriesPlotDataAux);

    setPlotData(timeSeriesPlotDataAux);

    timeSeriesPlotArrayAux = await getPlotArrays(
      varsState.domObjects.timeSeriesData.plotData
    );

    setPlotArray(timeSeriesPlotArrayAux);
    setAvailableVariables(getUnitsVariables(timeSeriesPlotDataAux));
    setUnitsVariables(getAvailableVariables(timeSeriesPlotDataAux));
    setThresholdsArray(getPlotThresholdsArrays(timeSeriesPlotDataAux));
  };

  useEffect(() => getTimeSeriesData(), [timeSerieUrl]);

  varsStateLib.setTimeSeriesPlotData(plotData, varsState);
  setVarsState(varsState);

  varsStateLib.setTimeSeriesPlotArrays(plotArray, varsState);
  setVarsState(varsState);

  varsStateLib.setTimeSeriesPlotUnitsVariables(availableVariables, varsState);
  setVarsState(varsState);

  varsStateLib.setTimeSeriesPlotAvailableVariables(unitsVariables, varsState);
  setVarsState(varsState);

  varsStateLib.setTimeSeriesPlotThresholdsArray(thresholdsArray, varsState);
  setVarsState(varsState);

  return null;
};

export default LoadTimeSeriesData;
