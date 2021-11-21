import consCacheLib from './consCacheLib'

/*
 * Functions here are used to change VarsState consistently.
 * All the public functions output a consistent content of varsState that should be
 *   later used as argument for the function setVarsState().
 */

/* ** CONSTANTS ****************************************************************************** */

const CONTEXT_ICONS_ARGS_KEYS = {
  uniform: 'typeUniform',
  alerts: 'typeAlert',
  evaluation: 'typeEvaluation',
  competition: 'typeCompetition',
  comparison: 'typeComparison'
}

/* ** PUBLIC FUNCTIONS *********************************************************************** */

// Include a new location entry
const addLocation = (locationId, icon, display, varsState) => {
  varsState.locations[locationId] = {
    icon: icon,
    display: display
  }
}

// Include a set of new location entries
const addLocations = (locationIds, iconDefault, displayDefault, varsState) => {
  for (const locationId of locationIds) {
    addLocation(locationId, iconDefault, displayDefault, varsState)
  };
}

//
const getActiveLocation = (varsState) => {
  return varsState.activeLocation
}

//
const getContextFilterId = (varsState) => {
  return varsState.context.filterId
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
  return varsState.context.icons[iconArgsKey]
}

//
const getContextIconsType = (varsState) => {
  return varsState['context']['icons']['iconType']
}

//
const getMainMenuControlActiveTab = (varsState) => {
  return varsState['domObjects']['mainMenuControl']['activeTab']
}

//
const getMainMenuControlShow = (varsState) => {
  return varsState['domObjects']['mainMenuControl']['show']
}

//
const getPanelTabsShow = (varsState) => {
  return varsState['domObjects']['timeseriesPanel']['show']
}

//
const getTimeSerieUrl = (varsState) => {
  return varsState["context"]["timeSeriesData"]["timeSerieUrl"]
}

const hideAllLocationIcons = (varsState) => {
  _hideAllLocationIcons(varsState)
}

//
const hideMainMenuControl = (varsState) => {
  varsState['domObjects']['mainMenuControl']['show'] = false
}

const hidePanelTabs = (varsState) => {
  varsState['domObjects']['timeseriesPanel']['show'] = false
}

//
const inMainMenuControlActiveTabActiveFeatureInfo = (varsState) => {
  return (varsState['domObjects']['mainMenuControl']['activeTab'] === "tabActiveFeatureInfo")
}

//
const inMainMenuControlActiveTabFilters = (varsState) => {
  return (varsState['domObjects']['mainMenuControl']['activeTab'] === "tabFilters")
}

//
const inMainMenuControlActiveTabOverview = (varsState) => {
  return (varsState.domObjects.mainMenuControl.activeTab === 'tabOverview')
}

//
const setActiveLocation = (activeLocation, varsState) => {
  varsState.activeLocation = activeLocation
  if (activeLocation) {
    updateTimeSerieUrlByLocationId(activeLocation.locationId, varsState)
  }
}

// Just changes the value of the variable
const setContextFilterId = (newFilterId, varsState) => {
  varsState.context.filterId = newFilterId
  updateTimeSerieUrlByFilterId(newFilterId, varsState)
}

// Changes the type of the icons and fill its respective arguments
const setContextIcons = (iconsType, args, varsState) => {
  const argsKey = CONTEXT_ICONS_ARGS_KEYS[iconsType]
  varsState.context.icons.iconType = iconsType
  for (const k in args) {
    console.log('Setting "%s.%s" as "%s"', argsKey, k, args[k])
    varsState.context.icons[argsKey][k] = args[k]
  }
}

//
const setMainMenuControlActiveTab = (newActiveTabId, varsState) => {
  varsState.domObjects.mainMenuControl.activeTab = newActiveTabId
}

//
const setMainMenuControlActiveTabAsActiveFeatureInfo = (varsState) => {
  varsState['domObjects']['mainMenuControl']['activeTab'] = "tabActiveFeatureInfo"
}

//
const setMainMenuControlActiveTabAsOverview = (varsState) => {
  varsState['domObjects']['mainMenuControl']['activeTab'] = "tabOverview"
}

//
// Time series plots
//

// Set the time series url to fetch data
const setTimeSerieUrl = (timeSerieUrl, varsState) => {
  varsState["context"]["timeSeriesData"]["timeSerieUrl"] = timeSerieUrl
}

// Set the data to be used for plots
const setTimeSeriesPlotData = (plotData, varsState) => {
  varsState["context"]["timeSeriesData"]["plotData"] = plotData
}

//
const setTimeSeriesPlotArrays = (plotArrays, varsState) => {
  varsState["context"]["timeSeriesData"]["plotArrays"] = plotArrays
}

//
const setTimeSeriesPlotAvailableVariables = (availableVariables, varsState) => {
  varsState["context"]["timeSeriesData"]["availableVariables"] =
    availableVariables
}

//
const setTimeSeriesPlotUnitsVariables = (unitsVariables, varsState) => {
  varsState.context.timeSeriesData.unitsVariables = unitsVariables
}

//
const showMainMenuControl = (varsState) => {
  varsState['domObjects']['mainMenuControl']['show'] = true
}

//
const showPanelTabs = (varsState) => {
  varsState.domObjects.timeseriesPanel.show = true
}

//
const toggleMainMenuControl = (varsState) => {
  const curValue = varsState.domObjects.mainMenuControl.show
  varsState.domObjects.mainMenuControl.show = !curValue
}

// Updates the 'locations' content considering the rest of the object
const updateLocationIcons = (varsState, consCache, settings) => {
  // TODO: implement
  if (inMainMenuControlActiveTabOverview(varsState)) {
    // if in overview shows all locations
    _showAllLocationIcons(varsState)
  } else if (inMainMenuControlActiveTabFilters(varsState)) {
    // if in a specific filter, decide location by location
    if (getContextIconsType(varsState) === 'uniform') {
      _updateLocationIconsUniform(varsState, consCache)
      console.log('Should have updated by Uniform')
    } else if (getContextIconsType(varsState) === 'evaluation') {
      _updateLocationIconsEvaluation(varsState, consCache, settings)
      // _randomHideShowAllLocationIcons(varsState)
      console.log('Should have updated by Evaluation')
    } else {
      _hideAllLocationIcons(varsState)
      console.log('Hide icons because update icon time for "%s" was not implemented yet.')
    }
  } else if (inMainMenuControlActiveTabActiveFeatureInfo(varsState)) {
    console.log('In features info. Single show.')
  }
}

//
const updateTimeSerieUrlByFilterId = (filterId, varsState) => {
  const currentUrl = getTimeSerieUrl(varsState)
  if (!currentUrl) { return }

  const newUrl = _replaceUrlParam(currentUrl, 'filter', filterId)
  setTimeSerieUrl(newUrl, varsState)
}

// Set the time series url to fetch data
const updateTimeSerieUrlByLocationId = (locationId, varsState) => {
  const currentUrl = getTimeSerieUrl(varsState)
  if (!currentUrl) { return }

  const newUrl = _replaceUrlParam(currentUrl, 'location', locationId)
  setTimeSerieUrl(newUrl, varsState)
}

/* ** PRIVATE FUNCTIONS ********************************************************************** */

const _hideAllLocationIcons = (varsState) => {
  for (const locId in varsState.locations) { varsState.locations[locId].display = false }
}

const _randomHideShowAllLocationIcons = (varsState) => {
  for (const locId in varsState.locations) {
    varsState.locations[locId].display = !!Math.round(Math.random())
  }
}

const _replaceUrlParam = (url, paramName, paramValue) => {
  const newParamValue = (paramValue === null) ? '' : paramValue
  const pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)')

  if (url.search(pattern) >= 0) {
    return url.replace(pattern, '$1' + newParamValue + '$2')
  }
  url = url.replace(/[?#]$/, '')
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + newParamValue
}

const _showAllLocationIcons = (varsState) => {
  for (const lcId in varsState.locations) { varsState.locations[lcId].display = true }
}

// changes all locations' icons and display flags according to the selescted filter Id
const _updateLocationIconsUniform = (varsState, consCache) => {
  // get all timeseries of filterId
  const filterId = getContextFilterId(varsState)
  const timeseriesIdsByFilter = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
  if (!timeseriesIdsByFilter) {
    _hideAllLocationIcons(varsState)
    return
  }

  // get locations of the selected timeseries
  const locationIdsByFilter = new Set(Array.from(timeseriesIdsByFilter).map((timeseriesId) => {
    return (consCacheLib.getLocationIdOfTimeseriesId(timeseriesId, consCache))
  }))

  // update varsState location by location
  for (const locationId in varsState.locations) {
    varsState.locations[locationId].display = locationIdsByFilter.has(locationId)
  }
}

//
const _updateLocationIconsEvaluation = (varsState, consCache, settings) => {
  // get last response
  const lastUrlResponseData = consCacheLib.getEvaluationLastResponseData(consCache)
  if (!lastUrlResponseData) { return }

  // get basic icons info
  const iconOptions = settings.locationIconsOptions.evaluation.options[lastUrlResponseData.metric].parameterGroups['Discharge']  // TODO: make it flexible

  // iterate location by location, showing/hiding icons
  for (const locationId in varsState.locations) {
    // hide if not available in response
    if (!lastUrlResponseData.locations[locationId]) {
      varsState.locations[locationId].display = false
      continue
    } else {
      varsState.locations[locationId].display = true

      // define de evaluation icon
      let iconUrl = null
      let rangeTopIdx = 1
      while (rangeTopIdx < iconOptions.ranges.length) {
        const curTopVal = iconOptions.ranges[rangeTopIdx]
        if ((!curTopVal) || (lastUrlResponseData.locations[locationId].value <= curTopVal)) {
          iconUrl = iconOptions.icons[rangeTopIdx - 1]
          break
        }
        rangeTopIdx += 1
      }
      varsState.locations[locationId].icon = iconUrl
    }
  }
}

/* ** NAMESPACE ****************************************************************************** */

// aggregate all public functions into a single namespace
const varsStateLib = {
  addLocation: addLocation,
  addLocations: addLocations,
  getActiveLocation: getActiveLocation,
  getContextFilterId: getContextFilterId,
  getContextFilterEvtId: getContextFilterEvtId,
  getContextFilterGeoId: getContextFilterGeoId,
  getContextIconsArgs: getContextIconsArgs,
  getContextIconsType: getContextIconsType,
  getMainMenuControlActiveTab: getMainMenuControlActiveTab,
  getMainMenuControlShow: getMainMenuControlShow,
  getPanelTabsShow: getPanelTabsShow,
  getTimeSerieUrl: getTimeSerieUrl,
  hideAllLocationIcons: hideAllLocationIcons,
  hideMainMenuControl: hideMainMenuControl,
  hidePanelTabs: hidePanelTabs,
  inMainMenuControlActiveTabActiveFeatureInfo: inMainMenuControlActiveTabActiveFeatureInfo,
  inMainMenuControlActiveTabFilters: inMainMenuControlActiveTabFilters,
  inMainMenuControlActiveTabOverview: inMainMenuControlActiveTabOverview,
  setActiveLocation: setActiveLocation,
  setContextFilterId: setContextFilterId,
  setContextIcons: setContextIcons,
  setMainMenuControlActiveTab: setMainMenuControlActiveTab,
  setMainMenuControlActiveTabAsActiveFeatureInfo: setMainMenuControlActiveTabAsActiveFeatureInfo,
  setMainMenuControlActiveTabAsOverview: setMainMenuControlActiveTabAsOverview,
  setTimeSerieUrl: setTimeSerieUrl,
  setTimeSeriesPlotData: setTimeSeriesPlotData,
  setTimeSeriesPlotArrays: setTimeSeriesPlotArrays,
  setTimeSeriesPlotAvailableVariables: setTimeSeriesPlotAvailableVariables,
  setTimeSeriesPlotUnitsVariables: setTimeSeriesPlotUnitsVariables,
  showMainMenuControl: showMainMenuControl,
  showPanelTabs: showPanelTabs,
  toggleMainMenuControl: toggleMainMenuControl,
  updateLocationIcons: updateLocationIcons
}

export default varsStateLib
