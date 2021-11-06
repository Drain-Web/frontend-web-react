import React, { useEffect, useState, useContext } from "react"
import useSWR from "swr"
import axios from "axios"

import varsStateLib from "../../contexts/varsStateLib"
import VarsState from "../../contexts/VarsState"

const LoadTimeSeriesData = () => {
  // Get global states and set local states
  const { varsState, setVarState } = useContext(VarsState)
  const setPlotData = useState(null)[1]

  const fetcher = (url) => axios.get(url).then((res) => res.data)

  const { data: apiData, error } = useSWR(varsStateLib.getTimeSerieUrl(varsState), fetcher, {
    suspense: true
  })

  useEffect(() => getTimeSeriesData(), [varsStateLib.getTimeSerieUrl(varsState)])

  if (error) return <div>failed to load</div>
  if (!apiData) return <div>loading...</div>

  // Aux variables to set data used for plots
  let timeSeriesPlotDataAux
  let timeSeriesPlotArrayAux

  //
  const rearrangeSeries = (series) => {
    const objData = {}

    objData.datetime = series.events.map((timeStep) => {
      return timeStep.date + ' ' + timeStep.time
    })

    objData.value = series.events.map((timeStep) => {
      return timeStep.value
    })

    objData.properties = series.header

    objData.thresholdValueSets = series.thresholdValueSets

    return objData
  }

  //
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
  }

  //
  const getPlotArrays = (plotData) => {
    let variables = Object.keys(plotData);

    let obj = {};
    for (let variable of variables) {
      obj[variable] = [];
    }

    for (let variable of variables) {
      for (let entry of plotData[variable]) {
        if (entry.properties.parameterId.split(".")[0] == variable) {
          obj[variable].push({
            x: entry.datetime,
            y: entry.value,
            type: "scatter",
            mode: "lines",
            name: entry.properties.moduleInstanceId,
            yaxis: "y",
            units: entry.properties.units,
            variable: entry.properties.parameterId,
          });
        }
      }
    }

    return obj;
  }

  //
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
  }

  //
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

    return obj
  }

  //
  const getTimeSeriesData = async () => {
    timeSeriesPlotDataAux = await apiData.map((series) => {
      return rearrangeSeries(series)
    })

    timeSeriesPlotDataAux = reorder(timeSeriesPlotDataAux)

    varsStateLib.setTimeSeriesPlotData(timeSeriesPlotDataAux, varsState)
    setPlotData(timeSeriesPlotDataAux)

    timeSeriesPlotArrayAux = await getPlotArrays(
      varsState.context.timeSeriesData.plotData
    )

    // update states and force re-rendering
    varsStateLib.setTimeSeriesPlotArrays(timeSeriesPlotArrayAux, varsState)
    varsStateLib.setTimeSeriesPlotUnitsVariables(getAvailableVariables(timeSeriesPlotDataAux), varsState)
    varsStateLib.setTimeSeriesPlotAvailableVariables(getUnitsVariables(timeSeriesPlotDataAux), varsState)
    setVarState(Math.random())
  }

  return null
}

export default LoadTimeSeriesData
