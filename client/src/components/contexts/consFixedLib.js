/*
 * Functions here are used to read the content of consFixed.
 * Whatever is retrieved should NOT be modified.
 */

/* ** PUBLIC FUNCTIONS *********************************************************************** */

//
const getLocationData = (locationId, consFixed) => {
  for (const curLocation of consFixed.locations.locations) {
    if (curLocation.locationId === locationId) { return (curLocation) }
  }
  return (null)
}

//
const getParameterIdsFromParameterGroup = (parameterGroup, consFixed) => {
  const parameterGroupSet = new Set()
  for (const curParameter of consFixed.timeSeriesParameters) {
    if (curParameter.parameterGroup === parameterGroup) { continue }
    parameterGroupSet.add(curParameter.id)
  }
  return parameterGroupSet
}

// 
const getParameterGroupOfParameterId = (parameterId, consFixed) => {
  return consFixed.parameters[parameterId].parameterGroup
}

// 
const getThresholdGroupData = (thresholdGroupId, consFixed) => {
  return consFixed.thresholdGroup[thresholdGroupId]
}

// 
const getThresholdGroupBaseIcons = (thresholdGroupId, settings) => {
  return settings.thresholdGroups[thresholdGroupId]
}

// 
const getThresholdGroupsOfLevelThreshold = (levelThreshold, consFixed) => {
  const thresholdGroups = new Set()
  for (const [curId, curThreshGroup] of Object.entries(consFixed.thresholdGroup)) {
    for (const curThreshLevel of curThreshGroup.threshold_levels) {
      if (curThreshLevel.id == levelThreshold) { 
        thresholdGroups.add(curId)
        break
      }
    }
  }
  return thresholdGroups
}

// 
const getThresholdGroupsOfLevelThresholds = (levelThresholds, consFixed) => {
  let retThresholdGroups = new Set()
  for (const curLevelThesh of Array.from(levelThresholds)) {
    let curThreshGroup = getThresholdGroupsOfLevelThreshold(curLevelThesh, consFixed)
    retThresholdGroups = new Set([...retThresholdGroups, ...curThreshGroup])
  }
  return retThresholdGroups
}

// 
const getThresholdLevelData = (thresholdLevelId, consFixed) => {
  
  for (const [curThreshValueSetId, curThreshLevels] of 
                                                  Object.entries(consFixed.thresholdValueSets)) {
    for (const curThreshLevel of curThreshLevels.levelThresholdValues) {
      if (curThreshLevel.levelThresholdId === thresholdLevelId) {
        return curThreshLevel
      }
    }
  }
  return null
}

/* ** NAMESPACE ****************************************************************************** */

// aggregate all public functions into a single namespace
const consFixedLib = {
  getLocationData: getLocationData,
  getParameterGroupOfParameterId: getParameterGroupOfParameterId,
  getThresholdGroupBaseIcons: getThresholdGroupBaseIcons,
  getThresholdGroupData: getThresholdGroupData,
  getThresholdGroupsOfLevelThreshold: getThresholdGroupsOfLevelThreshold,
  getThresholdGroupsOfLevelThresholds: getThresholdGroupsOfLevelThresholds,
  getThresholdLevelData: getThresholdLevelData
}

export default consFixedLib
