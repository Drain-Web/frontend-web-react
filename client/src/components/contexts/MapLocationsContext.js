import { createContext } from 'react'

const MapLocationsContext = createContext({
  mapLocationsContextData: {
    filterId: null,
    byLocations: {},
    byParameter: {}
  },
  setMapLocationsContextData: (filter) => {}
})

export default MapLocationsContext
