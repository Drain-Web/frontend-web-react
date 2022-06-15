import consCacheLib from "../contexts/consCacheLib"
import consFixedLib from "../contexts/consFixedLib"

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
const getContextIconsArgs = (iconsType, atVarStateContext) => {
  let iconArgsKey
  if (!iconsType) {
    iconArgsKey = getContextIconsType(atVarStateContext)
    iconArgsKey = CONTEXT_ICONS_ARGS_KEYS[iconArgsKey]
  } else {
    iconArgsKey = CONTEXT_ICONS_ARGS_KEYS[iconsType]
  }
  return atVarStateContext.icons[iconArgsKey]
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

//
const setContextIconsArgs = (iconsType, argName, value, atVarStateContext) => {
  const iconArgsKey = CONTEXT_ICONS_ARGS_KEYS[iconsType]
  atVarStateContext.icons[iconArgsKey][argName] = value
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
  console.log("Setting uniform:", iconUrl)
  for (const locId in atVarStateLocations) { atVarStateLocations[locId].icon = iconUrl }
}

//
const showAllLocationIcons = (atVarStateLocations) => {
  for (const lcId in atVarStateLocations) { atVarStateLocations[lcId].display = true }
}

// ** PUBLIC FUNCTIONS - ActiveLocations *******************************************************

// TODO: this should go to VarsStateManager listening to activeLocation atom
// TODO: continue from here
const setActiveLocation = (newActiveLocation, atVarStateDomMainMenuControl, 
                           setAtVarStateActiveLocation) => {
  setAtVarStateActiveLocation(newActiveLocation)
  if (newActiveLocation) {
    _updateTimeSerieUrlByLocationId(newActiveLocation, varsState)  // fix it
  }
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

//
const pushIntoActiveTabHistory = (activeTabId, atVarStateDomMainMenuControl) => {
  atVarStateDomMainMenuControl.activeTabsHistory.push(activeTabId)
}

//
const setMainMenuControlActiveTab = (newActiveTabId, atVarStateDomMainMenuControl) => {
  atVarStateDomMainMenuControl.activeTab = newActiveTabId
}

//
const setMainMenuControlActiveTabAsActiveFeatureInfo = (atVarStateDomMainMenuControl) => {
  atVarStateDomMainMenuControl.activeTab = 'tabActiveFeatureInfo'
}

//
const setMainMenuControlActiveTabAsFilters = (atVarStateDomMainMenuControl) => {
  atVarStateDomMainMenuControl.activeTab = 'tabFilters'
}

// ** PUBLIC FUNCTIONS - DomTimeseriesPanel ****************************************************

//
const getPanelTabsShow = (atVarStateDomTimeseriesPanel) => {
  return atVarStateDomTimeseriesPanel.show
}

//
const hidePanelTabs = (atVarStateDomTimeseriesPanel) => {
  atVarStateDomTimeseriesPanel.show = false
}

//
const showPanelTabs = (atVarStateDomTimeseriesPanel) => {
  atVarStateDomTimeseriesPanel.show = true
}

// ** PUBLIC FUNCTIONS - DomTimeSeriesData *****************************************************

//
const getTimeSeriesPlotData = (atVarStateDomTimeSeriesData) => {
  return atVarStateDomTimeSeriesData.plotData
}

// 
const getTimeSeriesPlotAvailableVariables = (atVarStateDomTimeSeriesData) => {
  return atVarStateDomTimeSeriesData.availableVariables
}

// 
const getTimeSerieUrl = (atVarStateDomTimeSeriesData) => {
  return atVarStateDomTimeSeriesData.timeSerieUrl
}

//
const getTimeSeriesUrl = getTimeSerieUrl

//
const setContextFilterId = (newFilterId, atVarStateContext, atVarStateDomTimeSeriesData) => {
  atVarStateContext.filterId = newFilterId
  _updateTimeSerieUrlByFilterId(newFilterId, atVarStateDomTimeSeriesData)
}

//
const setTimeSeriesPlotArrays = (newPlotArrays, atVarStateDomTimeSeriesData) => {
  atVarStateDomTimeSeriesData.plotArrays = newPlotArrays
}

// Set the data to be used for plots
const setTimeSeriesPlotData = (newPlotData, atVarStateDomTimeSeriesData) => {
  atVarStateDomTimeSeriesData.plotData = newPlotData
}

//
const setTimeSeriesPlotModelEvaluationMetrics = (newEvaluationMetrics,
                                                 atVarStateDomTimeSeriesData) => {
  atVarStateDomTimeSeriesData.evaluationMetrics = newEvaluationMetrics
}

//
const setTimeSeriesPlotThresholdsArray = (newThresholdsArray, atVarStateDomTimeSeriesData) => {
  atVarStateDomTimeSeriesData.thresholdsArray = newThresholdsArray
}

//
const setTimeSeriesPlotUnitsVariables = (newUnitsVariables, atVarStateDomTimeSeriesData) => {
  atVarStateDomTimeSeriesData.unitsVariables = newUnitsVariables
}

// 
const setTimeSerieUrl = (timeSerieUrl, atVarStateDomTimeSeriesData) => {
  atVarStateDomTimeSeriesData.timeSerieUrl = timeSerieUrl
}

// 
const setTimeSeriesPlotAvailableVariables = (newAvailableVariables,
  atVarStateDomTimeSeriesData) => {
atVarStateDomTimeSeriesData.availableVariables = newAvailableVariables
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
const getMapLegendIcons = (atVarStateDomMapLegend) => {
  return {
    icons: atVarStateDomMapLegend.iconsUrls,
    titles: atVarStateDomMapLegend.iconsTitles
  }
}

//
const getMapLegendSubtitle = (atVarStateDomMapLegend) => {
  return atVarStateDomMapLegend.subtitle
}

//
const getMapLegendVisibility = (atVarStateDomMapLegend) => {
  return atVarStateDomMapLegend.display
}

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

const vectorGridAnimationPlay = (atVarStateVectorGridAnimation) => {
  atVarStateVectorGridAnimation.isRunning = true
}

const vectorGridAnimationStop = (atVarStateVectorGridAnimation) => {
  atVarStateVectorGridAnimation.isRunning = false
}

// ** PUBLIC FUNCTIONS - General ***************************************************************

// Updates the 'locations' content considering the rest of the object
const updateLocationIcons = (atVarStateDomMainMenuControl, atVarStateLocations,
                             atVarStateContext, atVarStateDomMapLegend, consCache,
                             consFixed, settings) => {
  // TODO: implement
  if (inMainMenuControlActiveTabOverview(atVarStateDomMainMenuControl)) {
    // if in overview shows all locations
    showAllLocationIcons(atVarStateLocations)
    setUniformIcon(settings.generalLocationIcon, atVarStateLocations)
  } else if (inMainMenuControlActiveTabFilters(atVarStateDomMainMenuControl)) {
    // if in a specific filter, decide location by location
    const contextIconType = getContextIconsType(atVarStateContext)
    if (contextIconType === 'uniform') {
      _updateLocationIconsUniform(atVarStateContext, atVarStateLocations,
                                  atVarStateDomMapLegend, consCache, settings)
      console.log('Should have updated by Uniform')  // TODO: remove it
    } else if (contextIconType === 'evaluation') {
      _updateLocationIconsEvaluation(atVarStateLocations, atVarStateDomMapLegend, consCache,
                                     settings)
      console.log('Should have updated by Evaluation')  // TODO: remove it
    } else if (contextIconType === 'alerts') {
      _updateLocationIconsAlerts(atVarStateContext, atVarStateLocations, atVarStateDomMapLegend,
                                 consCache, consFixed, settings)
      console.log('Should have updated by Alerts')  // TODO: remove it
    } else if (contextIconType === 'comparison') {
      _updateLocationIconsComparison(atVarStateContext, atVarStateLocations,
                                     atVarStateDomMapLegend, consCache, consFixed, settings)
      console.log('Should have updated by Comparison')  // TODO: remove it
    } else if (contextIconType === 'competition') {
      _updateLocationIconsCompetition(atVarStateContext, atVarStateDomMapLegend,
                                      atVarStateLocations, consCache, consFixed, settings)

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
const _getObjectFromArrayById = (idValue, arrayData) => {
  if (!arrayData) { return null }
  for (const curEntry of arrayData) {
    if (curEntry.id === idValue) { return curEntry }
  }
  return null
}


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


//
// Updates atVarStateDomMapLegend, atVarStateLocations
const _updateLocationIconsCompetition = (atVarStateContext, atVarStateDomMapLegend,
                                         atVarStateLocations, consCache, consFixed,
                                         settings) => {
  // get last response
  const lastUrlResponseData = consCacheLib.getCompetitionLastResponseData(consCache)
  if (!lastUrlResponseData) {
    console.log('Did not stored urlResponseData from', consCache)
    return
  }

  // 
  const competitionArgs = getContextIconsArgs('competition', atVarStateContext).moduleInstanceId
  const allIcons = settings.locationIconsOptions.comparison.icons  // TODO - change to competition
  const selModInstIdsArray = Array.from(competitionArgs.simulationModuleInstanceIds)
  const useIcons = allIcons.slice(0, selModInstIdsArray.length)

  // check if we have enought information too display
  if (competitionArgs.simulationModuleInstanceIds.size < 2) {
    hideAllLocationIcons(atVarStateLocations)
    setMapLegendVisibility(false, atVarStateDomMapLegend)
    return
  }

  // define icons for the models
  const iconsLegend = {}
  for (const curModuleInstanceId of selModInstIdsArray) {
    const curIconUrl = useIcons[selModInstIdsArray.indexOf(curModuleInstanceId)]
    iconsLegend[curModuleInstanceId] = curIconUrl
  }

  // iterate location by location, showing/hiding icons
  for (const curLocationId in atVarStateLocations) {
    // hide if not available in response
    if (!lastUrlResponseData.locations[curLocationId]) {
      atVarStateLocations[curLocationId].display = false
      continue
    }

    // define icon otherwise
    let [curWinSimulation, curWinValue] = [null, null]
    for (const [curModuleInstanceId, curModuleInstanceDict] of
         Object.entries(lastUrlResponseData.locations[curLocationId].simulations)) {
      const curModuleInstanceValue = curModuleInstanceDict.value
      if (curWinValue && (curModuleInstanceValue < curWinValue)) {
        continue
      }
      [curWinSimulation, curWinValue] = [curModuleInstanceId, curModuleInstanceValue]
    }

    //
    atVarStateLocations[curLocationId].display = true
    atVarStateLocations[curLocationId].icon = iconsLegend[curWinSimulation]
  }

  // update legend
  setMapLegendSubtitle('Winners:', atVarStateDomMapLegend)
  setMapLegendIcons(iconsLegend, null, atVarStateDomMapLegend)
  setMapLegendVisibility(true, atVarStateDomMapLegend)
}


const _updateLocationIconsEvaluation = (atVarStateLocations, atVarStateDomMapLegend, consCache,
                                        settings) => {
  // get last response
  const lastUrlResponseData = consCacheLib.getEvaluationLastResponseData(consCache)
  if (!lastUrlResponseData) { 
    console.log("NOT EVEN GOT A RESPONSE!")
    return
  }

  // get basic icons info
  const lastUrlMetric = lastUrlResponseData.metric
  const lastUrlOptions = settings.locationIconsOptions.evaluation.options[lastUrlMetric]
  const iconOptions = lastUrlOptions.parameterGroups['Discharge']                               // TODO: make it flexible

  // basic check: must have at least one location
  if (!Object.keys(lastUrlResponseData.locations).length) {
    setMapLegendSubtitle('Evaluation:', atVarStateDomMapLegend)
    setMapLegendIcons({ 'NO DATA': null }, null, atVarStateDomMapLegend)
    setMapLegendVisibility(true, atVarStateDomMapLegend)
    return
  } else {
    console.log("HAS:", lastUrlResponseData.locations)
  }

  // iterate location by location, showing/hiding icons
  for (const locationId in atVarStateLocations) {
    // hide if not available in response
    if (!lastUrlResponseData.locations[locationId]) {
      atVarStateLocations[locationId].display = false
      continue
    } else {
      atVarStateLocations[locationId].display = true

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
      atVarStateLocations[locationId].icon = iconUrl
    }
  }

  // define items in legend
  const [iconsLegend, iconsLegendSeq] = [{}, []]
  let rangeTopIdx = 1
  while (rangeTopIdx < iconOptions.ranges.length) {
    const rangeLw = iconOptions.ranges[rangeTopIdx - 1]
    const rangeUp = iconOptions.ranges[rangeTopIdx]
    let curLabel = null
    if (rangeLw && rangeUp) {
      curLabel = rangeLw + ' ~ ' + rangeUp
    } else if (rangeLw && !rangeUp) {
      curLabel = '>' + rangeLw
    } else if (rangeUp && !rangeLw) {
      curLabel = '<' + rangeUp
    }
    iconsLegendSeq.push(curLabel)
    iconsLegend[curLabel] = iconOptions.icons[rangeTopIdx - 1]
    rangeTopIdx += 1
  }

  // update legend
  setMapLegendSubtitle('Evaluation:', atVarStateDomMapLegend)
  setMapLegendIcons(iconsLegend, null, atVarStateDomMapLegend)
  setMapLegendVisibility(true, atVarStateDomMapLegend)
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


// Set the time series url to fetch data
const _updateTimeSerieUrlByLocationId = (locationId, atVarStateDomTimeSeriesData) => {
  const currentUrl = getTimeSerieUrl(atVarStateDomTimeSeriesData)
  if (!currentUrl) { return }

  const newUrl = _replaceUrlParam(currentUrl, 'location', locationId)
  setTimeSerieUrl(newUrl, atVarStateDomTimeSeriesData)
}


// 
const _updateTimeSerieUrlByFilterId = (filterId, atVarStateDomTimeSeriesData) => {
  const currentUrl = getTimeSerieUrl(atVarStateDomTimeSeriesData)
  if (!currentUrl) { return }

  const newUrl = _replaceUrlParam(currentUrl, 'filter', filterId)
  setTimeSerieUrl(newUrl, atVarStateDomTimeSeriesData)
}


//
const _updateLocationIconsAlerts = (atVarStateContext, atVarStateLocations, 
                                    atVarStateDomMapLegend, consCache, consFixed, settings) => {
  // get all timeseries of filterId of selected ParameterGroup and ModuleInstanceId
  const filterId = getContextFilterId(atVarStateContext)
  const moduleInstanceId = getContextIconsArgs('alerts', atVarStateContext).moduleInstanceId

  // get threshold group group and check it
  const thresholdGroupId = getContextIconsArgs('alerts', atVarStateContext).thresholdGroupId
  if (!thresholdGroupId) {
    console.warn("No thresholdGroupId gotten from", atVarStateContext)
    return
  }

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

  console.log("Got", thresholdGroupData, "from", thresholdGroupId, "and", consFixed)

  // get the value function of the thresh levels
  const thresholdLevelFunction = {}
  for (const curThreshLevelObj of thresholdGroupData.threshold_levels) {
    const curThreshLevelId = curThreshLevelObj.id
    const curThreshLevelData = consFixedLib.getThresholdLevelData(curThreshLevelId, consFixed)
    if (curThreshLevelData) {
      thresholdLevelFunction[curThreshLevelId] = curThreshLevelData.valueFunction
      console.log("Yeah data for thresh level:", curThreshLevelId)
    } else {
      console.log("No data for thresh level:", curThreshLevelId)
    }
  }

  // TODO: double check if it needs to be moved somewhere
  const getThresholdLevel = (timeseriesData, locationData, thresholdGroupData,
      threshLevelFunctions) => {
    let lastThreshLevelObj = true

    // iterate threshold level by threshold level
    for (const curThreshLevelObj of thresholdGroupData.threshold_levels) {
      const curThreshLevelId = curThreshLevelObj.id
      const curThreshLevelFunction = threshLevelFunctions[curThreshLevelId]

      if ((curThreshLevelFunction.charAt(0) === '@') &&
          (curThreshLevelFunction.charAt(curThreshLevelFunction.length - 1) === '@')) {
        // get the value of the attribute in the location info
        const curAttrId = curThreshLevelFunction.substring(1, curThreshLevelFunction.length - 1)
        const curAttrObj = _getObjectFromArrayById(curAttrId, locationData.attributes)
        console.log("~~Looking for:", curThreshLevelFunction)
        if (!curAttrObj) { 
          console.log("~~~Got", curAttrObj, "from", curAttrId, locationData.attributes)
          return null
        }
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
      console.log("Location data of", curLocationId, ":", curLocationData)
      const thresholdLevel = getThresholdLevel(curTimeseriesData, curLocationData,
        thresholdGroupData, thresholdLevelFunction)

      // set the icon properly
      let selectedIcon = null
      if (!thresholdLevel) {
        selectedIcon = thresholdGroupBase.unknownIcon
        console.log("No thresh level at", curLocationId, "for thresh group", thresholdGroupData)
      } else if (typeof thresholdLevel === 'boolean') {
        selectedIcon = thresholdGroupBase.noWarningIcon
        console.log("No issue at", curLocationId, "for thresh group", thresholdGroupData)
      } else {
        selectedIcon = thresholdLevel.upWarningLevelId.iconName
        console.log("Something at", curLocationId, "for thresh group", thresholdGroupData)
      }
      locationIdsIcons[curTimeseriesData.header.location_id] = selectedIcon
      atVarStateLocations[curTimeseriesData.header.location_id].icon = selectedIcon
    }
  }

  // update varsState location by location
  for (const locationId in atVarStateLocations) {
    atVarStateLocations[locationId].display = locationId in locationIdsIcons
  }

  // define items in legend
  const [iconsLegendSeq, iconsLegend] = [[], {}]
  iconsLegendSeq.push('No alerts')
  iconsLegend['No alerts'] = thresholdGroupBase.noWarningIcon
  for (const curThresholdLevel of thresholdGroupData.threshold_levels) {
    const curName = curThresholdLevel.upWarningLevelId.name
    iconsLegendSeq.push(curName)
    iconsLegend[curName] = curThresholdLevel.upWarningLevelId.iconName
  }
  iconsLegendSeq.push('Unknown')
  iconsLegend.Unknown = thresholdGroupBase.unknownIcon

  // update legend
  setMapLegendSubtitle('Alerts:', atVarStateDomMapLegend)
  setMapLegendIcons(iconsLegend, iconsLegendSeq, atVarStateDomMapLegend)
  setMapLegendVisibility(true, atVarStateDomMapLegend)
}


//
const _updateLocationIconsComparison = (atVarStateContext, atVarStateLocations,
                                        atVarStateDomMapLegend, consCache, consFixed,
                                        settings) => {
  const comparisonsArgs = getContextIconsArgs('comparison', atVarStateContext)
  const selModInstIdsArray = Array.from(comparisonsArgs.moduleInstanceIds)
  const allIcons = settings.locationIconsOptions.comparison.icons
  const useIcons = allIcons.slice(0, selModInstIdsArray.length)
  const filterId = getContextFilterId(atVarStateContext)
  const selectedParameterGroupId = comparisonsArgs.parameterGroupId
  const selectedMetric = comparisonsArgs.metric

  // get all timeseries for this filter
  const consideredTimeseries = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
  if (!consideredTimeseries) {
    console.warn("No timeseries found for filter '" + filterId + "' on cache.")
    return
  }

  // collect values for each location
  const [locationIdsIcons, iconsLegend] = [{}, {}]
  for (const curTimeseriesId of consideredTimeseries) {
    const curTimeseriesData = consCacheLib.getTimeseriesData(curTimeseriesId, consCache)
    const curParameterGroupId = consFixedLib.getParameterGroupOfParameterId(
      curTimeseriesData.header.parameterId, consFixed)
    const curLocationId = curTimeseriesData.header.location_id
    const curModuleInstanceId = curTimeseriesData.header.moduleInstanceId
    let curValue = null

    // only considers relevant timeseries
    if (curParameterGroupId !== selectedParameterGroupId) { continue }
    if (!comparisonsArgs.moduleInstanceIds.has(curModuleInstanceId)) { continue }

    //
    if (!(curLocationId in locationIdsIcons)) {
      locationIdsIcons[curLocationId] = {}
    }

    // get correct value
    if (selectedMetric.endsWith('Max')) {
      curValue = curTimeseriesData.maxValue
    } else if (selectedMetric.endsWith('Min')) {
      curValue = curTimeseriesData.minValue
    }
    locationIdsIcons[curLocationId][curModuleInstanceId] = curValue
  }

  // define the winner for each location
  for (const [curLocationId, curLocationDict] of Object.entries(locationIdsIcons)) {
    let [curWinModuleInstanceId, curWinValue] = [null, null]
    for (const [curModuleInstanceId, curModuleInstanceValue] of Object.entries(curLocationDict)) {
      // check if it is the winning node of the location
      if (!curWinModuleInstanceId) {
        curWinModuleInstanceId = curModuleInstanceId
        curWinValue = curModuleInstanceValue
      } else if (_isComparisonWinner(selectedMetric, curWinValue, curModuleInstanceValue)) {
        curWinModuleInstanceId = curModuleInstanceId
        curWinValue = curModuleInstanceValue
      }
    }
    const winIconUrl = useIcons[selModInstIdsArray.indexOf(curWinModuleInstanceId)]
    atVarStateLocations[curLocationId].icon = winIconUrl
  }

  // update legend icons
  for (const curModuleInstanceId of comparisonsArgs.moduleInstanceIds) {
    const curIconUrl = useIcons[selModInstIdsArray.indexOf(curModuleInstanceId)]
    iconsLegend[curModuleInstanceId] = curIconUrl
  }

  // update visibility of icons
  for (const locationId in atVarStateLocations) {
    atVarStateLocations[locationId].display = locationId in locationIdsIcons
  }

  // update legend
  setMapLegendSubtitle('Winners:', atVarStateDomMapLegend)
  setMapLegendIcons(iconsLegend, null, atVarStateDomMapLegend)

  // hide legend if no module is selected
  const legendView = (comparisonsArgs.moduleInstanceIds.size > 0)
  setMapLegendVisibility(true, atVarStateDomMapLegend)
}


// ** NAMESPACE ********************************************************************************

// aggregate all public functions into a single namespace
const atsVarStateLib = {
  addLocation: addLocation,
  addLocations: addLocations,
  getContextFilterEvtId: getContextFilterEvtId,
  getContextFilterGeoId: getContextFilterGeoId,
  getContextFilterId: getContextFilterId,
  getContextIconsArgs: getContextIconsArgs,
  getContextIconsType: getContextIconsType,
  getLastActiveTab: getLastActiveTab,
  getMapLegendIcons: getMapLegendIcons,
  getMapLegendSubtitle: getMapLegendSubtitle,
  getMapLegendVisibility: getMapLegendVisibility,
  getMapZoomLevel: getMapZoomLevel,
  getMainMenuControlActiveTab: getMainMenuControlActiveTab,
  getPanelTabsShow: getPanelTabsShow,
  getTimeSeriesPlotAvailableVariables: getTimeSeriesPlotAvailableVariables,
  getTimeSeriesPlotData: getTimeSeriesPlotData,
  getTimeSerieUrl: getTimeSerieUrl,
  getTimeSeriesUrl: getTimeSeriesUrl,
  getVectorGridAnimationCurrentFrameIdx: getVectorGridAnimationCurrentFrameIdx,
  getVectorGridAnimationInterval: getVectorGridAnimationInterval,
  getVectorGridAnimationIsRunning: getVectorGridAnimationIsRunning, 
  getVectorGridAnimationTimeResolution: getVectorGridAnimationTimeResolution,
  hideAllLocationIcons: hideAllLocationIcons,
  hidePanelTabs: hidePanelTabs,
  inMainMenuControlActiveTabActiveFeatureInfo: inMainMenuControlActiveTabActiveFeatureInfo,
  inMainMenuControlActiveTabFilters: inMainMenuControlActiveTabFilters,
  inMainMenuControlActiveTabOverview: inMainMenuControlActiveTabOverview,
  pushIntoActiveTabHistory: pushIntoActiveTabHistory,
  setContextFilterId: setContextFilterId,
  setContextIcons: setContextIcons,
  setContextIconsArgs: setContextIconsArgs,
  setMainMenuControlActiveTab: setMainMenuControlActiveTab,
  setMainMenuControlActiveTabAsFilters: setMainMenuControlActiveTabAsFilters,
  setMainMenuControlActiveTabAsActiveFeatureInfo: setMainMenuControlActiveTabAsActiveFeatureInfo,
  setMapZoomLevel: setMapZoomLevel,
  setTimeSeriesPlotAvailableVariables: setTimeSeriesPlotAvailableVariables,
  setTimeSeriesPlotArrays: setTimeSeriesPlotArrays,
  setTimeSeriesPlotData: setTimeSeriesPlotData,
  setTimeSeriesPlotModelEvaluationMetrics: setTimeSeriesPlotModelEvaluationMetrics,
  setTimeSeriesPlotThresholdsArray: setTimeSeriesPlotThresholdsArray,
  setTimeSeriesPlotUnitsVariables: setTimeSeriesPlotUnitsVariables,
  setTimeSerieUrl: setTimeSerieUrl,
  setUniformIcon: setUniformIcon,
  setVectorGridAnimationCurrentFrameIdx: setVectorGridAnimationCurrentFrameIdx,
  setVectorGridAnimationInterval: setVectorGridAnimationInterval,
  setVectorGridAnimationTimeResolution: setVectorGridAnimationTimeResolution,
  showAllLocationIcons: showAllLocationIcons,
  showPanelTabs: showPanelTabs,
  toggleVectorGridAnimationIsRunning: toggleVectorGridAnimationIsRunning,
  updateLocationIcons: updateLocationIcons,
  vectorGridAnimationPlay: vectorGridAnimationPlay,
  vectorGridAnimationStop: vectorGridAnimationStop
}

export default atsVarStateLib
