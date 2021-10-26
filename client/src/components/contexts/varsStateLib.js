/*
 * Functions here are used to change VarsState consistently.
 * All the public functions output a consistent content of varsState that should be
 *   later used as argument for the function setVarsState().
 */

import VarsState from "./VarsState"

// Include a new location entry
const addLocation = (locationId, icon, display, varsState) => {
  varsState['locations'][locationId] = {
    icon: icon,
    display: display
  }
}


// Include a set of new location entries
const addLocations = (locationIds, iconDefault, displayDefault, varsState) => {
  for (const locationId of locationIds) {
    addLocation(locationId, iconDefault, displayDefault, varsState);
  };
}


// 
const getMainMenuControlShow = (varsState) => {
  return varsState['domObjects']['mainMenuControl']['show']
}


// 
const hideMainMenuControl = (varsState) => {
  varsState['domObjects']['mainMenuControl']['show'] = false
  return
}


// 
const inMainMenuControlActiveTabActiveFeatureInfo = (varsState) => {
  return (varsState['domObjects']['mainMenuControl']['activeTab'] == "tabActiveFeatureInfo")
}


// 
const inMainMenuControlActiveTabFilters = (varsState) => {
  return (varsState['domObjects']['mainMenuControl']['activeTab'] == "tabFilters")
}


// 
const inMainMenuControlActiveTabOverview = (varsState) => {
  return (varsState['domObjects']['mainMenuControl']['activeTab'] == "tabOverview")
}


// 
const setMainMenuControlActiveTab = (newActiveTabId, varsState) => {
  varsState['domObjects']['mainMenuControl']['activeTab'] = newActiveTabId
  return
}


// Just changes the value of the variable
const setContextFilterId = (filterId, varsState) => {
  varsState['context']['filterId'] = filterId
  return
}


// Changes the type of the icons and fill its respective arguments
const setContextIcons = (iconsType, args, varsState) => {
  const argsKey = {
    'uniform': 'typeUniform',
    'alerts': 'typeAlert',
    'evaluation': 'typeEvaluation',
    'competition': 'typeCompetition',
    'comparison': 'typeComparison'
  }[iconsType]
  varsState['context']['icons']['iconType'] = iconsType
  for (const k in args) { varsState['context']['icons'][argsKey][k] = args[k]; }
  return
}


// 
const showMainMenuControl = (varsState) => {
  varsState['domObjects']['mainMenuControl']['show'] = true
  return
}


// 
const toggleMainMenuControl = (varsState) => {
  const curValue = varsState['domObjects']['mainMenuControl']['show']
  varsState['domObjects']['mainMenuControl']['show'] = !curValue
  return
}


// aggregate all public functions into a single namespace
const varsStateLib = {
  "addLocation": addLocation,
  "addLocations": addLocations,
  "getMainMenuControlShow": getMainMenuControlShow,
  "hideMainMenuControl": hideMainMenuControl,
  "inMainMenuControlActiveTabActiveFeatureInfo": inMainMenuControlActiveTabActiveFeatureInfo,
  "inMainMenuControlActiveTabFilters": inMainMenuControlActiveTabFilters,
  "inMainMenuControlActiveTabOverview": inMainMenuControlActiveTabOverview,
  "setContextFilterId": setContextFilterId,
  "setContextIcons": setContextIcons,
  "setMainMenuControlActiveTab": setMainMenuControlActiveTab,
  "showMainMenuControl": showMainMenuControl,
  "toggleMainMenuControl": toggleMainMenuControl
}

export default varsStateLib
