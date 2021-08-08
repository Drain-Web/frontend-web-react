import { createContext } from 'react'

const MapLocationsContext = createContext({
  mapLocationsContextData: {
    byLocations: null,
    byDataType: null
  },
  setMapLocationsContextData: (filter) => {}
})

export default MapLocationsContext
