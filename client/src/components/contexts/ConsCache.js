import { createContext } from 'react'

/*
 * ConsCache should only be changed using functions from consCacheLib.js for consistency.
 */

const ConsCache = createContext({
  consCache: {
    requestedUrls: new Set(),
    indexes: {
      evaluationResponseData: {}, // TODO: document it!
      locationIdByTimeseriesId: {},
      timeseriesIdsByFilterId: {},
      timeseriesIdsByLocationId: {},
      timeseriesIdsByParameterId: {}
    },
    data: {
      timeseries: {}
    }
  }
})

export default ConsCache
