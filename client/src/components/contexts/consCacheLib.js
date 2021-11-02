/*
 * Functions here are used to read/write the content of consCache.
 */

/* ** PUBLIC FUNCTIONS *********************************************************************** */

// 
const addUrlRequested = (url, consCache) => {
  consCache['requestedUrls'].add(url)
}

// 
const associateTimeseriesIdAndFilterId = (timeseriesId, filterId, consCache) => {
  _addToIndex('timeseriesIdsByFilterIds', filterId, timeseriesId, consCache)
}

// 
const getEmptyStructure = () => {
  return {
    requestedUrls: new Set(),
    indexes: {
      timeseriesIdsByFilterIds: {},
      timeseriesIdsByLocationIds: {},
      timeseriesIdsByParameterIds: {}
    },
    data: {
      timeseries: {}
    }
  }
}

// 
const getTimeseriesIdsInFilterId = (filterId, consCache) => {
  return consCache['indexes']['timeseriesIdsByFilterIds'][filterId]
}

// 
const storeTimeseriesData = (tsData, consCache) => {
  // add indexes
  _addToIndex('timeseriesIdsByLocationIds', tsData.header.location_id, tsData.id, consCache)
  _addToIndex('timeseriesIdsByParameterIds', tsData.header.parameterId, tsData.id, consCache)

  // add data
  if (!consCache['data']['timeseries'][tsData.id]) {
    consCache['data']['timeseries'][tsData.id] = tsData
  } else {
    _dictToDict(tsData, consCache['data']['timeseries'][tsData.id])
  }
}

// only checks if a given URL was already requested
const wasUrlRequested = (url, consCache) => {
  return (url in consCache['requestedUrls'])
}

/* ** PRIVATE FUNCTIONS ********************************************************************** */

// Adds val (value) to an index (idx) key, creating such index if needed
const _addToIndex = (idx, key, val, consCache) => {
  const idxs = consCache['indexes'][idx]
  if (key in idxs) { idxs[key].add(val) } else { idxs[key] = new Set([val]) }
}

// Copy all the content in fD (fromDictionary) to tD (toDictionary)
const _dictToDict = (fD, tD) => { for (const key in fD) { tD[key] = fD[key] } }

/* ** NAMESPACE ****************************************************************************** */

// aggregate all public functions into a single namespace
const consCacheLib = {
  "addUrlRequested": addUrlRequested,
  "associateTimeseriesIdAndFilterId": associateTimeseriesIdAndFilterId,
  "getEmptyStructure": getEmptyStructure,
  "getTimeseriesIdsInFilterId": getTimeseriesIdsInFilterId,
  "storeTimeseriesData": storeTimeseriesData,
  "wasUrlRequested": wasUrlRequested
}

export default consCacheLib
