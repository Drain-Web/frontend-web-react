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
const getMapZoomLevel = (varsState) => {
  return varsState.domObjects.map.zoomLevel
}

//
const getPanelTabsShow = (varsState) => {
  return varsState.domObjects.timeseriesPanel.show
}

//
const getTimeSerieUrl = (varsState) => {
  return varsState.domObjects.timeSeriesData.timeSerieUrl
}

const getTimeSeriesPlotData = (varsState) => {
  return varsState.domObjects.timeSeriesData.plotData
}

/* TODO: continue from here
 */

const getVectorGridAnimationCurrentFrameIdx = (varsState) => {
  return varsState.vectorGridAnimation.currentFrameIdx
}

const getVectorGridAnimationPlaySpeed = (varsState) => {
  return varsState.vectorGridAnimation.playSpeed
}

const getVectorGridAnimationIsRunning = (varsState) => {
  return varsState.vectorGridAnimation.isRunning
}

const setVectorGridAnimationCurrentFrameIdx = (newFrameIdx, varsState) => {
  varsState.vectorGridAnimation.currentFrameIdx = newFrameIdx
}

const setVectorGridAnimationPlaySpeed = (newPlaySpeed, varsState) => {
  varsState.vectorGridAnimation.playSpeed = newPlaySpeed
}

const setVectorGridAnimationIsRunning = (newIsRunning, varsState) => {
  varsState.vectorGridAnimation.isRunning = newIsRunning
}

const toggleVectorGridAnimationIsRunning = (varsState) => {
  varsState.vectorGridAnimation.isRunning = !varsState.vectorGridAnimation.isRunning
}

//
const hideAllLocationIcons = (varsState) => {
  for (const locId in varsState.locations) { varsState.locations[locId].display = false }
}

//
const hideMainMenuControl = (varsState) => {
  varsState.domObjects.mainMenuControl.show = false
}

const hidePanelTabs = (varsState) => {
  varsState.domObjects.timeseriesPanel.show = false
}

//
const inMainMenuControlActiveTabActiveFeatureInfo = (varsState) => {
  return (varsState.domObjects.mainMenuControl.activeTab === 'tabActiveFeatureInfo')
}

//
const inMainMenuControlActiveTabFilters = (varsState) => {
  return (varsState.domObjects.mainMenuControl.activeTab === 'tabFilters')
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
const setMapLegendSubtitle = (subtitle, varsState) => {
  varsState.domObjects.mapLegend.subtitle = subtitle
}

//
const getMapLegendSubtitle = (varsState) => {
  return varsState.domObjects.mapLegend.subtitle
}


//
// param icons: Dictionary with 'description' as key and 'iconUrl' as value
// param iconsOrder: List with sequential keys of 'icons' param; or null for any order.
const setMapLegendIcons = (icons, iconsOrder, varsState) => {
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
  varsState.domObjects.mapLegend.iconsUrls = iconsUrlList
  varsState.domObjects.mapLegend.iconsTitles = iconsDescList
}

//
const getMapLegendIcons = (varsState) => {
  return {
    icons: varsState.domObjects.mapLegend.iconsUrls,
    titles: varsState.domObjects.mapLegend.iconsTitles
  }
}

//
const getLastActiveTab = (varsState) => {
  const history = varsState.domObjects.mainMenuControl.activeTabsHistory
  return (history.length) ? history[history.length - 1] : null
}

//
const pullFromActiveTabHistory = (varsState) => {
  if (!varsState.domObjects.mainMenuControl.activeTabsHistory.length) {
    return null
  } else {
    return varsState.domObjects.mainMenuControl.activeTabsHistory.pop()
  }
}

//
const pushIntoActiveTabHistory = (activeTabId, varsState) => {
  varsState.domObjects.mainMenuControl.activeTabsHistory.push(activeTabId)
}

//
const setMapLegendVisibility = (display, varsState) => {
  varsState.domObjects.mapLegend.display = display
}

//
const getMapLegendVisibility = (varsState) => {
  return varsState.domObjects.mapLegend.display
}

//
const setMainMenuControlActiveTab = (newActiveTabId, varsState) => {
  varsState.domObjects.mainMenuControl.activeTab = newActiveTabId
}

//
const setMainMenuControlActiveTabAsActiveFeatureInfo = (varsState) => {
  varsState.domObjects.mainMenuControl.activeTab = 'tabActiveFeatureInfo'
}

//
const setMainMenuControlActiveTabAsOverview = (varsState) => {
  varsState.domObjects.mainMenuControl.activeTab = 'tabOverview'
}

//
const setMainMenuControlActiveTabAsFilters = (varsState) => {
  varsState.domObjects.mainMenuControl.activeTab = 'tabFilters'
}

//
const setMapZoomLevel = (newZoomLevel, varsState) => {
  varsState.domObjects.map.zoomLevel = newZoomLevel
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
  varsState.domObjects.timeSeriesData.timeSerieUrl = timeSerieUrl
}

// Set the data to be used for plots
const setTimeSeriesPlotData = (plotData, varsState) => {
  varsState.domObjects.timeSeriesData.plotData = plotData
}

//
const setTimeSeriesPlotArrays = (plotArrays, varsState) => {
  varsState.domObjects.timeSeriesData.plotArrays = plotArrays
}

//
const setTimeSeriesPlotAvailableVariables = (availableVariables, varsState) => {
  varsState.domObjects.timeSeriesData.availableVariables =
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
  varsState.domObjects.mainMenuControl.show = true
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
      console.log('Should have updated by Uniform')  // TODO: remove it
    } else if (getContextIconsType(varsState) === 'evaluation') {
      _updateLocationIconsEvaluation(varsState, consCache, settings)
      console.log('Should have updated by Evaluation')  // TODO: remove it
    } else if (getContextIconsType(varsState) === 'alerts') {
      _updateLocationIconsAlerts(varsState, consCache, consFixed, settings)
      console.log('Should have updated by Alerts')  // TODO: remove it
    } else if (getContextIconsType(varsState) === 'comparison') {
      _updateLocationIconsComparison(varsState, consCache, consFixed, settings)
      console.log('Should have updated by Comparison')  // TODO: remove it
    } else if (getContextIconsType(varsState) === 'competition') {
      _updateLocationIconsCompetition(varsState, consCache, consFixed, settings)
      console.log('Should have updated by Competition')  // TODO: remove it
    } else {
      varsStateLib.setMapLegendVisibility(true, varsState)
      hideAllLocationIcons(varsState)
      console.log('Hide icons because update icon was not implemented yet.')  // TODO: remove it
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

      if ((curThreshLevelFunction.charAt(0) === '@') &&
          (curThreshLevelFunction.charAt(curThreshLevelFunction.length - 1) === '@')) {
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
      } else if (typeof thresholdLevel === 'boolean') {
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
  varsStateLib.setMapLegendSubtitle('Alerts:', varsState)
  varsStateLib.setMapLegendIcons(iconsLegend, iconsLegendSeq, varsState)
  varsStateLib.setMapLegendVisibility(true, varsState)
}

const _isComparisonWinner = (selectedMetric, curWinningValue, curEvaluatedValue) => {
  if (selectedMetric === 'higherMax') {
    return (curEvaluatedValue.maxValue > curWinningValue)
  } else if (selectedMetric === 'lowerMax') {
    return (curEvaluatedValue.maxValue < curWinningValue)
  } else {
    return false
  }
}

// 
const _updateLocationIconsComparison = (varsState, consCache, consFixed, settings) => {
  const comparisonsArgs = varsStateLib.getContextIconsArgs('comparison', varsState)
  const selModInstIdsArray = Array.from(comparisonsArgs.moduleInstanceIds)
  const allIcons = settings.locationIconsOptions.comparison.icons
  const useIcons = allIcons.slice(0, selModInstIdsArray.length)
  const filterId = getContextFilterId(varsState)
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
    varsState.locations[curLocationId].icon = winIconUrl
  }

  // update legend icons
  for (const curModuleInstanceId of comparisonsArgs.moduleInstanceIds) {
    const curIconUrl = useIcons[selModInstIdsArray.indexOf(curModuleInstanceId)]
    iconsLegend[curModuleInstanceId] = curIconUrl
  }

  // update visibility of icons
  for (const locationId in varsState.locations) {
    varsState.locations[locationId].display = locationId in locationIdsIcons
  }

  // update legend
  varsStateLib.setMapLegendSubtitle('Winners:', varsState)
  varsStateLib.setMapLegendIcons(iconsLegend, null, varsState)

  // hide legend if no module is selected
  const legendView = (comparisonsArgs.moduleInstanceIds.size > 0)
  varsStateLib.setMapLegendVisibility(legendView, varsState)
}

//
const _updateLocationIconsCompetition = (varsState, consCache, consFixed, settings) => {
  // get last response
  const lastUrlResponseData = consCacheLib.getCompetitionLastResponseData(consCache)
  if (!lastUrlResponseData) {
    console.log('Did not stored urlResponseData from', consCache)
    return
  }

  const competitionArgs = varsStateLib.getContextIconsArgs('competition', varsState)
  const allIcons = settings.locationIconsOptions.comparison.icons  // TODO - change to competition
  const selModInstIdsArray = Array.from(competitionArgs.simulationModuleInstanceIds)
  const useIcons = allIcons.slice(0, selModInstIdsArray.length)

  // check if we have enought information too display
  if (competitionArgs.simulationModuleInstanceIds.size < 2) {
    varsStateLib.setMapLegendVisibility(false, varsState)
    varsStateLib.hideAllLocationIcons(varsState)
    return
  }

  // define icons for the models
  const iconsLegend = {}
  for (const curModuleInstanceId of selModInstIdsArray) {
    const curIconUrl = useIcons[selModInstIdsArray.indexOf(curModuleInstanceId)]
    iconsLegend[curModuleInstanceId] = curIconUrl
  }

  // iterate location by location, showing/hiding icons
  for (const curLocationId in varsState.locations) {
    // hide if not available in response
    if (!lastUrlResponseData.locations[curLocationId]) {
      varsState.locations[curLocationId].display = false
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
    varsState.locations[curLocationId].display = true
    varsState.locations[curLocationId].icon = iconsLegend[curWinSimulation]
  }

  // update legend
  varsStateLib.setMapLegendSubtitle('Winners:', varsState)
  varsStateLib.setMapLegendIcons(iconsLegend, null, varsState)
  varsStateLib.setMapLegendVisibility(true, varsState)
  console.log('Show legend')
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
    varsStateLib.hideAllLocationIcons(varsState)
    varsStateLib.setMapLegendVisibility(false, varsState)
    return
  }

  // get locations of the selected timeseries
  const locationIdsByFilter = new Set(Array.from(timeseriesIdsByFilter).map((timeseriesId) => {
    return (consCacheLib.getLocationIdOfTimeseriesId(timeseriesId, consCache))
  }))

  // update varsState location by location
  setUniformIcon(settings.generalLocationIcon, varsState)
  for (const locationId in varsState.locations) {
    varsState.locations[locationId].display = locationIdsByFilter.has(locationId)
  }
  varsStateLib.setMapLegendSubtitle('Uniform:', varsState)
  varsStateLib.setMapLegendIcons({ Location: settings.generalLocationIcon }, null, varsState)
  varsStateLib.setMapLegendVisibility(true, varsState)
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
  varsStateLib.setMapLegendSubtitle('Evaluation:', varsState)
  varsStateLib.setMapLegendIcons(iconsLegend, iconsLegendSeq, varsState)
  varsStateLib.setMapLegendVisibility(true, varsState)
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
  getLastActiveTab: getLastActiveTab,
  getMainMenuControlActiveTab: getMainMenuControlActiveTab,
  getMainMenuControlShow: getMainMenuControlShow,
  getMapLegendSubtitle: getMapLegendSubtitle,
  getMapLegendVisibility: getMapLegendVisibility,
  getMapLegendIcons: getMapLegendIcons,
  getMapZoomLevel: getMapZoomLevel,
  getPanelTabsShow: getPanelTabsShow,
  getTimeSerieUrl: getTimeSerieUrl,
  getTimeSeriesPlotData: getTimeSeriesPlotData,
  getVectorGridAnimationCurrentFrameIdx: getVectorGridAnimationCurrentFrameIdx,
  getVectorGridAnimationPlaySpeed: getVectorGridAnimationPlaySpeed,
  getVectorGridAnimationIsRunning: getVectorGridAnimationIsRunning,
  hideAllLocationIcons: hideAllLocationIcons,
  hideMainMenuControl: hideMainMenuControl,
  hidePanelTabs: hidePanelTabs,
  inMainMenuControlActiveTabActiveFeatureInfo: inMainMenuControlActiveTabActiveFeatureInfo,
  inMainMenuControlActiveTabFilters: inMainMenuControlActiveTabFilters,
  inMainMenuControlActiveTabOverview: inMainMenuControlActiveTabOverview,
  pullFromActiveTabHistory: pullFromActiveTabHistory,
  pushIntoActiveTabHistory: pushIntoActiveTabHistory,
  setActiveLocation: setActiveLocation,
  setContextFilterId: setContextFilterId,
  setContextIcons: setContextIcons,
  setMainMenuControlActiveTab: setMainMenuControlActiveTab,
  setMainMenuControlActiveTabAsActiveFeatureInfo: setMainMenuControlActiveTabAsActiveFeatureInfo,
  setMainMenuControlActiveTabAsOverview: setMainMenuControlActiveTabAsOverview,
  setMainMenuControlActiveTabAsFilters: setMainMenuControlActiveTabAsFilters,
  setMapLegendSubtitle: setMapLegendSubtitle,
  setMapLegendIcons: setMapLegendIcons,
  setMapLegendVisibility: setMapLegendVisibility,
  setMapZoomLevel: setMapZoomLevel,
  setTimeSerieUrl: setTimeSerieUrl,
  setTimeSeriesPlotData: setTimeSeriesPlotData,
  setTimeSeriesPlotArrays: setTimeSeriesPlotArrays,
  setTimeSeriesPlotAvailableVariables: setTimeSeriesPlotAvailableVariables,
  setTimeSeriesPlotThresholdsArray: setTimeSeriesPlotThresholdsArray,
  setTimeSeriesPlotModelEvaluationMetrics: setTimeSeriesPlotModelEvaluationMetrics,
  setTimeSeriesPlotUnitsVariables: setTimeSeriesPlotUnitsVariables,
  setVectorGridAnimationCurrentFrameIdx: setVectorGridAnimationCurrentFrameIdx,
  setVectorGridAnimationPlaySpeed: setVectorGridAnimationPlaySpeed,
  setVectorGridAnimationIsRunning: setVectorGridAnimationIsRunning,
  setUniformIcon: setUniformIcon,
  showMainMenuControl: showMainMenuControl,
  showPanelTabs: showPanelTabs,
  toggleMainMenuControl: toggleMainMenuControl,
  toggleVectorGridAnimationIsRunning: toggleVectorGridAnimationIsRunning,
  updateLocationIcons: updateLocationIcons
}

export default varsStateLib
