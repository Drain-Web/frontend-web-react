/*
 * Functions here are used to read the content of consFixed.
 * Whatever is retrieved should NOT be modified.
 */

/* ** PUBLIC FUNCTIONS *********************************************************************** */

//
const getFilterData = (filterId, consFixed) => {
  for (const curFilter of consFixed.filters) {
    if (curFilter.id === filterId) { return (curFilter) }
  }
  return (null)
}

//
const getLocationData = (locationId, consFixed) => {
  const lowerLocationId = locationId.toLowerCase()
  for (const curLocation of consFixed.locations.locations) {
    if (curLocation.locationId.toLowerCase() === lowerLocationId) {
      return (curLocation)
    }
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
const getRegionData = (consFixed) => {
  return consFixed.region
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
const getThresholdGroupsOfLevelThreshold = (levelThresholdId, consFixed) => {
  const thresholdGroups = new Set()
  for (const [curId, curThreshGroup] of Object.entries(consFixed.thresholdGroup)) {
    for (const curThreshLevel of curThreshGroup.threshold_levels) {
      if (curThreshLevel.id == levelThresholdId) { 
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

//
const getThresholdLevelFromValueFunction = (valueFunction, consFixed) => {
  // get levelThresholdId from value function
  let levelThresholdId = null
  const lvlThreshId = "@" + valueFunction + "@"
  for (const [curThresholdValueSetId, curThresholdValueSetData] of
    Object.entries(consFixed.thresholdValueSets)) {
      for (const curThresholdLevel of curThresholdValueSetData.levelThresholdValues) {
        if (curThresholdLevel.valueFunction != lvlThreshId) { continue }
        levelThresholdId = curThresholdLevel.levelThresholdId
        break
      }
    if (levelThresholdId) { break; }
  }

  // check if found something
  if (!levelThresholdId) { return null; }

  // get the upWarningLevel object from the level threshold
  for (const [curThreshGroupId, curThreshGroup] of Object.entries(consFixed.thresholdGroup)) {
    for (const curThreshLevel of curThreshGroup.threshold_levels) {
      if (curThreshLevel.id != levelThresholdId) { continue; }
      return (curThreshLevel)
    }
  }
  return null
}

/* ** NAMESPACE ****************************************************************************** */

// aggregate all public functions into a single namespace
const consFixedLib = {
  getFilterData: getFilterData,
  getLocationData: getLocationData,
  getParameterGroupOfParameterId: getParameterGroupOfParameterId,
  getRegionData: getRegionData,
  getThresholdGroupBaseIcons: getThresholdGroupBaseIcons,
  getThresholdGroupData: getThresholdGroupData,
  getThresholdGroupsOfLevelThreshold: getThresholdGroupsOfLevelThreshold,
  getThresholdGroupsOfLevelThresholds: getThresholdGroupsOfLevelThresholds,
  getThresholdLevelData: getThresholdLevelData,
  getThresholdLevelFromValueFunction: getThresholdLevelFromValueFunction
}

export default consFixedLib
