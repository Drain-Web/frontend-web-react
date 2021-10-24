/*
 * Functions here are used to change VarsState consistently.
 * All the public functions output a consistent content of varsState that should be
 *   later used as argument for the function setVarsState().
 */

import VarsState from "./VarsState"

// Include a new location entry
const addLocation = (locationId, icon, display, oldVarsState) => {
  const newVarsState = { ...oldVarsState }
  newVarsState['locations'][locationId] = {
    icon: icon,
    display: display
  }
  return (newVarsState)
}


// Include a set of new location entries
const addLocations = (locationIds, iconDefault, displayDefault, oldVarsState) => {
  let newVarsState = { ...oldVarsState };
  for (const locationId of locationIds) {
    newVarsState = addLocation(locationId, iconDefault, displayDefault, newVarsState);
  };
  return newVarsState;
}


// 
const getMainMenuControlShow = (varsState) => {
  return varsState['domObjects']['mainMenuControl']['show']
}


// 
const hideMainMenuControl = (varsState) => {
  varsState['domObjects']['mainMenuControl']['show'] = false
}


// Just changes the value of the variable
const setContextFilterId = (filterId, oldVarsState) => {
  const newVarsState = { ...oldVarsState }
  newVarsState['context']['filterId'] = filterId
  return newVarsState
}


// Changes the type of the icons and fill its arguments
const setContextIcons = (iconsType, args, oldVarsState) => {
  const newVarsState = { ...oldVarsState }
  const iconsDict = newVarsState['context']['icons']  // just to make the code readable
  const argsKey = {
    'uniform': 'typeUniform',
    'alerts': 'typeAlert',
    'evaluation': 'typeEvaluation',
    'competition': 'typeCompetition',
    'comparison': 'typeComparison'
  }[iconsType]

  iconsDict['iconType'] = iconsType
  for (const k in args) { iconsDict[argsKey][k] = args[k]; }

  return newVarsState
}


// 
const showMainMenuControl = (varsState) => {
  varsState['domObjects']['mainMenuControl']['show'] = true
}


// 
const toggleMainMenuControl = (varsState) => {
  varsState['domObjects']['mainMenuControl']['show'] = !varsState['domObjects']['mainMenuControl']['show']
}


// aggregate all public functions into a single namespace
const varsStateLib = {
  "addLocation": addLocation,
  "addLocations": addLocations,
  "getMainMenuControlShow": getMainMenuControlShow,
  "hideMainMenuControl": hideMainMenuControl,
  "setContextFilterId": setContextFilterId,
  "setContextIcons": setContextIcons,
  "showMainMenuControl": showMainMenuControl,
  "toggleMainMenuControl": toggleMainMenuControl
}

export default varsStateLib
