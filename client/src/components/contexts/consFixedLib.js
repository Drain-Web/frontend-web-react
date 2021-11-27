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
  console.log()
  return consFixed.parameters[parameterId].parameterGroup
}

//
const getThresholdGroupsOfParameterId = (parameterId, consFixed) => {
  const thresholdGroupSet = new Set()
  console.log("consFixed:", consFixed)
  return thresholdGroupSet
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

/* ** NAMESPACE ****************************************************************************** */

// aggregate all public functions into a single namespace
const consFixedLib = {
  getLocationData: getLocationData,
  getParameterGroupOfParameterId: getParameterGroupOfParameterId,
  getThresholdGroupsOfParameterId: getThresholdGroupsOfParameterId,
  getThresholdGroupsOfLevelThreshold: getThresholdGroupsOfLevelThreshold,
  getThresholdGroupsOfLevelThresholds: getThresholdGroupsOfLevelThresholds
}

export default consFixedLib
