import { createContext } from 'react'

const MapLocationsContext = createContext({
  mapLocationsContextData: {
    filterId: null,
    byLocations: {},
    byParameter: {},
    showParametersLocations: new Set()
  },
  setMapLocationsContextData: (filter) => {}
})

export default MapLocationsContext
