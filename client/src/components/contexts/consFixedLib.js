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

/* ** NAMESPACE ****************************************************************************** */

// aggregate all public functions into a single namespace
const consFixedLib = {
  getLocationData: getLocationData
}

export default consFixedLib
