import React, { useContext } from "react"
import axios from "axios"
import useSWR from "swr"

//
import atsVarStateLib from "../components/atoms/atsVarStateLib.js";

// import contexts
import ConsFixed from '../components/contexts/ConsFixed.js'

// import libs
import { apiUrl } from "./api.js"

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

/* ** TODO: temp code ON *********************************************************************** */

// Given an array of size L1 and a size L2, L2 > L1, creates a new array of size L2 interpolated
// param data: Array of size L1
// param fitCount: L2, integer
// FROM: https://stackoverflow.com/questions/26941168/javascript-interpolate-an-array-of-numbers
const interpolateArray = (data, fitCount) => {

  const linearInterpolate = (before, after, atPoint) => {
    return before + (after - before) * atPoint;
  }

  const newData = new Array();
  const springFactor = new Number((data.length - 1) / (fitCount - 1));
  newData[0] = data[0]; // for new allocation
  for (let i = 1; i < fitCount - 1; i++) {
    const tmp = i * springFactor;
    const before = new Number(Math.floor(tmp)).toFixed();
    const after = new Number(Math.ceil(tmp)).toFixed();
    const atPoint = tmp - before;
    newData[i] = linearInterpolate(data[before], data[after], atPoint);
  }
  newData[fitCount - 1] = data[data.length - 1]; // for new allocation
  return newData;
};


// TODO: test this one
// 
// 
// return: new dictionary with same keys
const interpolateAllArraysInDict = (arrayObj, newLength) => {
  const retDict = {}

  for (const [key, originalValues] of Object.entries(arrayObj)) {
    retDict[key] = interpolateArray(originalValues, newLength)
  }

  return retDict
}

/* ** TODO: temp code OFF ********************************************************************** */


const loadConsFixed = (settings) => {
  /* ** CONS *********************************************************************************** */
  // TODO: temp code
  const NETWORK_TIMESERIES_MATRIX_URL = "https://wb-trca-api.herokuapp.com/netflow_server/waves1_24hrs"

  /* ** SET HOOKS ****************************************************************************** */

  const { consFixed } = useContext(ConsFixed)

  // Fetched states
  const regionData = consFixed['region']
  const boundariesData = consFixed['boundaries']
  const filtersData = consFixed['filters']
  const locationsData = consFixed['locations']
  const locationSetsData = consFixed['locationSets']
  const parametersData = consFixed['parameters']
  const parameterGroupsData = consFixed['parameterGroups']
  const threshValSetsData = consFixed['thresholdValueSets']
  const thresholdGroupsData = consFixed['thresholdGroup']

  // load region data
  const { data: dataRegion, error: errorRegion } = useSWR(
    apiUrl(settings.apiBaseUrl, "v1", "region"), fetcher
  );
  if (dataRegion && !errorRegion && !Object.keys(regionData).length) {
    for (const i in dataRegion) {
      regionData[i] = dataRegion[i];
    }
  }

  // request boundaries data -> store in const 'boundariesData'
  const { data: dataBounds, error: errorBounds } = useSWR(
    apiUrl(settings.apiBaseUrl, "v1dw", "boundaries"), fetcher
  );
  if (dataBounds && !errorBounds && !boundariesData.length) {
    for (const i in dataBounds) {
      boundariesData.push(dataBounds[i]);
    }
  }

  // request filters data -> store in 'filtersData'
  const { data: dataFilters, error: errorFilters } = useSWR(
    apiUrl(settings.apiBaseUrl, "v1", "filters"), fetcher
  );
  if (dataFilters && !errorFilters && !filtersData.length) {
    for (const i in dataFilters) {
      filtersData.push(dataFilters[i]);
    }
  }

  // request location data -> store in const 'locationsData'
  const { data: dataLocations, error: errorLocations } = useSWR(
    apiUrl(settings.apiBaseUrl, "v1dw", "locations", {
      showPolygon: true,
      showAttributes: true,
    }),
    fetcher
  );
  if (dataLocations && !errorLocations && !Object.keys(locationsData).length) {
    for (const i in dataLocations) {
      locationsData[i] = dataLocations[i];
    }
  }

  // request location set data
  const { data: dataLocationSets, error: errorLocationSets } = useSWR(
    apiUrl(settings.apiBaseUrl, "v1dw", "location_sets", {
      showPolygon: true,
      showAttributes: true,
    }),
    fetcher
  );
  if (dataLocationSets && !errorLocationSets && !locationSetsData.length) {
    for (const i in dataLocationSets.locationSets) {
      locationSetsData.push(dataLocationSets.locationSets[i])
    }
  }

  // load parameters
  const { data: dataParameters, error: errorParameters } = useSWR(
    apiUrl(settings.apiBaseUrl, "v1", "parameters/"), fetcher
  );
  if (dataParameters && !errorParameters) {
    for (const prm of dataParameters.timeSeriesParameters) {
      parametersData[prm.id] = prm;
    }
  }

  // load parameter groups
  const { data: dataParameterGroups, error: errorParameterGroups } = useSWR(
    apiUrl(settings.apiBaseUrl, "v1dw", "parameter_groups/"), fetcher
  );
  if (dataParameterGroups && !errorParameterGroups) {
    for (const prgr of dataParameterGroups.parameterGroups) {
      parameterGroupsData[prgr.id] = prgr;
    }
  }

  // load threshold value sets
  const { data: dataThreshValSets, error: errorThreshValSets } =
    useSWR(
      apiUrl(settings.apiBaseUrl, "v1dw", "threshold_value_sets"), fetcher
    );
  if (dataThreshValSets && !errorThreshValSets) {
    for (const tg in dataThreshValSets.thresholdValueSets) {
      const curObj = { ...dataThreshValSets.thresholdValueSets[tg] };
      const curObjId = curObj.id;
      delete curObj.id;
      threshValSetsData[curObjId] = curObj;
    }
  }

  // load threshold groups
  const { data: dataThresholdGroups, error: errorThreshGroups } = useSWR(
    apiUrl(settings.apiBaseUrl, "v1dw", "threshold_groups"), fetcher
  );
  if (dataThresholdGroups && !errorThreshGroups) {
    for (const tg of dataThresholdGroups.thresholdGroups) {
      thresholdGroupsData[tg.id] = tg;
    }
  }

  // TODO: temp code
  // load network timeseries matrix
  const { data: dataNetworkTimeseriesMatrix, error: errorNetworkTimeseriesMatrix } = useSWR(
    NETWORK_TIMESERIES_MATRIX_URL, fetcher
  )
  if (dataNetworkTimeseriesMatrix && !errorNetworkTimeseriesMatrix) {

    // get all the timeseries in hourly resolution
    consFixed.networkTimeseriesMatrix['01h'] = dataNetworkTimeseriesMatrix
    consFixed.networkTimeseriesMatrix['30m'] = interpolateAllArraysInDict(dataNetworkTimeseriesMatrix, 48)
    consFixed.networkTimeseriesMatrix['15m'] = interpolateAllArraysInDict(dataNetworkTimeseriesMatrix, 96)

  }

  // TODO: consider errorMessages
  consFixed.loaded = (!isStillLoadingConsFixed(consFixed))
  return consFixed
}

//
const isStillLoadingConsFixedValue = (value) => {
  if (!value) {
    return true
  } else if (Array.isArray(value) && (value.length === 0)) {
    return true
  } else if ((value.constructor === Object) && (Object.keys(value).length === 0)) {
    return true
  } else if (!value) {
    return true
  } else {
    return false
  }
}

//
const isStillLoadingConsFixed = (consFixed) => {
  let allLoaded = true
  for (const k in consFixed) {
    if (k === "loaded") { continue }
    allLoaded = isStillLoadingConsFixedValue(consFixed[k]) ? false : allLoaded
  }
  return !allLoaded
}

// Uses Recoil atoms
const setAtVarStateLocation = (consFixed, settings, atomVarStateLocations) => {

  if (Object.keys(atomVarStateLocations).length != 0) { return false }
  if (Object.keys(consFixed.locations).length == 0) { return false }

  const locationIds = consFixed.locations.locations.map(loc => loc['locationId']);

  atsVarStateLib.addLocations(locationIds, settings['generalLocationIcon'], true,
    atomVarStateLocations);
  return true
}

// Updates the values of the atoms to match content of consFixed.
// Should not be called frequently.
const setAtsStartingValues = (consFixed, settings, atomVarStateContext,
  atomVarStateDomTimeSeriesData,
  atomVarStateDomMainMenuControl) => {
  if (atomVarStateContext.filterId) { return false }
  // if (!consFixed.region.defaultFilter) { return false }

  atsVarStateLib.setContextFilterId(consFixed.region.defaultFilter, atomVarStateContext,
    atomVarStateDomTimeSeriesData)

  if (!settings.startingTab) {
    atsVarStateLib.setMainMenuControlActiveTabAsFilters(atomVarStateDomMainMenuControl)
  } else {
    atsVarStateLib.setMainMenuControlActiveTab(settings.startingTab,
      atomVarStateDomMainMenuControl)
  }

  atsVarStateLib.setContextIcons('uniform', {}, atomVarStateContext)

  return true
}

//
const appLoad = {
  "isStillLoadingConsFixed": isStillLoadingConsFixed,
  "isStillLoadingConsFixedValue": isStillLoadingConsFixedValue,
  "loadConsFixed": loadConsFixed,
  setAtVarStateLocation: setAtVarStateLocation,
  setAtsStartingValues: setAtsStartingValues
}

export default appLoad
