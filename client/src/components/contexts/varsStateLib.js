import consCacheLib from './consCacheLib'
import consFixedLib from './consFixedLib'

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
  return varsState.domObjects['mainMenuControl']['activeTab']
}

//
const getMainMenuControlShow = (varsState) => {
  return varsState.domObjects['mainMenuControl']['show']
}

//
const getPanelTabsShow = (varsState) => {
  return varsState.domObjects['timeseriesPanel']['show']
}

//
const getTimeSerieUrl = (varsState) => {
  return varsState.domObjects.timeSeriesData.timeSerieUrl
}

const getTimeSeriesPlotData = (varsState) => {
  return varsState.domObjects.timeSeriesData.plotData
}

//
const hideAllLocationIcons = (varsState) => {
  for (const locId in varsState.locations) { varsState.locations[locId].display = false }
}

//
const hideMainMenuControl = (varsState) => {
  varsState.domObjects['mainMenuControl']['show'] = false
}

const hidePanelTabs = (varsState) => {
  varsState.domObjects['timeseriesPanel']['show'] = false
}

//
const inMainMenuControlActiveTabActiveFeatureInfo = (varsState) => {
  return (varsState.domObjects['mainMenuControl']['activeTab'] === "tabActiveFeatureInfo")
}

//
const inMainMenuControlActiveTabFilters = (varsState) => {
  return (varsState.domObjects['mainMenuControl']['activeTab'] === "tabFilters")
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
    varsState.context.icons[argsKey][k] = args[k]
  }
}

//
const setMainMenuControlActiveTab = (newActiveTabId, varsState) => {
  varsState.domObjects.mainMenuControl.activeTab = newActiveTabId
}

//
const setMainMenuControlActiveTabAsActiveFeatureInfo = (varsState) => {
  varsState.domObjects['mainMenuControl']['activeTab'] = "tabActiveFeatureInfo"
}

//
const setMainMenuControlActiveTabAsOverview = (varsState) => {
  varsState.domObjects['mainMenuControl']['activeTab'] = "tabOverview"
}

// 
const setUniformIcon = (iconUrl, varsState) => {
  for (const locId in varsState.locations) { varsState.locations[locId].icon = iconUrl }
}

//
// Time series plots
//

// Set the time series url to fetch data
const setTimeSerieUrl = (timeSerieUrl, varsState) => {
  varsState.domObjects.timeSeriesData["timeSerieUrl"] = timeSerieUrl
}

// Set the data to be used for plots
const setTimeSeriesPlotData = (plotData, varsState) => {
  varsState.domObjects.timeSeriesData["plotData"] = plotData
}

//
const setTimeSeriesPlotArrays = (plotArrays, varsState) => {
  varsState.domObjects.timeSeriesData["plotArrays"] = plotArrays
}

//
const setTimeSeriesPlotAvailableVariables = (availableVariables, varsState) => {
  varsState.domObjects.timeSeriesData["availableVariables"] =
    availableVariables
}

// 
const setTimeSeriesPlotThresholdsArray = (thresholdsArray, varsState) => {
  varsState.domObjects.timeSeriesData.thresholdsArray = thresholdsArray
}

const setTimeSeriesPlotModelEvaluationMetrics = (evaluationMetrics, varsState) => {
  varsState.domObjects.timeSeriesData.evaluationMetrics = evaluationMetrics
}

//
const setTimeSeriesPlotUnitsVariables = (unitsVariables, varsState) => {
  varsState.domObjects.timeSeriesData.unitsVariables = unitsVariables
}

//
const showMainMenuControl = (varsState) => {
  varsState.domObjects['mainMenuControl']['show'] = true
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
const updateLocationIcons = (varsState, consCache, consFixed, settings) => {
  // TODO: implement
  if (inMainMenuControlActiveTabOverview(varsState)) {
    // if in overview shows all locations
    _showAllLocationIcons(varsState)
    setUniformIcon(settings.generalLocationIcon, varsState)
  } else if (inMainMenuControlActiveTabFilters(varsState)) {
    // if in a specific filter, decide location by location
    if (getContextIconsType(varsState) === 'uniform') {
      _updateLocationIconsUniform(varsState, consCache, settings)
      console.log('Should have updated by Uniform')
    } else if (getContextIconsType(varsState) === 'evaluation') {
      _updateLocationIconsEvaluation(varsState, consCache, settings)
      // _randomHideShowAllLocationIcons(varsState)
      console.log('Should have updated by Evaluation')
    } else if (getContextIconsType(varsState) === 'alerts') {
      _updateLocationIconsAlerts(varsState, consCache, consFixed, settings)
      console.log('Should have updated by Alerts')
    } else {
      hideAllLocationIcons(varsState)
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

const _setAllLocationsUniformIcons = (iconUrl, varsState) => {
  for (const lcId in varsState.locations) { varsState.locations[lcId].icon = iconUrl }
}

// 
const _updateLocationIconsAlerts = (varsState, consCache, consFixed, settings) => {
  // get all timeseries of filterId of selected ParameterGroup and ModuleInstanceId
  const filterId = getContextFilterId(varsState)
  const moduleInstanceId = getContextIconsArgs('alerts', varsState).moduleInstanceId
  const thresholdGroupId = getContextIconsArgs('alerts', varsState).thresholdGroupId

  // get timeseries
  const consideredTimeseries = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
  if (!consideredTimeseries) {
    console.warn("No timeseries found for filter '" + filterId + "' on cache.")
    return
  }

  // get all possible parameters
  const allParameterIds = consCacheLib.getParameterIdsByThresholdGroupId(thresholdGroupId,
    consCache)

  // get all info about thresh group
  const thresholdGroupData = consFixedLib.getThresholdGroupData(thresholdGroupId, consFixed)
  const thresholdGroupBase = consFixedLib.getThresholdGroupBaseIcons(thresholdGroupId, settings)

  // get the value function of the thresh levels
  const thresholdLevelFunction = {}
  for (const curThreshLevelObj of thresholdGroupData.threshold_levels) {
    const curThreshLevelId = curThreshLevelObj.id
    thresholdLevelFunction[curThreshLevelId] =
      consFixedLib.getThresholdLevelData(curThreshLevelId, consFixed).valueFunction
  }
  
  // TODO: double check if it needs to be moved somewhere
  const getThresholdLevel = (timeseriesData, locationData, thresholdGroupData,
      threshLevelFunctions) => {
    let lastThreshLevelObj = true

    // iterate threshold level by threshold level
    for (const curThreshLevelObj of thresholdGroupData.threshold_levels) {
      const curThreshLevelId = curThreshLevelObj.id
      const curThreshLevelFunction = threshLevelFunctions[curThreshLevelId]

      if ((curThreshLevelFunction.charAt(0) === "@") && 
          (curThreshLevelFunction.charAt(curThreshLevelFunction.length-1) === "@")) {
        
        // get the value of the attribute in the location info
        const curAttrId = curThreshLevelFunction.substring(1, curThreshLevelFunction.length - 1)
        const curAttrObj = _getObjectFromArrayById(curAttrId, locationData.attributes)
        if (!curAttrObj) { return null }
        const curAttrValue = parseFloat(curAttrObj.number)

        // if time series exceeds this value, continue checking a higher. If not, return it
        if (timeseriesData.maxValue < curAttrValue) { break }
        lastThreshLevelObj = curThreshLevelObj
      }
      else
      {
        console.warn("Unexpected threshold value function:", curThreshLevelFunction)
      }
    }
    return lastThreshLevelObj
  }

  // define icons to be updated
  const locationIdsIcons = {}
  for (const curTimeseriesId of consideredTimeseries) {
    const curTimeseriesData = consCacheLib.getTimeseriesData(curTimeseriesId, consCache)
    if (allParameterIds.has(curTimeseriesData.header.parameterId) && 
        (curTimeseriesData.header.moduleInstanceId === moduleInstanceId)) {

      // define the threshold level
      const curLocationId = curTimeseriesData.header.location_id
      const curLocationData = consFixedLib.getLocationData(curLocationId, consFixed)
      const thresholdLevel = getThresholdLevel(curTimeseriesData, curLocationData,
        thresholdGroupData, thresholdLevelFunction)

      // set the icon properly
      let selectedIcon = null
      if (!thresholdLevel) {
        selectedIcon = thresholdGroupBase.unknownIcon
      } else if (typeof thresholdLevel === "boolean") {
        selectedIcon = thresholdGroupBase.noWarningIcon
      } else {
        selectedIcon = thresholdLevel.upWarningLevelId.iconName
      }
      locationIdsIcons[curTimeseriesData.header.location_id] = selectedIcon
      varsState.locations[curTimeseriesData.header.location_id].icon = selectedIcon
    }
  }

  // update varsState location by location
  for (const locationId in varsState.locations) {
    varsState.locations[locationId].display = locationId in locationIdsIcons
  }
}

//
const _getObjectFromArrayById = (idValue, arrayData) => {
  if (!arrayData) { return null }
  for (const curEntry of arrayData) {
    if (curEntry.id === idValue) { return curEntry }
  }
  return null
}

// changes all locations' icons and display flags according to the selescted filter Id
const _updateLocationIconsUniform = (varsState, consCache, settings) => {
  // get all timeseries of filterId
  const filterId = getContextFilterId(varsState)
  const timeseriesIdsByFilter = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
  if (!timeseriesIdsByFilter) {
    hideAllLocationIcons(varsState)
    return
  }

  // get locations of the selected timeseries
  const locationIdsByFilter = new Set(Array.from(timeseriesIdsByFilter).map((timeseriesId) => {
    return (consCacheLib.getLocationIdOfTimeseriesId(timeseriesId, consCache))
  }))

  // update varsState location by location
  setUniformIcon(settings.generalLocationIcon, varsState)
  for (const locationId in varsState.locations) {
    // varsState.locations[locationId].icon = "./img/drop.svg"  // TODO: get this URL from settings
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
  getTimeSeriesPlotData: getTimeSeriesPlotData,
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
  setTimeSeriesPlotThresholdsArray: setTimeSeriesPlotThresholdsArray,
  setTimeSeriesPlotModelEvaluationMetrics: setTimeSeriesPlotModelEvaluationMetrics,
  setTimeSeriesPlotUnitsVariables: setTimeSeriesPlotUnitsVariables,
  setUniformIcon: setUniformIcon,
  showMainMenuControl: showMainMenuControl,
  showPanelTabs: showPanelTabs,
  toggleMainMenuControl: toggleMainMenuControl,
  updateLocationIcons: updateLocationIcons
}

export default varsStateLib
