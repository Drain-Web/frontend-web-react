import { createContext } from 'react'

const constraintLocationsShownByParameters = (newMapLocationsContextData) => {
  const newData = { ...newMapLocationsContextData }
  if ((!newData.showParametersLocations) || (!newData.showParametersLocations.size)) {
    return newMapLocationsContextData
  }

  // Object.entries(newData.showParametersLocations)
  for (const paramId of newData.showParametersLocations.values()) {
    for (const ts of newData.byParameter[paramId]) {
      if (ts.locationId in newData.byLocations) {
        newData.byLocations[ts.locationId].show = true
      }
    }
  }

  return (newData)
}

const showThresholdValueSetsBySelectedParameters = (newMapLocationsContextData) => {
  const newData = { ...newMapLocationsContextData }
  
  // if there is no selected parameters, show all thresh value sets
  if ((!newData.showParametersLocations) || (!newData.showParametersLocations.size)) {
    Object.keys(newData.byThresholdValueSet).map((threshValueSetId) => {
      newData.byThresholdValueSet[threshValueSetId].showAsOption = true
    })
    return (newData)
  } 
  
  // if there are parameters selected, only show the ones to which there is a timeseries associated
  Object.keys(newData.byThresholdValueSet).map((threshValueSetId) => {
    // check if any timeseries has this threshValueSet
    let anyTimeseries = false
    for (const curTimeseries of newData.byThresholdValueSet[threshValueSetId].timeseries) {
      if (newData.showParametersLocations.has(curTimeseries.parameterId)) {
        anyTimeseries = true
        break
      }
    }
    newData.byThresholdValueSet[threshValueSetId].showAsOption = anyTimeseries
  })
  return (newData)
}

const reviewMapLocationsContextData = (newMapLocationsContextData) => {
  /* This function should be called before any call for setMapLocationsContextData() */
  const newData = { ...newMapLocationsContextData }

  // updating byLocations.show attributes
  if ((!newData.showParametersLocations) || (!newData.showParametersLocations.size)) {
    // if no 'showParametersLocations' is set, all locations are shown
    for (const locationId of Object.keys(newData.byLocations)) {
      newData.byLocations[locationId].show = true
    }
  } else {
    // if 'showParametersLocations', hide all and only show the ones in 'showParametersLocations'
    for (const locationId of Object.keys(newData.byLocations)) {
      newData.byLocations[locationId].show = false
    }
    // Object.entries(newData.showParametersLocations)
    for (const paramId of newData.showParametersLocations.values()) {
      for (const ts of newData.byParameter[paramId]) {
        if (ts.locationId in newData.byLocations) {
          newData.byLocations[ts.locationId].show = true
        }
      }
    }
  }

  return (newData)
}

const MapLocationsContext = createContext({
  /* mapLocationsContextData:
   *  filterId: str. Id of the current selected filter
   *  thresholdValueSet: str. Id of the current selected thresholdValueSet
   *  showParametersLocations: set with parameter ids.
   *   E.g. {'Q.obs', 'Q.sim', ...}
   *  byLocations: dict as
   *   {
   *     locationId: {
   *       timeseries: {
   *         parameterId: set{timeseriesId}
   *       }[{timeseriesId: int, timeseriesId: int, ...],
   *       show: bool
   *     }
   *   }
   *  byParameter: dict as
   *   {
   *     parameterId:
   *       [{timeseriesId: int, locationId: str}, ...]
   *   }
   *  byThresholdValueSet: dict as
   *   {
   *     thresholdValueSetId: {
   *       timeseries: [{timeseriesId: int, locationId: str, iconUrl: str, parameterId: str}, ...],
   *       showAsOption: bool
   *     }
   *   }
   */
  mapLocationsContextData: {
    filterId: null,
    thresholdValueSet: null,
    showParametersLocations: new Set(),
    byLocations: {},
    byParameter: {},
    byThresholdValueSet: {}
  },
  setMapLocationsContextData: (filter) => {}
})

export default MapLocationsContext
export { reviewMapLocationsContextData, constraintLocationsShownByParameters, 
  showThresholdValueSetsBySelectedParameters }
