import React, { useContext, useEffect, useState } from "react";
import { cloneDeep } from 'lodash';
import { apiUrl } from "../../libs/api";
import axios from "axios"
import useSWR from "swr"

// import recoil to replace contexts
import { useRecoilState, useRecoilValue } from "recoil";

// caches
import ConsCache from "../contexts/ConsCache";
import consCacheLib from "../contexts/consCacheLib";

// atoms
import {
    atVarStateContext, atVarStateLocations, atVarStateDomTimeSeriesData,
    atVarStateDomMainMenuControl, atVarStateDomMapLegend, atVarStateDomMap, 
    atVarStateVectorGridAnimation, atVarStateDomTimeseriesPanel, atVarStateVectorGridMode
} from "../atoms/atsVarState";
import atsVarStateLib from "../atoms/atsVarStateLib";

// import libs
import appLoad from "../../libs/appLoad.js";

// ** Extra functions **************************************************************************

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

// same as 'fetcher', but includes extra info in response
async function fetcherWith (url, extra) {
  const jsonData = await fetcher(url)
  return new Promise((resolve, reject) => { resolve([jsonData, extra]) })
}

const VarsStateManager = ({ settings, consFixed }) => {

    // ** GET ATOMS AND CONTEXTS ***************************************************************

    // atoms
    const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
    const [atomVarStateLocations, setAtVarStateLocations] = useRecoilState(atVarStateLocations)
    const [atomVarStateDomMainMenuControl, setAtVarStateDomMainMenuControl] =
        useRecoilState(atVarStateDomMainMenuControl)
    const [atomVarStateDomTimeSeriesData, setAtVarStateDomTimeSeriesData] =
        useRecoilState(atVarStateDomTimeSeriesData)
    const atomVarStateDomMap = useRecoilValue(atVarStateDomMap)
    const [atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation] = 
        useRecoilState(atVarStateVectorGridAnimation)
    const atomVarStateDomTimeseriesPanel = useRecoilValue(atVarStateDomTimeseriesPanel)
    const [atomVarStateVectorGridMode, setAtVarStateVectorGridMode] = 
        useRecoilState(atVarStateVectorGridMode)
    const [atomVarStateDomMapLegend, setAtVarStateDomMapLegend] =
        useRecoilState(atVarStateDomMapLegend)

    // contexts
    const { consCache } = useContext(ConsCache)

    // ** SET useEffect HOOKS ******************************************************************

    // update location icons when anything changes in the timeseries data
    useEffect(() => {
        const atmVarStateLocations = cloneDeep(atomVarStateLocations);
        if (appLoad.setAtVarStateLocation(consFixed, settings, atmVarStateLocations)) {
            setAtVarStateLocations(atmVarStateLocations)
        }
    }, [atomVarStateDomTimeSeriesData]);

    /*
    // when timeseries URL is changed, 
    useEffect(() => {

        const newUrl = atsVarStateLib.getTimeSeriesUrl(atomVarStateDomTimeSeriesData)
        const fetcher = (url) => axios.get(url).then((res) => res.data)
        console.log("~~New TimeSeriesData URL:", newUrl)

        // TODO: check if URL is in the cache
        if (true) {
            // TODO: URL response not in the cache -> trigger request
            const { data: apiData, error } = useSWR(newUrl, fetcher, { suspense: true })
            if (error) { console.log("~~~ Got Error.") }
            if (!apiData) { console.log("~~~ Got no API data.") }

        } else {
            // TODO: already there, trigger update in the tab
        }

    }, [atsVarStateLib.getTimeSeriesUrl(atomVarStateDomTimeSeriesData)])
    */

    // ** VarStateDomMap ***********************************************************************

    // TODO: temp code
    // update the temporal resolution on zoom change
    useEffect(() => {
        const newZoomLevel = atsVarStateLib.getMapZoomLevel(atomVarStateDomMap)
        const newTimeResolution = _zoomToTimeResolution(newZoomLevel)
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        atsVarStateLib.setVectorGridAnimationTimeResolution(newTimeResolution,
                                                            atmVarStateVectorGridAnimation)
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
      }, [atsVarStateLib.getMapZoomLevel(atomVarStateDomMap)])

    // ** VarStateDomTimeseriesPanel ***********************************************************

    useEffect(() => {
        console.log("Captured change in VarStateDomTimeseriesPanel")
    }, [atsVarStateLib.getPanelTabsShow(atomVarStateDomTimeseriesPanel)])

    // ** VarStateVectorGridMode ***************************************************************

    // when the mode of representing the VectorGrid (static/animated) changes...
    useEffect(() => {
        
        // update playing/stopped
        if (atomVarStateVectorGridMode === 'static') {
            if (atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
                const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
                atsVarStateLib.vectorGridAnimationStop(atmVarStateVectorGridAnimation)
                setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
            }

        } else if (atomVarStateVectorGridMode === 'animated') {
            const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
            atsVarStateLib.vectorGridAnimationPlay(atmVarStateVectorGridAnimation)
            setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
        }

        // update in filter parameters if needed
        if (atsVarStateLib.inMainMenuControlActiveTabFilters(atomVarStateDomMainMenuControl)) {
            const atmVarStateDomMainMenuControl = cloneDeep(atomVarStateDomMainMenuControl)
            const params = atsVarStateLib.getMainMenuControlTabParametersFilter(atmVarStateDomMainMenuControl)
            params.vectorGridMode = atomVarStateVectorGridMode
            atsVarStateLib.setMainMenuControlTabParametersFilter(params, atmVarStateDomMainMenuControl)
            setAtVarStateDomMainMenuControl(atmVarStateDomMainMenuControl)
        }

    }, [atomVarStateVectorGridMode])

    // when tab changes it may update the animation
    useEffect(() => {

        if (atsVarStateLib.inMainMenuControlActiveTabOverview(atomVarStateDomMainMenuControl)) {
            // if in overview, force static
            setAtVarStateVectorGridMode('static')
        } else if (atsVarStateLib.inMainMenuControlActiveTabFilters(atomVarStateDomMainMenuControl)) {
            // if in filter, force what is stored in filter option
            const filterTabParams = atsVarStateLib.getMainMenuControlTabParametersFilter(atomVarStateDomMainMenuControl)
            setAtVarStateVectorGridMode(filterTabParams.vectorGridMode)
        }
        // if somewhere else, does nothing

    }, [atsVarStateLib.getMainMenuControlActiveTab(atomVarStateDomMainMenuControl)])

    // ** VarStateVectorGridAnimation **********************************************************

    // TODO: temp code
    // every time 'networkTimeIdx' is changed (useEffect), function itvFunc is scheduled to be
    //   called after 1000 milliseconds (1 second) and... HA! it will change 'networkTimeIdx'!
    useEffect(() => {
        
        const itvTime = atsVarStateLib.getVectorGridAnimationInterval(atomVarStateVectorGridAnimation)
        const itvFunc = () => {
            const curNetworkTimeIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation)

            // only do anything if mode is animated and player is running
            if (atomVarStateVectorGridMode !== "animated") {
                console.log("Not animated:", atomVarStateVectorGridMode)
                return
            } else if (!atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
                console.log("Not running:", JSON.stringify(atomVarStateVectorGridAnimation))
                return
            }

            // go to the next step
            const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation);
            const newNetworkTimeIdx = (curNetworkTimeIdx + 1) % 24  // TODO: remove hard code
            atsVarStateLib.setVectorGridAnimationCurrentFrameIdx(newNetworkTimeIdx,
                                                                 atmVarStateVectorGridAnimation)
            
            setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
        }
        const interval = setInterval(itvFunc, itvTime);
        return () => clearInterval(interval);

    }, [atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation),
        atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation),
        atsVarStateLib.getVectorGridAnimationInterval(atomVarStateVectorGridAnimation),
        atsVarStateLib.getVectorGridAnimationTimeResolution(atomVarStateVectorGridAnimation),
        atomVarStateVectorGridMode]);

    // ** ConsFixed ****************************************************************************

    // TODO: check if it is used indeed
    // when varsState.context is changed, update map view window
    useEffect(() => {
        const atmVarStateContext = cloneDeep(atomVarStateContext)
        const atmVarStateDomTimeSeriesData = cloneDeep(atomVarStateDomTimeSeriesData);
        const atmVarStateDomMainMenuControl = cloneDeep(atomVarStateDomMainMenuControl);

        if (appLoad.setAtsStartingValues(consFixed, settings, atmVarStateContext,
            atmVarStateDomTimeSeriesData,
            atmVarStateDomMainMenuControl))
        {
            setAtVarStateContext(atmVarStateContext)
            setAtVarStateDomTimeSeriesData(atmVarStateDomTimeSeriesData)
            setAtVarStateDomMainMenuControl(atmVarStateDomMainMenuControl)
        }
    }, [consFixed.loaded]);

    // ** Icons ********************************************************************************

    // when the type of the icons ('alerts', 'comparison', ...) change...
    useEffect(() => {

        // if in overview, ignore me
        if (atsVarStateLib.inMainMenuControlActiveTabOverview(atomVarStateDomMainMenuControl)) {
            return
        }

        // consider case a case
        // TODO: replace by dictionary-function-pointing
        const curIconsType = atsVarStateLib.getContextIconsType(atomVarStateContext)
        if (curIconsType === "alerts") {
            _onContextIconsTypeAlert1st() ? null : _onContextIconsTypeAlert()
        } else if (curIconsType === "uniform") {
            _onContextIconsTypeUniform()
        } else if (curIconsType === "evaluation") {
            _onContextIconsTypeEvaluation1st() ? null : _onContextIconsTypeEvaluation()
        } else if (curIconsType === "competition") {
            _onContextIconsTypeCompetition1st() ? null : _onContextIconsTypeCompetition()
        } else if (curIconsType === "comparison") {
            _onContextIconsTypeComparison1st() ? null : _onContextIconsTypeComparison()
        } else {
            console.log("UNEXPECTED ICONS TYPE:", curIconsType)
        }

    }, [atsVarStateLib.getContextFilterId(atomVarStateContext),
        atsVarStateLib.getContextIconsType(atomVarStateContext),
        atsVarStateLib.getMainMenuControlActiveTab(atomVarStateDomMainMenuControl)])


    // reactions related to inner changes in ALERT icons
    useEffect(() => {
        _onContextIconsTypeAlert()
    }, [
        atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext),
        atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).thresholdGroupId,
        atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).moduleInstanceId
    ])

    // reactions related to inner changes in COMPARISON icons
    useEffect(() => {
        _onContextIconsTypeComparison()
    }, [
        atsVarStateLib.getContextIconsArgs('comparison', atomVarStateContext).parameterGroupId,
        atsVarStateLib.getContextIconsArgs('comparison', atomVarStateContext).metric,
        atsVarStateLib.getContextIconsArgs('comparison', atomVarStateContext).moduleInstanceIds
    ])

    // reactions related to inner changes in COMPETITION icons
    useEffect(() => {
        _onContextIconsTypeCompetition()
    }, [
        atsVarStateLib.getContextIconsArgs('competition', atomVarStateContext).metric,
        atsVarStateLib.getContextIconsArgs('competition', atomVarStateContext).parameterGroupId,
        atsVarStateLib.getContextIconsArgs('competition', atomVarStateContext).simulationModuleInstanceId,
        atsVarStateLib.getContextIconsArgs('competition', atomVarStateContext).observationModuleInstanceId
    ])

    // reactions related to inner changes in EVALUATION icons
    useEffect(() => {
        _onContextIconsTypeEvaluation()
    }, [
        atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext).metric,
        atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext).parameterGroupId,
        atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext).simulationModuleInstanceId,
        atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext).observationModuleInstanceId
    ])

    // ** No-hook private functions ************************************************************

    // TODO: temp code
    const _changeParameterMetric = (selectedParameterMetric, icon_type) => {
      let selParamMetric = null
      if (selectedParameterMetric.target) {
        selParamMetric = selectedParameterMetric.target.value
      } else {
        selParamMetric = selectedParameterMetric
      }
      const [parameterGroupId, metricId] = _getParameterAndMetric(selParamMetric)
  
      // setSelectedParameterMetric(selParamMetric)
      // updateSelectedModuleInstanceIds(new Set(), varsState)  
  
      const atmVarStateContext = cloneDeep(atomVarStateContext)
      atsVarStateLib.setContextIcons(icon_type,
        {
          parameterGroupId: parameterGroupId,
          metric: metricId,
          moduleInstanceIds: new Set()  // TODO: keep selected modules active
        },
        atmVarStateContext)
      setAtVarStateContext(atmVarStateContext)
    }

    // TODO: temp code
    // TODO: move to a shared place
    const _getAvailableMetrics = () => {
        return {
            'higherMax': 'Higher Max',
            'lowerMax': 'Lower Max'
        }
    }

    // TODO: move to a shared place
    const _getParameterGroupsOfMetric = (metricId, settings) => {
        const paramGroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
        return Object.keys(paramGroups)
    }

    // TODO: temp code
    // TODO: move to a shared place
    const _getParameterAndMetric = (parameterMetric) => {
        return parameterMetric.split('|');
    }

    // TODO: temp code
    // TODO: move to a shared place
    const _getParameterMetric = (param, metric) => {
        return param + '|' + metric
    }

    // TODO: move to a shared place
    const _getSimObsParameterIds = (metricId, parameterGroupId, settings) => {
      // return two strings: the parameter ID of the simulations and the parameter id of the observations
      const pgroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
      return [pgroups[parameterGroupId].parameters.sim, pgroups[parameterGroupId].parameters.obs]
    }

    // when in the 'alerts' location icons
    // return: boolean. True if in the alert for the 1st time, false otherwise
    const _onContextIconsTypeAlert1st = () => {
        const iconsArgs = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext)
        let selectedThresholdGroup = iconsArgs.thresholdGroupId
        let selectedModuleInstanceId = iconsArgs.moduleInstanceId
        let anyUpdate = false

        const atmVarStateContext = cloneDeep(atomVarStateContext)

        // if no thresholdGroup selected, select one
        if (!selectedThresholdGroup) {
            selectedThresholdGroup = Object.keys(consFixed.thresholdGroup)[0]
            console.log("Will set As...")
            atsVarStateLib.setContextIcons('alerts',
                                            { thresholdGroupId: selectedThresholdGroup },
                                            atmVarStateContext)
            anyUpdate = true
            console.log(" ...set thresh group as:", selectedThresholdGroup)
        }

        // if no moduleInstanceId selected, select one
        if (!selectedModuleInstanceId) {
            const moduleInstancesIds = consCacheLib.getModuleInstancesOfThreshouldGroup(
                selectedThresholdGroup, consCache)
            const moduleInstanceInstanceId = Array.from(moduleInstancesIds)[0]
            console.log("Will set Bs...")
            atsVarStateLib.setContextIcons('alerts',
                                            { moduleInstanceId: moduleInstanceInstanceId },
                                            atmVarStateContext)
            anyUpdate = true
            console.log(" ...set moduleInstanceId:", moduleInstanceInstanceId)
        }

        // propagate any update if needed
        if (anyUpdate) {
            setAtVarStateContext(atmVarStateContext)
        }

        // if no threshold group is selected, select one
        /*
        if (!atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).thresholdGroupId ) {
            const atmVarStateContext = cloneDeep(atomVarStateContext)
            const thresholdGroup = Object.keys(consFixed.thresholdGroup)[0]
            atsVarStateLib.setContextIcons('alerts', { thresholdGroupId: thresholdGroup },
                                            atmVarStateContext)
            setAtVarStateContext(atmVarStateContext)
            console.log("Should have set selectedThresholdGroup as:", thresholdGroup)
        }
        */
    }

    // 
    const _onContextIconsTypeAlert = () => {
        const iconsArgs = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext)
        const selectedThresholdGroup = iconsArgs.thresholdGroupId
        const selectedModuleInstanceId = iconsArgs.moduleInstanceId
        
        if (!selectedThresholdGroup)   { return (null) }
        if (!selectedModuleInstanceId) { return (null) }

        // 1. get URL for retrieving timeseries
        const urlTimeseriesRequest = apiUrl(
            settings.apiBaseUrl,
            "v1",
            "timeseries",
            {
                filter: atsVarStateLib.getContextFilterId(atomVarStateContext),
                showStatistics: true,
                onlyHeaders: true
            }
        );

        // 2. define callback function that updates the icons
        const callbackFunc = (urlRequested) => {
            const atmVarStateLocations = cloneDeep(atomVarStateLocations)
            const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
            atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
                                                atomVarStateContext, atmVarStateDomMapLegend,
                                                consCache, consFixed, settings)
            setAtVarStateLocations(atmVarStateLocations)
            setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
        }
        
        // 3. call URL and then callback, or callback directly
        if (consCacheLib.wasUrlRequested(urlTimeseriesRequest, consCache)) {
            callbackFunc(urlTimeseriesRequest)
        } else {
            const extraArgs = {
                url: urlTimeseriesRequest,
                filterId: atsVarStateLib.getContextFilterId(atomVarStateContext)
            }
            const atmVarStateLocations = cloneDeep(atomVarStateLocations)
            atsVarStateLib.setUniformIcon(settings.loadingLocationIcon, atmVarStateLocations)
            fetcherMultiargs(extraArgs).then(([jsonData, extras]) => {
                consCacheLib.addUrlRequested(extras.url, consCache)
                jsonData.map((curTimeseries) => {
                    consCacheLib.associateTimeseriesIdAndFilterId(curTimeseries.id,
                        extras.filterId, consCache)
                    consCacheLib.storeTimeseriesData(curTimeseries, consCache, consFixed)
                    return null
                })
                callbackFunc(extras.url)
            })
            setAtVarStateLocations(atmVarStateLocations)
        }
    }

    // when in the 'comparison' location icons for the 1st time
    // return: boolean. True if in the 'comparison' for the 1st time, false otherwise
    const _onContextIconsTypeComparison1st = () => {
        const ICON_TYPE = "comparison"
        const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext)
        const availableMetrics = _getAvailableMetrics()

        // if no parameterMetric selected, select first
        if ((!iconsArgs.parameterGroupId) || (!iconsArgs.metric)) {
            
            // get all available parameter
            const allAvailableParameterGroupIds = settings.locationIconsOptions[ICON_TYPE].options.availableParameterGroupIds
            if (!allAvailableParameterGroupIds.length) { return (null) }

            // get all available metrics
            const allAvailableMetrics = Object.keys(availableMetrics)
            if (!allAvailableMetrics.length) { return (null) }

            const firstAvailableParameterGroupId = allAvailableParameterGroupIds[0]
            const firstAvailableMetricId = allAvailableMetrics[0]
            const parameterMetricOptionId = _getParameterMetric(firstAvailableParameterGroupId,
                                                                firstAvailableMetricId)

            _changeParameterMetric(parameterMetricOptionId, ICON_TYPE)
            return (true)
        }

        return (false)
    }

    // when in the 'comparison' location icons
    const _onContextIconsTypeComparison = () => {
        const ICON_TYPE = "comparison"
        const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext)

        // check if minimum information is there
        let continueIt = true
        if (!iconsArgs.metric) { continueIt = false }
        if (!iconsArgs.parameterGroupId) { continueIt = false }
        if (!continueIt) { return (null) }

        // 
        const atmVarStateLocations = cloneDeep(atomVarStateLocations)
        const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
        console.log("Updating locations from comparison")
        atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
        atomVarStateContext, atmVarStateDomMapLegend, consCache, consFixed, settings)
        setAtVarStateLocations(atmVarStateLocations)
        setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
    }

    // when in the 'competition' location icons for the 1st time
    // return: boolean. True if in the competition for the 1st time, false otherwise
    const _onContextIconsTypeCompetition1st = () => {

        const atmVarStateContext = cloneDeep(atomVarStateContext)
        const iconsArgs = atsVarStateLib.getContextIconsArgs('competition', atmVarStateContext)
        let anyChange = false

        // if no metric selected, select one
        if (!iconsArgs.metric) {
            const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
            atsVarStateLib.setContextIconsArgs('competition', 'metric', allEvaluationIds[0],
                                                atmVarStateContext)
            iconsArgs.metric = allEvaluationIds[0]
            anyChange = true
        }
        
        // if no parameter group selected, select one
        const paramGroupIds = iconsArgs.metric ? _getParameterGroupsOfMetric(iconsArgs.metric, settings) : []
            if ((!iconsArgs.parameterGroupId) && (paramGroupIds.length > 0)) {
            iconsArgs.parameterGroupId = paramGroupIds[0]
            anyChange = true
        }

        // if no observation module instance selected, select one
        let [_, obsParameterId] = _getSimObsParameterIds(iconsArgs.metric, iconsArgs.parameterGroupId, settings)
        const allObsModInstIds = consCacheLib.getModuleInstancesWithParameter(obsParameterId, consCache)
        if ((!iconsArgs.observationModuleInstanceId) && (allObsModInstIds) && (allObsModInstIds.size > 0)) {
            iconsArgs.observationModuleInstanceId = allObsModInstIds.values().next().value
            anyChange = true
        }


        // if no observation module ID selected, select one
        /*
        if (!iconsArgs.observationModuleInstanceId) {
            console.log("..allObsModInstIds:", Array.from(allObsModInstIds)[0])
            changeSelectedObsModuleInstanceId({
                "target": { "value": Array.from(allObsModInstIds)[0] }
            })
        }
        */

        // update if needed
        if (anyChange) {
            console.log("Updated context from competition subform.")
            setAtVarStateContext(atmVarStateContext)
        }
    }

    //
    const _onContextIconsTypeCompetition = () => {
        // basic check
        const iconsArgs = atsVarStateLib.getContextIconsArgs('competition', atomVarStateContext)
        let continueIt = true
        if (!iconsArgs.metric) { continueIt = false }
        if (!iconsArgs.parameterGroupId) { continueIt = false }
        if (!continueIt) { return (null) }

        // get obs and mod parameter IDs from parameter group
        const [simParameterId, obsParameterId] = _getSimObsParameterIds(iconsArgs.metric,
            iconsArgs.parameterGroupId, settings)

        // final response function: get data from consCache and update varsState
        const callbackFunc = () => {
            const atmVarStateLocations = cloneDeep(atomVarStateLocations)
            const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
            atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
                atomVarStateContext, atmVarStateDomMapLegend,
                consCache, consFixed, settings)
            setAtVarStateLocations(atmVarStateLocations)
            setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
        }

        // define url
        let urlTimeseriesCalcRequest = null
        if (iconsArgs.simulationModuleInstanceIds.size >= 2) {

            // define url to be called and skip call if this was the last URL called
            const simModInstIds = Array.from(iconsArgs.simulationModuleInstanceIds).join(",")
            urlTimeseriesCalcRequest = apiUrl(
                settings.apiBaseUrl, 'v1dw', 'timeseries_calculator', {
                filter: atsVarStateLib.getContextFilterId(atomVarStateContext),   // varsStateLib.getContextFilterId(varsState),
                calc: iconsArgs.metric,
                simParameterId: simParameterId,
                obsParameterId: obsParameterId,
                obsModuleInstanceId: iconsArgs.observationModuleInstanceId,
                simModuleInstanceIds: simModInstIds
                }
            )
        }

        //
        if (consCacheLib.wasUrlRequested(urlTimeseriesCalcRequest, consCache) ||
            !urlTimeseriesCalcRequest) {
                callbackFunc()

        } else {
        
            // icons to loading
            new Promise((resolve, _) => { resolve(null) }).then((value) => {
                _setLocationIconsLoading()
            })
        
            // request URL, update local states, update cache, access cache
            const extraArgs = { url: urlTimeseriesCalcRequest }
            fetcherWith(urlTimeseriesCalcRequest, extraArgs).then(([jsonData, extras]) => {
                consCacheLib.addUrlRequested(extras.url, consCache)
                consCacheLib.storeCompetitionResponseData(extras.url, jsonData.competition, consCache)
                callbackFunc()
            })
        }
    }

    // what happens when in the 'uniform' location icons
    const _onContextIconsTypeUniform = () => {

        // define url to be called and skip call if this was the last URL called
        const urlTimeseriesRequest = apiUrl(
            settings.apiBaseUrl, 'v1', 'timeseries', {
            filter: atsVarStateLib.getContextFilterId(atomVarStateContext),
            showStatistics: true,
            onlyHeaders: true
            }
        )
        // if (filterOptions && (filterOptions.lastUrl === urlTimeseriesRequest)) { return (null) }

        // final response function: get data from consCache and update varsState
        const callbackFunc = (lastUrlRequest) => {
            const filterOptions = {
                lastUrl: lastUrlRequest,
                parameters: new Set(),
                parameterGroups: new Set(),
                modelInstances: new Set()
            }

            const filterId = atsVarStateLib.getContextFilterId(atomVarStateContext)
            const timeseriesIds = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
            const filteredTimeseries = Array.from(timeseriesIds).map((id) => {
                return consCacheLib.getTimeseriesData(id, consCache)
            })
            for (const curFilteredTimeseries of filteredTimeseries) {
                filterOptions.parameters.add(curFilteredTimeseries.header.parameterId)
                // TODO: add parameterGroups
                // TODO: add modelInstances
            }

            const atmVarStateLocations = cloneDeep(atomVarStateLocations)
            const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
            
            atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
                atomVarStateContext, atmVarStateDomMapLegend, consCache, consFixed, settings)
            
            // apply setters
            setAtVarStateLocations(atmVarStateLocations)
            setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
        }

        // call function after URL request, if needed
        if (!consCacheLib.wasUrlRequested(urlTimeseriesRequest, consCache)) {
            // request URL, update local states, update cache, access cache
            const extraArgs = {
                filterId: atsVarStateLib.getContextFilterId(atomVarStateContext),
                url: urlTimeseriesRequest
            }
            fetcherWith(urlTimeseriesRequest, extraArgs).then(([jsonData, extras]) => {
                consCacheLib.addUrlRequested(extras.url, consCache)
                jsonData.map((curTimeseries) => {
                    consCacheLib.associateTimeseriesIdAndFilterId(curTimeseries.id, extras.filterId, consCache)
                    consCacheLib.storeTimeseriesData(curTimeseries, consCache, consFixed)
                    return null
                })
                callbackFunc(extras.url)
            })

            // set all icons as in loading
            _setLocationIconsLoadingOnPromisse()
        } else {
            callbackFunc(urlTimeseriesRequest)
        }
    }

    // when in the 'evaluation' location icons for the 1st time
    // return: boolean. True if in the evaluation for the 1st time, false otherwise
    const _onContextIconsTypeEvaluation1st = () => {
        console.log('In evaluation for the first time?')
        const ICON_TYPE = 'evaluation'
        const atmVarStateContext = cloneDeep(atomVarStateContext)
        const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atmVarStateContext)
        let anyChange = false

        // if no metric selected, select one
        if (!iconsArgs.metric) {
            const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
            atsVarStateLib.setContextIconsArgs(ICON_TYPE, 'metric', allEvaluationIds[0],
                                                atmVarStateContext)
            iconsArgs.metric = allEvaluationIds[0]
            anyChange = true
        }

        // if no parameter group selected, select one
        const paramGroupIds = _getParameterGroupsOfMetric(iconsArgs.metric, settings)
            if ((!iconsArgs.parameterGroupId) && (paramGroupIds.length > 0)) {
            atsVarStateLib.setContextIconsArgs(ICON_TYPE, 'parameterGroupId', paramGroupIds[0],
                                                atmVarStateContext)
            iconsArgs.parameterGroupId = paramGroupIds[0]
            anyChange = true
        }

        // 
        const [simParameterId, obsParameterId] = _getSimObsParameterIds(iconsArgs.metric,
            iconsArgs.parameterGroupId, settings)

        // get all module ids
        const allSimModInstIds = consCacheLib.getModuleInstancesWithParameter(simParameterId, consCache)
        const allObsModInstIds = consCacheLib.getModuleInstancesWithParameter(obsParameterId, consCache)

        // if no simulation module instance selected, select one
        if ((!iconsArgs.simulationModuleInstanceId) && (allSimModInstIds) && (allSimModInstIds.size > 0)) {
            atsVarStateLib.setContextIconsArgs(ICON_TYPE, 'simulationModuleInstanceId',
                                               allSimModInstIds.values().next().value,
                                               atmVarStateContext)
            anyChange = true
        }

        // if no observation module instance selected, select one
        if ((!iconsArgs.observationModuleInstanceId) && (allObsModInstIds) && (allObsModInstIds.size > 0)) {
            atsVarStateLib.setContextIconsArgs(ICON_TYPE, 'observationModuleInstanceId',
                                               allObsModInstIds.values().next().value,
                                               atmVarStateContext)
            anyChange = true
        }

        // update if needed and return boolean flag
        if (anyChange) { 
            console.log("Updated context from evaluation subform.")
            setAtVarStateContext(atmVarStateContext)
        }

        // if the only information missing is the simulation, hide icons
        if (iconsArgs.metric && iconsArgs.parameterGroupId &&
            iconsArgs.observationModuleInstanceId) {
           
            new Promise((resolve, _) => { resolve(null) }).then(() => {
                console.log("hide stuffs by promise")
                const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
                const atmVarStateLocations = cloneDeep(atomVarStateLocations)
                atsVarStateLib.hideAllLocationIcons(atmVarStateLocations)
                atsVarStateLib.setMapLegendSubtitle('Evaluation:', atmVarStateDomMapLegend)
                atsVarStateLib.setMapLegendIcons({ 'NO DATA': null }, null, atmVarStateDomMapLegend)
                atsVarStateLib.setMapLegendVisibility(true, atmVarStateDomMapLegend)
                setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
                setAtVarStateLocations(atmVarStateLocations)
            })
       }

        console.log('In evaluation for the first time:', anyChange)
        return (anyChange)
    }

    // when in the 'evaluation' location icons for the 2nd time and on
    const _onContextIconsTypeEvaluation = () => {

        // basic check
        const iconsArgs = atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext)
        let continueIt = true
        if (!iconsArgs.metric) { continueIt = false }
        if (!iconsArgs.parameterGroupId) { continueIt = false }
        if (!iconsArgs.observationModuleInstanceId) { continueIt = false }
        if (!iconsArgs.simulationModuleInstanceId) { continueIt = false }
        if (!continueIt) { return (null) }
    
        // get obs and mod parameter IDs from parameter group
        const [simParameterId, obsParameterId] = _getSimObsParameterIds(
          iconsArgs.metric, iconsArgs.parameterGroupId, settings)
    
        // define URL to be called and skip call if this was the last URL called
        const urlTimeseriesCalcRequest = apiUrl(
          settings.apiBaseUrl, 'v1dw', 'timeseries_calculator', {
            filter: atsVarStateLib.getContextFilterId(atomVarStateContext),
            calc: iconsArgs.metric,
            simParameterId: simParameterId,
            obsParameterId: obsParameterId,
            obsModuleInstanceId: iconsArgs.observationModuleInstanceId,
            simModuleInstanceId: iconsArgs.simulationModuleInstanceId
          }
        )
    
        // final response function: get data from consCache and update varsState
        const callbackFunc = () => {
          const atmVarStateLocations = cloneDeep(atomVarStateLocations)
          const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
          atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
                                             atomVarStateContext, atmVarStateDomMapLegend,
                                             consCache, consFixed, settings)
          setAtVarStateLocations(atmVarStateLocations)
          setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
        }
    
        // if URL was already stored in the cache, update location icons
        // if not, request and set loading icons
        if (consCacheLib.wasUrlRequested(urlTimeseriesCalcRequest, consCache)) {
          consCacheLib.setEvaluationLastRequestUrl(urlTimeseriesCalcRequest, consCache)
          callbackFunc()
        } else {

          // icons to loading
          _setLocationIconsLoadingOnPromisse()

          // request URL, update local states, update cache, access cache
          const extraArgs = { url: urlTimeseriesCalcRequest }
          fetcherWith(urlTimeseriesCalcRequest, extraArgs).then(([jsonData, extras]) => {
            consCacheLib.addUrlRequested(extras.url, consCache)
            consCacheLib.storeEvaluationResponseData(extras.url, jsonData.evaluation, consCache)
            callbackFunc()
          })
        }
    }

    // for some reason, sometimes the update in the icons only takes effect on promisses
    const _setLocationIconsLoadingOnPromisse = () => {
        new Promise((resolve, _) => { resolve(null) }).then( _setLocationIconsLoading )
    }

    // 
    const _setLocationIconsLoading = () => {
      const atmVarStateLocations = cloneDeep(atomVarStateLocations)
      atsVarStateLib.setUniformIcon(settings.loadingLocationIcon, atmVarStateLocations)
      setAtVarStateLocations(atmVarStateLocations)
    }

    // TODO: temp code
    const _zoomToTimeResolution = (zoomLevel) => {
        if (zoomLevel < 12) {
           return '01h'
        } else if ((zoomLevel == 12) || (zoomLevel == 13) || (zoomLevel == 14)) {
            return '30m'
        } else {
            return '15m'
        }
    }

    // ** NO RENDER - JUST LOGIC ***************************************************************
    return null
}

export default VarsStateManager