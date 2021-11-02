import { createContext } from 'react'

/*
 * ConsCache should only be changed using functions from consCacheLib.js for consistency.
 */

const ConsCache = createContext({
  requestedUrls: new Set(),
  indexes: {
    timeseriesIdsByFilterIds: {},
    timeseriesIdsByLocationIds: {},
    timeseriesIdsByParameterIds: {}
  },
  data: {
    timeseries: {}
  }
})

export default ConsCache
