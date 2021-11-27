import { createContext } from 'react'

/*
 * ConsCache should only be changed using functions from consCacheLib.js for consistency.
 */

const ConsCache = createContext({
  consCache: {
    requestedUrls: new Set(),
    indexes: {
      evaluationResponseData: {},               // TODO: document it!
      locationIdByTimeseriesId: {},
      moduleInstanceIdsByThresholdGroupId: {},  // TODO: document it!
      parameterIdsByThresholdGroupId: {},       // TODO: document it!
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
