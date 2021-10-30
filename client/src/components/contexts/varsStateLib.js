/*
 * Functions here are used to change VarsState consistently.
 * All the public functions output a consistent content of varsState that should be
 *   later used as argument for the function setVarsState().
 */

/* ** CONSTANTS ****************************************************************************** */

const CONTEXT_ICONS_ARGS_KEYS = {
  'uniform': 'typeUniform',
  'alerts': 'typeAlert',
  'evaluation': 'typeEvaluation',
  'competition': 'typeCompetition',
  'comparison': 'typeComparison'
}

/* ** FUNCTIONS ****************************************************************************** */

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
const getContextFilterId = (varsState) => {
  return varsState['context']['filterId']
}

// 
const getContextFilterEvtId = (varsState) => {
  return varsState['context']['filterId'].split(".")[0]
}

// 
const getContextFilterGeoId = (varsState) => {
  return varsState['context']['filterId'].split(".")[1]
}

//
const getContextIconsArgs = (iconsType, varsState) => {
  let iconArgsKey
  if (!iconsType) {
    iconArgsKey = getContextIconsType(varsState)
    iconArgsKey = CONTEXT_ICONS_ARGS_KEYS[iconArgsKey]
  } else {
    iconArgsKey = CONTEXT_ICONS_ARGS_KEYS[iconsType]
  }
  return varsState['context']['icons']['iconType']
}

//
const getContextIconsType = (varsState) => {
  return varsState['context']['icons']['iconType']
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


//
const setMainMenuControlActiveTabAsOverview = (varsState) => {
  varsState['domObjects']['mainMenuControl']['activeTab'] = "tabOverview"
}


// Just changes the value of the variable
const setContextFilterId = (newFilterId, varsState) => {
  varsState['context']['filterId'] = newFilterId
  return
}


// Changes the type of the icons and fill its respective arguments
const setContextIcons = (iconsType, args, varsState) => {
  const argsKey = CONTEXT_ICONS_ARGS_KEYS[iconsType]
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


// Updates the 'locations' content considering the rest of the object
const updateLocationIcons = (varsState, consFixed, settings) => {
  // TODO: implement
  if (inMainMenuControlActiveTabOverview(varsState)) {
    // if in overview shows all locations
    console.log('Show all locations')
    for (const locationId in varsState['locations']) {
      varsState['locations'][locationId]['display'] = true
    }
  } else {
    // if in a specific filter, decide location by location
    // TODO: implement it correctly
    console.log('Hide all locations')
    for (const locationId in varsState['locations']) {
      varsState['locations'][locationId]['display'] = false
    }
  }
  // if in overview: 
  // show all locations with default
  // otherwise:
  // make the judgment location by location
}


// aggregate all public functions into a single namespace
const varsStateLib = {
  "addLocation": addLocation,
  "addLocations": addLocations,
  "getContextFilterId": getContextFilterId,
  "getContextFilterEvtId": getContextFilterEvtId,
  "getContextFilterGeoId": getContextFilterGeoId,
  "getContextIconsArgs": getContextIconsArgs,
  "getContextIconsType": getContextIconsType,
  "getMainMenuControlShow": getMainMenuControlShow,
  "hideMainMenuControl": hideMainMenuControl,
  "inMainMenuControlActiveTabActiveFeatureInfo": inMainMenuControlActiveTabActiveFeatureInfo,
  "inMainMenuControlActiveTabFilters": inMainMenuControlActiveTabFilters,
  "inMainMenuControlActiveTabOverview": inMainMenuControlActiveTabOverview,
  "setContextFilterId": setContextFilterId,
  "setContextIcons": setContextIcons,
  "setMainMenuControlActiveTab": setMainMenuControlActiveTab,
  "setMainMenuControlActiveTabAsOverview": setMainMenuControlActiveTabAsOverview,
  "showMainMenuControl": showMainMenuControl,
  "toggleMainMenuControl": toggleMainMenuControl,
  "updateLocationIcons": updateLocationIcons
}

export default varsStateLib
