import { useState } from "react"
import axios from "axios"
import useSWR from "swr"

// import libs
import { apiUrl } from "./api.js";

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

//
const dataOrNull = (data, error) => (data && !error) ? data : null

const loadConsFixed = ( settings ) => {
  /* ** SET HOOKS ****************************************************************************** */
  
  // Fetched states
  const regionData = useState({})[0]
  const boundariesData = useState([])[0]
  const filtersData = useState([])[0]
  const locationsData = useState({})[0]
  const parametersData = useState({})[0]
  const parameterGroupsData = useState({})[0]
  const threshValSetsData = useState({})[0]
  const thresholdGroupsData = useState({})[0]

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
  return {
    region: dataOrNull(regionData, errorRegion),
    boundaries: dataOrNull(boundariesData, errorBounds),
    filters: dataOrNull(filtersData, errorFilters),
    locations: dataOrNull(locationsData, errorLocations),
    parameters: dataOrNull(parametersData, errorLocations),
    parameterGroups: dataOrNull(parameterGroupsData, errorParameterGroups),
    thresholdValueSets: dataOrNull(threshValSetsData, errorThreshValSets),
    thresholdGroup: dataOrNull(thresholdGroupsData, errorThreshGroups)
  }

}


const isStillLoadingConsFixed = (consFixed) => {
  let allLoaded = true
  for (const k in consFixed) {
    if (!consFixed[k]) {
      allLoaded = false
    } else if (Array.isArray(consFixed[k]) && (consFixed[k].length == 0)) {
      allLoaded = false
    } else if ((consFixed[k].constructor == Object) && (Object.keys(consFixed[k]).length == 0)) {
      allLoaded = false
    } else if (!consFixed[k]) {
      allLoaded = false
    }
  }
  return !allLoaded
}

export { loadConsFixed, isStillLoadingConsFixed }
