import React, { useEffect, useState, useContext } from "react"
import { apiUrl } from '../../../libs/api.js'
import useSWR from "swr"
import axios from "axios"

import VarsState from "../../contexts/VarsState"
import varsStateLib from "../../contexts/varsStateLib"
import ConsFixed from "../../contexts/ConsFixed";
import consFixedLib from "../../contexts/consFixedLib"
import ConsCache from "../../contexts/ConsCache"
import consCacheLib from "../../contexts/consCacheLib"

function filterByValue(array, string) {
  return array.filter((o) =>
    Object.keys(o).some((k) =>
      o[k].toLowerCase().includes(string.toLowerCase())
    )
  );
}

const LoadTimeSeriesData = ({ settings }) => {

  // Get global states and set local states
  const { varsState, setVarState } = useContext(VarsState)
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
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
  let timeSeriesThresholdsArrayAux

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

    // get the parameter group ids
    const parameterGroupIds = arr
      .map((serie) => {
        const parameterId = serie.properties.parameterId;
        return consFixedLib.getParameterGroupOfParameterId(parameterId, consFixed);
      })
      .filter((v, i, a) => {
        return (a.indexOf(v) === i)
      });

    // create the dict to have {"parameterGroupId": [array of entries]}
    let obj = {};
    for (let parameterGroupId of parameterGroupIds) {
      obj[parameterGroupId] = [];
    }

    // fill the dict - TODO: optmize this
    for (let parameterGroupId of parameterGroupIds) {
      for (let entry of arr) {
        const parameterId = entry.properties.parameterId
        const curParameterGroupId = consFixedLib.getParameterGroupOfParameterId(parameterId, consFixed);
        if (curParameterGroupId == parameterGroupId) {
          obj[parameterGroupId].push(entry);
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
  // return: Dict with {"parameterGroupId": [timeseries plot arguments]}
  const getPlotArrays = (plotData) => {
    const parameterGroupIds = Object.keys(plotData);

    let obj = {};
    for (let parameterGroupId of parameterGroupIds) {
      obj[parameterGroupId] = [];
    }

    // plot each line in the timeseries plot
    for (let parameterGroupId of parameterGroupIds) {
      for (let entry of plotData[parameterGroupId]) {
        const curParameterId = entry.properties.parameterId
        const curParameterGroupId = consFixedLib.getParameterGroupOfParameterId(curParameterId, consFixed)

        if (curParameterGroupId != parameterGroupId) { continue }

        // TODO: double check if this hard coding is needed
        let [opacity, dash, width] = [null, null, null]
        if (curParameterId.toLowerCase().includes("obs")) {
          [opacity, dash, width] = [1.0, "solid", 3]
        } else {
          [opacity, dash, width] = [0.8, "solid", 1]
        }

        // build plot object
        obj[parameterGroupId].push({
          x: entry.datetime,
          y: entry.value,
          type: "scattergl",
          mode: "lines",
          line: { dash: dash, width: width },
          name: entry.properties.moduleInstanceId,
          yaxis: "y",
          units: entry.properties.units,
          variable: curParameterId,
          opacity: opacity
        });
      }
    }

    return obj;
  }

  // 
  const getPlotThresholdsArrays = (plotData) => {
    let parameterGroupIds = Object.keys(plotData);
    let locationInfo;
    let locationId;

    // 
    let obj = {};
    for (let parameterGroupId of parameterGroupIds) {
      obj[parameterGroupId] = [];
    }

    for (const parameterGroupId of parameterGroupIds) {

      // get basic info about the location
      locationId = plotData[parameterGroupId][0].properties.location_id;
      locationInfo = consFixed.locations.locations.filter((obj) => {
        return obj.locationId === locationId;
      })[0];
      if (!locationInfo.attributes) { continue; }

      for (const locationAttrValDict of locationInfo.attributes) {
        
        // check if it reffers to an upWarningLevel
        const curThreshLevelDict = consFixedLib.getThresholdLevelFromValueFunction(locationAttrValDict.id, consFixed)
        if (!curThreshLevelDict) { continue; }

        // check if this threshold value matches the parameters of the parameter group
        const threshGroupIds = consFixedLib.getThresholdGroupsOfLevelThreshold(curThreshLevelDict.id, consFixed)
        let shouldInclude = false
        for (const curThreshGroupId of threshGroupIds) {
          const curParameterIds = consCacheLib.getParameterIdsByThresholdGroupId(curThreshGroupId, consCache)
          for (const curParameterId of curParameterIds) {
            const curParameterGroupId = consFixedLib.getParameterGroupOfParameterId(curParameterId, consFixed)
            if (curParameterGroupId == parameterGroupId){
              shouldInclude = true
              break
            }
          }
          if (shouldInclude) { break }
        }
        if (!shouldInclude) { continue }
        
        // create plotting attributes
        const thresholdNumber = parseFloat(locationAttrValDict.number)
        obj[parameterGroupId].push({
          x: [
            plotData[parameterGroupId][0].datetime[0],
            plotData[parameterGroupId][0].datetime.slice(-1)[0],
          ],
          y: [thresholdNumber, thresholdNumber],
          legendgroup: "group2",
          type: "scattergl",
          mode: "lines",
          yaxis: "y",
          name: locationAttrValDict.name,
          line: { dash: "dot", color: curThreshLevelDict.upWarningLevelId.color }
        });
      }
    }
    return obj;
  };

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

  const getModelEvaluationMetrics = (timeSerieUrl, plotData, settings) => {
    let variables = Object.keys(plotData);                                      // TODO: the "variables" are "ParameterGroups"
    let metricsUrl = null;
    let metrics = {};
    let filter;
    let simModuleInstanceIds;
    let obsModuleInstanceId;
    let locationId;

    let obj = {};
    for (let variable of variables) {
      obj[variable] = [];
    }

    for (let variable of variables) {
      for (let entry of plotData[variable]) {
        if (entry.properties.parameterId.split(".")[0] == variable) {           // TODO: this should come from ConsFixed
          obj[variable].push(entry.properties.moduleInstanceId);
        }
      }
      obj[variable] = obj[variable].filter((v, i, a) => a.indexOf(v) === i);
    }

    // get basic meta information
    filter = varsStateLib.getContextFilterId(varsState)
    locationId = varsStateLib.getActiveLocation(varsState).locationId

    // get the metric values for each ParameterGroup
    for (let variable of variables) {

      simModuleInstanceIds = plotData[variable]
        .filter((o) => o.properties.parameterId.toLowerCase().includes("sim"))  // TODO: this should come from settings
        .map((entry) => {
          return entry.properties.moduleInstanceId;
        })
        .join(",");

      obsModuleInstanceId = plotData[variable]
        .filter((o) => o.properties.parameterId.toLowerCase().includes("obs"))  // TODO: this should come from settings
        .map((entry) => {
          return entry.properties.moduleInstanceId;
        })
        .join(",");

      // build URL
      metricsUrl = apiUrl(
        settings.apiBaseUrl,
        "v1dw",
        "timeseries_calculator",
        {
          filter: filter,
          calcs: "RMSE,KGE",                  // TODO: remove hard coded
          simParameterId: `${variable}.sim`,  // TODO: remove hard coded
          obsParameterId: `${variable}.obs`,  // TODO: remove hard coded
          simModuleInstanceIds: simModuleInstanceIds,
          obsModuleInstanceId: obsModuleInstanceId,
          locationId: locationId
        }
      );

      if (obsModuleInstanceId.length > 0 && simModuleInstanceIds.length > 0) {
        metrics[variable] = metricsUrl;
      }
    }

    return metrics;
  };

  /* ** MAIN CALL **************************************************************************** */

  //
  const getTimeSeriesData = async () => {
    timeSeriesPlotDataAux = await apiData.map((series) => {
      return rearrangeSeries(series)
    })

    timeSeriesPlotDataAux = reorder(timeSeriesPlotDataAux)

    varsStateLib.setTimeSeriesPlotData(timeSeriesPlotDataAux, varsState)
    setPlotData(timeSeriesPlotDataAux)

    timeSeriesPlotArrayAux = await getPlotArrays(
      varsState.domObjects.timeSeriesData.plotData
    )

    // update states and force re-rendering
    varsStateLib.setTimeSeriesPlotArrays(timeSeriesPlotArrayAux, varsState)
    varsStateLib.setTimeSeriesPlotUnitsVariables(
      getAvailableVariables(timeSeriesPlotDataAux), varsState)
    varsStateLib.setTimeSeriesPlotAvailableVariables(
      getUnitsVariables(timeSeriesPlotDataAux), varsState)
    /*
      setThresholdsArray(getPlotThresholdsArrays(timeSeriesPlotDataAux));
      setModelEvaluationMetricsUrls(
        getModelEvaluationMetricsUrls(timeSerieUrl, timeSeriesPlotDataAux)
      );
    */
    varsStateLib.setTimeSeriesPlotThresholdsArray(
      getPlotThresholdsArrays(timeSeriesPlotDataAux), varsState)
    varsStateLib.setTimeSeriesPlotModelEvaluationMetrics(
      getModelEvaluationMetrics(varsStateLib.getTimeSerieUrl(varsState), timeSeriesPlotDataAux, settings), varsState)

    setVarState(Math.random())
  }

  return null
}

export default LoadTimeSeriesData
