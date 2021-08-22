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
   *  showParametersLocations: set with parameter ids.
   *   E.g. {'Q.obs', 'Q.sim', ...}
   */
  mapLocationsContextData: {
    filterId: null,
    byLocations: {},
    byParameter: {},
    showParametersLocations: new Set()
  },
  setMapLocationsContextData: (filter) => {}
})

export default MapLocationsContext
export { reviewMapLocationsContextData, constraintLocationsShownByParameters }
