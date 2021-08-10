import { createContext } from 'react'

const MapLocationsContext = createContext({
  mapLocationsContextData: {
    byLocations: {},
    byParameter: {}
  },
  setMapLocationsContextData: (filter) => {}
})

export default MapLocationsContext
