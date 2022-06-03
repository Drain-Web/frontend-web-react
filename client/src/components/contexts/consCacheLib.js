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
const getAlertIconAndColor = () => {
  
}

//
const getCompetitionLastRequestUrl = (consCache) => {
  return consCache.indexes.competitionResponseData._lastUrlRequested_
}

//
const getCompetitionLastResponseData = (consCache) => {
  const lastUrl = getCompetitionLastRequestUrl(consCache)
  return getCompetitionResponseData(lastUrl, consCache)
}

//
const getCompetitionResponseData = (requestUrl, consCache) => {
  return consCache.indexes.competitionResponseData[requestUrl]
}

// 
const getEvaluationIconAndColor = (metric, parameterGroupId, value, settings) => {
  const iconMetricSettings = settings.locationIconsOptions.evaluation.options[metric]
  const iconParameterGroupSettings = iconMetricSettings.parameterGroups[parameterGroupId]

  // find a thresnold not exceeded
  for (let [rangeIndex, rangeValue] of iconParameterGroupSettings.ranges.entries()) {
    if (!rangeValue) { continue }
    if (rangeValue > value) {
      return [iconParameterGroupSettings.icons[rangeIndex-1], 
              iconParameterGroupSettings.colors[rangeIndex-1]]
    }
  }

  // if not found and last value is null, return last color/icon, or [null, null] otherwise
  if (!iconParameterGroupSettings.ranges.slice(-1)[0]) {
    const lastIdx = iconParameterGroupSettings.icons.length
    return [iconParameterGroupSettings.icons[lastIdx], 
            iconParameterGroupSettings.colors[lastIdx]]
  } else {
    return [null, null]
  }
}

//
const getEvaluationsLastRequestUrl = (consCache) => {
  return consCache.indexes.evaluationsResponseData._lastUrlRequested_
}

//
const setEvaluationsLastRequestUrl = (requestUrl, consCache) => {
  _setToIndex('evaluationsResponseData', '_lastUrlRequested_', requestUrl, consCache)
}

//
const getEvaluationsLastResponseData = (consCache) => {
  const lastUrl = getEvaluationsLastRequestUrl(consCache)
  return getEvaluationsResponseData(lastUrl, consCache)
}

//
const getEvaluationsResponseData = (requestUrl, consCache) => {
  return consCache.indexes.evaluationsResponseData[requestUrl]
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
  console.log("Looking for", threshouldGroupId, "in", JSON.stringify(consCache.indexes.moduleInstanceIdsByThresholdGroupId))
  return consCache.indexes.moduleInstanceIdsByThresholdGroupId[threshouldGroupId]
}

const getModuleInstancesWithParameter = (parameterId, consCache) => {
  return consCache.indexes.moduleInstanceIdsByParameterId[parameterId]
}

const getModuleInstancesWithParameterGroup = (parameterGroupId, consCache) => {
  return consCache.indexes.moduleInstanceIdsByParameterGroupId[parameterGroupId]
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
const storeCompetitionResponseData = (requestUrl, responseData, consCache) => {
  _setToIndex('competitionResponseData', requestUrl, responseData, consCache)
  _setToIndex('competitionResponseData', '_lastUrlRequested_', requestUrl, consCache)
}

// Just saves the return from API as-is
// TODO: make a more decent processing
const storeEvaluationsResponseData = (requestUrl, responseData, consCache) => {
  _setToIndex('evaluationsResponseData', requestUrl, responseData, consCache)
  setEvaluationsLastRequestUrl(requestUrl, consCache)
}

// Just saves the return from API as-is
// TODO: make a more decent processing
const storeEvaluationResponseData = (requestUrl, responseData, consCache) => {
  _setToIndex('evaluationResponseData', requestUrl, responseData, consCache)
  _setToIndex('evaluationResponseData', '_lastUrlRequested_', requestUrl, consCache)
}

//
const storeTimeseriesData = (tsData, consCache, consFixed) => {
  console.log("Storing timeseries data...")

  // add indexes
  _addToIndex('timeseriesIdsByLocationId', tsData.header.location_id, tsData.id, consCache)
  _addToIndex('timeseriesIdsByParameterId', tsData.header.parameterId, tsData.id, consCache)
  _addToIndex('moduleInstanceIdsByParameterId', tsData.header.parameterId, 
    tsData.header.moduleInstanceId, consCache)
  _addToIndex('moduleInstanceIdsByParameterGroupId', 
              consFixedLib.getParameterGroupOfParameterId(tsData.header.parameterId, consFixed),
              tsData.header.moduleInstanceId, consCache)
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
  getCompetitionLastResponseData: getCompetitionLastResponseData,
  getEvaluationIconAndColor: getEvaluationIconAndColor,
  getEvaluationLastRequestUrl: getEvaluationLastRequestUrl,
  getEvaluationLastResponseData: getEvaluationLastResponseData,
  getEvaluationResponseData: getEvaluationResponseData,
  getEvaluationsLastRequestUrl: getEvaluationsLastRequestUrl,
  setEvaluationsLastRequestUrl: setEvaluationsLastRequestUrl,
  getEvaluationsLastResponseData: getEvaluationsLastResponseData,
  getEvaluationsResponseData: getEvaluationsResponseData,
  getLocationIdOfTimeseriesId: getLocationIdOfTimeseriesId,
  getModuleInstancesOfThreshouldGroup: getModuleInstancesOfThreshouldGroup,
  getModuleInstancesWithParameterGroup: getModuleInstancesWithParameterGroup,
  getModuleInstancesWithParameter: getModuleInstancesWithParameter,
  getParameterIdsByThresholdGroupId: getParameterIdsByThresholdGroupId,
  getTimeseriesData: getTimeseriesData,
  getTimeseriesIdsInFilterId: getTimeseriesIdsInFilterId,
  storeCompetitionResponseData: storeCompetitionResponseData,
  storeEvaluationsResponseData: storeEvaluationsResponseData,
  storeEvaluationResponseData: storeEvaluationResponseData,
  storeTimeseriesData: storeTimeseriesData,
  wasUrlRequested: wasUrlRequested
}

export default consCacheLib
