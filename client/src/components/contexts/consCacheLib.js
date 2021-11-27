import consFixedLib from './consFixedLib'

/*
 * Functions here are used to read/write the content of consCache.
 */

/* ** PUBLIC FUNCTIONS *********************************************************************** */

//
const addUrlRequested = (url, consCache) => {
  consCache.requestedUrls.add(url)
}

//
const associateTimeseriesIdAndFilterId = (timeseriesId, filterId, consCache) => {
  _addToIndex('timeseriesIdsByFilterId', filterId, timeseriesId, consCache)
}

//
const getEvaluationLastRequestUrl = (consCache) => {
  return consCache.indexes.evaluationResponseData._lastUrlRequested_
}

//
const getEvaluationLastResponseData = (consCache) => {
  const lastUrl = getEvaluationLastRequestUrl(consCache)
  return getEvaluationResponseData(lastUrl, consCache)
}

//
const getEvaluationResponseData = (requestUrl, consCache) => {
  return consCache.indexes.evaluationResponseData[requestUrl]
}

//
const getLocationIdOfTimeseriesId = (timeseriesId, consCache) => {
  return consCache.indexes.locationIdByTimeseriesId[timeseriesId]
}

//
const getModuleInstancesOfThreshouldGroup = (threshouldGroupId, consCache) => {
  return consCache.indexes.moduleInstanceIdsByThresholdGroupId[threshouldGroupId]
}

// 
const getParameterIdsByThresholdGroupId = (threshouldGroupId, consCache) => {
  return consCache.indexes.parameterIdsByThresholdGroupId[threshouldGroupId]
}

//
const getTimeseriesData = (timeseriesId, consCache) => {
  return consCache.data.timeseries[timeseriesId]
}

//
const getTimeseriesIdsInFilterId = (filterId, consCache) => {
  return consCache.indexes.timeseriesIdsByFilterId[filterId]
}

// Just saves the return from API as-is
// TODO: make a more decent processing
// TODO: document ''
const storeEvaluationResponseData = (requestUrl, responseData, consCache) => {
  _setToIndex('evaluationResponseData', requestUrl, responseData, consCache)
  _setToIndex('evaluationResponseData', '_lastUrlRequested_', requestUrl, consCache)
}

//
const storeTimeseriesData = (tsData, consCache, consFixed) => {
  // add indexes
  _addToIndex('timeseriesIdsByLocationId', tsData.header.location_id, tsData.id, consCache)
  _addToIndex('timeseriesIdsByParameterId', tsData.header.parameterId, tsData.id, consCache)
  _setToIndex('locationIdByTimeseriesId', tsData.id, tsData.header.location_id, consCache)
  
  // get threshold levels out of the timeseries
  const threshLevelIds = _getThresholdLevelsFromTimeseries(tsData)

  // find the threshold groups of the thresh levels
  const threshGroups = consFixedLib.getThresholdGroupsOfLevelThresholds(threshLevelIds, 
                                                                        consFixed)

  // save the pairs ThreshGroup -> set(parameterGroup)
  for (const curThreshGroup of Array.from(threshGroups)) {
    _addToIndex('moduleInstanceIdsByThresholdGroupId', curThreshGroup, 
                tsData.header.moduleInstanceId, consCache)
    _addToIndex('parameterIdsByThresholdGroupId', curThreshGroup,
                tsData.header.parameterId, consCache)
  }

  // add data
  if (!consCache.data.timeseries[tsData.id]) {
    consCache.data.timeseries[tsData.id] = tsData
  } else {
    _dictToDict(tsData, consCache.data.timeseries[tsData.id])
  }
}

// only checks if a given URL was already requested
const wasUrlRequested = (url, consCache) => { return consCache.requestedUrls.has(url) }

/* ** PRIVATE FUNCTIONS ********************************************************************** */

// Adds val (value) to an index (idx) key, creating such index if needed
const _addToIndex = (idx, key, val, consCache) => {
  const idxs = consCache.indexes[idx]
  if (key in idxs) { idxs[key].add(val) } else { idxs[key] = new Set([val]) }
}

// Just get all levelThresholdValues of a timeseries (ts) in a Set
const _getThresholdLevelsFromTimeseries = (ts) => {
  const threshSets = ts.thresholdValueSets
  const threshSetIds = new Set()
  for (const curThreshSet of threshSets) {
    for (const curLevelThreshVal of curThreshSet.levelThresholdValues) {
      threshSetIds.add(curLevelThreshVal.levelThresholdId)
    }
  }
  return threshSetIds
}

//
const _setToIndex = (idx, key, val, consCache) => {
  consCache.indexes[idx][key] = val
}

// Copy all the content in fD (fromDictionary) to tD (toDictionary)
const _dictToDict = (fD, tD) => { for (const key in fD) { tD[key] = fD[key] } }

/* ** NAMESPACE ****************************************************************************** */

// aggregate all public functions into a single namespace
const consCacheLib = {
  addUrlRequested: addUrlRequested,
  associateTimeseriesIdAndFilterId: associateTimeseriesIdAndFilterId,
  getEvaluationLastRequestUrl: getEvaluationLastRequestUrl,
  getEvaluationLastResponseData: getEvaluationLastResponseData,
  getEvaluationResponseData: getEvaluationResponseData,
  getLocationIdOfTimeseriesId: getLocationIdOfTimeseriesId,
  getModuleInstancesOfThreshouldGroup: getModuleInstancesOfThreshouldGroup,
  getParameterIdsByThresholdGroupId: getParameterIdsByThresholdGroupId,
  getTimeseriesData: getTimeseriesData,
  getTimeseriesIdsInFilterId: getTimeseriesIdsInFilterId,
  storeEvaluationResponseData: storeEvaluationResponseData,
  storeTimeseriesData: storeTimeseriesData,
  wasUrlRequested: wasUrlRequested
}

export default consCacheLib
