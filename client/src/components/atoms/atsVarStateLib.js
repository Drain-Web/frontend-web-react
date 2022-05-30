import consCacheLib from "../contexts/consCacheLib"

/*
 * Functions here are used to change VarState atoms consistently.
 * All the public functions just modify the content of the last argument object.
 * This object must be later be updated with setAtVarState...() funtion.
 */

/* ** CONSTANTS ****************************************************************************** */

const CONTEXT_ICONS_ARGS_KEYS = {
  uniform: 'typeUniform',
  alerts: 'typeAlert',
  evaluation: 'typeEvaluation',
  competition: 'typeCompetition',
  comparison: 'typeComparison'
}

// ** PUBLIC FUNCTIONS - Context ***************************************************************

//
const getContextFilterEvtId = (atVarStateContext) => {
  return atVarStateContext.filterId.split(".")[0]
}

//
const getContextFilterGeoId = (atVarStateContext) => {
  return atVarStateContext.filterId.split(".")[1]
}

//
const getContextFilterId = (atVarStateContext) => {
  return atVarStateContext.filterId
}

//
const getContextIconsType = (atVarStateContext) => {
  return atVarStateContext.icons.iconType
}

// Changes the type of the icons and fill its respective arguments
const setContextIcons = (iconsType, args, atVarStateContext) => {
  const argsKey = CONTEXT_ICONS_ARGS_KEYS[iconsType]
  atVarStateContext.icons.iconType = iconsType
  for (const k in args) {
    atVarStateContext.icons[argsKey][k] = args[k]
  }
}

// ** PUBLIC FUNCTIONS - Locations *************************************************************

// Include a new location entry
const addLocation = (locationId, icon, display, atVarStateLocations) => {
  atVarStateLocations[locationId] = {
    icon: icon,
    display: display
  }
}

// Include a set of new location entries
const addLocations = (locationIds, iconDefault, displayDefault, atVarStateLocations) => {
  for (const locationId of locationIds) {
    addLocation(locationId, iconDefault, displayDefault, atVarStateLocations)
  };
}

//
const hideAllLocationIcons = (atVarStateLocations) => {
  for (const locId in atVarStateLocations) { atVarStateLocations[locId].display = false }
}

//
const setUniformIcon = (iconUrl, atVarStateLocations) => {
  for (const locId in atVarStateLocations) { atVarStateLocations[locId].icon = iconUrl }
}

// ** PUBLIC FUNCTIONS - MainMenuControl *******************************************************

//
const setMainMenuControlActiveTab = (newActiveTabId, atVarStateDomMainMenuControl) => {
  atVarStateDomMainMenuControl.activeTab = newActiveTabId
}

//
const setMainMenuControlActiveTabAsFilters = (atVarStateDomMainMenuControl) => {
  atVarStateDomMainMenuControl.activeTab = 'tabFilters'
}

// ** PUBLIC FUNCTIONS - DomMainMenuControl ****************************************************

//
const getLastActiveTab = (atVarStateDomMainMenuControl) => {
  const history = atVarStateDomMainMenuControl.activeTabsHistory
  return (history.length) ? history[history.length - 1] : null
}

//
const getMainMenuControlActiveTab = (atVarStateDomMainMenuControl) => {
  return atVarStateDomMainMenuControl.activeTab
}

//
const inMainMenuControlActiveTabActiveFeatureInfo = (atVarStateDomMainMenuControl) => {
  return (atVarStateDomMainMenuControl.activeTab === 'tabActiveFeatureInfo')
}

//
const inMainMenuControlActiveTabFilters = (atVarStateDomMainMenuControl) => {
  return (atVarStateDomMainMenuControl.activeTab === 'tabFilters')
}

//
const inMainMenuControlActiveTabOverview = (atVarStateDomMainMenuControl) => {
  return (atVarStateDomMainMenuControl.activeTab === 'tabOverview')
}

// ** PUBLIC FUNCTIONS - DomTimeSeriesData *****************************************************

// 
const getTimeSerieUrl = (atVarStateDomTimeSeriesData) => {
  return atVarStateDomTimeSeriesData.timeSerieUrl
}

//
const setContextFilterId = (newFilterId, atVarStateContext, atVarStateDomTimeSeriesData) => {
  atVarStateContext.filterId = newFilterId
  _updateTimeSerieUrlByFilterId(newFilterId, atVarStateDomTimeSeriesData)
}

// 
const setTimeSerieUrl = (timeSerieUrl, atVarStateDomTimeSeriesData) => {
  atVarStateDomTimeSeriesData.timeSerieUrl = timeSerieUrl
}

// ** PUBLIC FUNCTION - DomMap *****************************************************************

//
const getMapZoomLevel = (atVarStateDomMap) => {
  return atVarStateDomMap.zoomLevel
}

// 
const setMapZoomLevel = (newZoomLevel, atVarStateDomMap) => {
  atVarStateDomMap.zoomLevel = newZoomLevel
}

// ** PUBLIC FUNCTION - DomMapLegend ***********************************************************

//
// param icons: Dictionary with 'description' as key and 'iconUrl' as value
// param iconsOrder: List with sequential keys of 'icons' param; or null for any order.
const setMapLegendIcons = (icons, iconsOrder, atVarStateDomMapLegend) => {
  const [iconsUrlList, iconsDescList] = [[], []]

  // fill lists
  if (!iconsOrder) {
    for (const [curModuleInstanceId, curModuleInstanceValue] of Object.entries(icons)) {
      iconsUrlList.push(curModuleInstanceValue)
      iconsDescList.push(curModuleInstanceId)
    }
  } else {
    for (const curModuleInstanceId of iconsOrder) {
      iconsUrlList.push(icons[curModuleInstanceId])
      iconsDescList.push(curModuleInstanceId)
    }
  }

  // update varsState
  atVarStateDomMapLegend.iconsUrls = iconsUrlList
  atVarStateDomMapLegend.iconsTitles = iconsDescList
}

//
const setMapLegendVisibility = (newDisplay, atVarStateDomMapLegend) => {
  atVarStateDomMapLegend.display = newDisplay
}

//
const setMapLegendSubtitle = (newSubtitle, atVarStateDomMapLegend) => {
  atVarStateDomMapLegend.subtitle = newSubtitle
}

// ** PUBLIC FUNCTION - VectorGridAnimation ****************************************************

const getVectorGridAnimationCurrentFrameIdx = (atVarStateVectorGridAnimation) => {
  return atVarStateVectorGridAnimation.currentFrameIdx
}

const getVectorGridAnimationInterval = (atVarStateVectorGridAnimation) => {
  return atVarStateVectorGridAnimation.interval
}

const getVectorGridAnimationIsRunning = (atVarStateVectorGridAnimation) => {
  return atVarStateVectorGridAnimation.isRunning
}

const getVectorGridAnimationTimeResolution = (atVarStateVectorGridAnimation) => {
  return atVarStateVectorGridAnimation.timeResolution
}

const setVectorGridAnimationCurrentFrameIdx = (newFrameIdx, atVarStateVectorGridAnimation) => {
  atVarStateVectorGridAnimation.currentFrameIdx = newFrameIdx
}

const setVectorGridAnimationInterval = (newInterval, atVarStateVectorGridAnimation) => {
  atVarStateVectorGridAnimation.interval = newInterval
}

const setVectorGridAnimationTimeResolution = (newTimeResolution, 
                                              atVarStateVectorGridAnimation) => {
  atVarStateVectorGridAnimation.timeResolution = newTimeResolution
}

const toggleVectorGridAnimationIsRunning = (atVarStateVectorGridAnimation) => {
  atVarStateVectorGridAnimation.isRunning = !atVarStateVectorGridAnimation.isRunning
}

// ** PUBLIC FUNCTIONS - General ***************************************************************

// Updates the 'locations' content considering the rest of the object
const updateLocationIcons = (atVarStateDomMainMenuControl, atVarStateLocations,
                             atVarStateContext, atVarStateDomMapLegend, consCache,
                             consFixed, settings) => {
  // TODO: implement
  if (inMainMenuControlActiveTabOverview(atVarStateDomMainMenuControl)) {
    // if in overview shows all locations
    _showAllLocationIcons(atVarStateLocations)
    setUniformIcon(settings.generalLocationIcon, atVarStateLocations)
  } else if (inMainMenuControlActiveTabFilters(atVarStateDomMainMenuControl)) {
    // if in a specific filter, decide location by location
    const contextIconType = getContextIconsType(atVarStateContext)
    if (contextIconType === 'uniform') {
      _updateLocationIconsUniform(atVarStateContext, atVarStateLocations,
                                  atVarStateDomMapLegend, consCache, settings)
      console.log('Should have updated by Uniform')  // TODO: remove it
    } else if (contextIconType === 'evaluation') {
      _updateLocationIconsEvaluation(atVarStateContext, atVarStateLocations,
                                     atVarStateDomMapLegend, consCache, settings)
      console.log('Should have updated by Evaluation')  // TODO: remove it
    } else if (contextIconType === 'alerts') {
      _updateLocationIconsAlerts(atVarStateDomMapLegend, consCache, consFixed, settings)
      console.log('Should have updated by Alerts')  // TODO: remove it
    } else if (contextIconType === 'comparison') {
      _updateLocationIconsComparison(atVarStateDomMapLegend, consCache, consFixed, settings)
      console.log('Should have updated by Comparison')  // TODO: remove it
    } else if (contextIconType === 'competition') {
      _updateLocationIconsCompetition(atVarStateDomMapLegend, consCache, consFixed, settings)
      console.log('Should have updated by Competition')  // TODO: remove it
    } else {
      setMapLegendVisibility(true, atVarStateDomMapLegend)
      hideAllLocationIcons(atVarStateLocations)
      console.log('Hide icons because update icon was not implemented yet.')  // TODO: remove it
    }
  } else if (inMainMenuControlActiveTabActiveFeatureInfo(atVarStateDomMainMenuControl)) {
    console.log('In features info. Single show.')
  }
}

// ** PRIVATE FUNCTIONS ************************************************************************

// 
const _replaceUrlParam = (url, paramName, paramValue) => {
  const newParamValue = (paramValue === null) ? '' : paramValue
  const pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)')

  if (url.search(pattern) >= 0) {
    return url.replace(pattern, '$1' + newParamValue + '$2')
  }
  url = url.replace(/[?#]$/, '')
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + newParamValue
}

const _showAllLocationIcons = (atVarStateLocations) => {
  for (const lcId in atVarStateLocations) { atVarStateLocations[lcId].display = true }
}


// changes all locations' icons and display flags according to the selescted filter Id
const _updateLocationIconsUniform = (atVarStateContext, atVarStateLocations,
                                     atVarStateDomMapLegend, consCache, settings) => {
  // get all timeseries of filterId
  const filterId = getContextFilterId(atVarStateContext)
  const timeseriesIdsByFilter = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
  if (!timeseriesIdsByFilter) {
    hideAllLocationIcons(atVarStateLocations)
    setMapLegendVisibility(false, atVarStateDomMapLegend)
    return
  }

  // get locations of the selected timeseries
  const locationIdsByFilter = new Set(Array.from(timeseriesIdsByFilter).map((timeseriesId) => {
    return (consCacheLib.getLocationIdOfTimeseriesId(timeseriesId, consCache))
  }))

  // update varsState location by location
  setUniformIcon(settings.generalLocationIcon, atVarStateLocations)
  for (const locationId in atVarStateLocations) {
    atVarStateLocations[locationId].display = locationIdsByFilter.has(locationId)
  }
  setMapLegendSubtitle('Uniform:', atVarStateDomMapLegend)
  setMapLegendIcons({ Location: settings.generalLocationIcon }, null, atVarStateDomMapLegend)
  setMapLegendVisibility(true, atVarStateDomMapLegend)
}


// 
const _updateTimeSerieUrlByFilterId = (filterId, atVarStateDomTimeSeriesData) => {
  const currentUrl = getTimeSerieUrl(atVarStateDomTimeSeriesData)
  if (!currentUrl) { return }

  const newUrl = _replaceUrlParam(currentUrl, 'filter', filterId)
  setTimeSerieUrl(newUrl, atVarStateDomTimeSeriesData)
}

// ** NAMESPACE ********************************************************************************

// aggregate all public functions into a single namespace
const atsVarStateLib = {
  addLocation: addLocation,
  addLocations: addLocations,
  getContextFilterEvtId: getContextFilterEvtId,
  getContextFilterGeoId: getContextFilterGeoId,
  getContextFilterId: getContextFilterId,
  getContextIconsType: getContextIconsType,
  getLastActiveTab: getLastActiveTab,
  getMapZoomLevel: getMapZoomLevel,
  getMainMenuControlActiveTab: getMainMenuControlActiveTab,
  getTimeSerieUrl: getTimeSerieUrl,
  getVectorGridAnimationCurrentFrameIdx: getVectorGridAnimationCurrentFrameIdx,
  getVectorGridAnimationInterval: getVectorGridAnimationInterval,
  getVectorGridAnimationIsRunning: getVectorGridAnimationIsRunning, 
  getVectorGridAnimationTimeResolution: getVectorGridAnimationTimeResolution,
  hideAllLocationIcons: hideAllLocationIcons,
  inMainMenuControlActiveTabActiveFeatureInfo: inMainMenuControlActiveTabActiveFeatureInfo,
  inMainMenuControlActiveTabFilters: inMainMenuControlActiveTabFilters,
  inMainMenuControlActiveTabOverview: inMainMenuControlActiveTabOverview,
  setContextFilterId: setContextFilterId,
  setContextIcons: setContextIcons,
  setMainMenuControlActiveTab: setMainMenuControlActiveTab,
  setMainMenuControlActiveTabAsFilters: setMainMenuControlActiveTabAsFilters,
  setMapZoomLevel: setMapZoomLevel,
  setTimeSerieUrl: setTimeSerieUrl,
  setUniformIcon: setUniformIcon,
  setVectorGridAnimationCurrentFrameIdx: setVectorGridAnimationCurrentFrameIdx,
  setVectorGridAnimationInterval: setVectorGridAnimationInterval,
  setVectorGridAnimationTimeResolution: setVectorGridAnimationTimeResolution,
  toggleVectorGridAnimationIsRunning: toggleVectorGridAnimationIsRunning,
  updateLocationIcons: updateLocationIcons
}

export default atsVarStateLib
