import { createContext } from 'react'

const ConsCache = createContext({
  byFilter: {}  // dictionary with "filterId" -> {location: set(timeseriesIds)}
})

export default ConsCache
