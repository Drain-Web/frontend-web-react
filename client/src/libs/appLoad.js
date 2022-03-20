import React, { useContext, useState } from "react"
import axios from "axios"
import useSWR from "swr"

// import contexts
import ConsFixed from '../components/contexts/ConsFixed.js'

// import libs
import varsStateLib from "../components/contexts/varsStateLib.js"
import { apiUrl } from "./api.js"

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);


const loadConsFixed = ( settings ) => {
  /* ** SET HOOKS ****************************************************************************** */
  
  const { consFixed } = useContext(ConsFixed)

  // Fetched states
  const regionData = consFixed['region']
  const boundariesData = consFixed['boundaries']
  const filtersData = consFixed['filters']
  const locationsData = consFixed['locations']
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

  // TODO: consider errorMessages

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
    allLoaded = isStillLoadingConsFixedValue(consFixed[k]) ? false : allLoaded
  }
  return !allLoaded
}

//
const setVarsStateLocations = (consFixed, settings, varsState) => {
  if (Object.keys(varsState.locations).length != 0) { return false }

  const locationIds = consFixed['locations']['locations'].map(loc => loc['locationId']);
  varsStateLib.addLocations(locationIds, settings.generalLocationIcon, true, varsState);
  return true
}

//
const setVarsStateContext = (consFixed, settings, varsState) => {
  if (varsState.context.filterId) { return false }

  varsStateLib.setContextFilterId(consFixed.region.defaultFilter, varsState)

  if (!settings.startingTab) {
    varsStateLib.setMainMenuControlActiveTabAsFilters(varsState)
    console.log('~Setting active tab as filter')
  } else {
    varsStateLib.setMainMenuControlActiveTab(settings.startingTab, varsState)
    console.log('~Setting active tab as:', settings.startingTab)
  }

  varsStateLib.setContextIcons('uniform', {}, varsState)
  return true
}

//
const appLoad = {
  "isStillLoadingConsFixed": isStillLoadingConsFixed,
  "isStillLoadingConsFixedValue": isStillLoadingConsFixedValue,
  "loadConsFixed": loadConsFixed,
  "setVarsStateLocations": setVarsStateLocations,
  "setVarsStateContext": setVarsStateContext
}

export default appLoad
