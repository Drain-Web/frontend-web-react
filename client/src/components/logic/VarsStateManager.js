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
    const [atomVarStateDomMap, setAtVarStateDomMap] = useRecoilState(atVarStateDomMap)
    const [atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation] = 
        useRecoilState(atVarStateVectorGridAnimation)
    const atomVarStateDomTimeseriesPanel = useRecoilValue(atVarStateDomTimeseriesPanel)
    const atomVarStateVectorGridMode = useRecoilValue(atVarStateVectorGridMode)
    const [atomVarStateDomMapLegend, setAtVarStateDomMapLegend] =
        useRecoilState(atVarStateDomMapLegend)

    // contexts
    const { consCache } = useContext(ConsCache)

    // ** SET HOOKS ****************************************************************************

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

    }, [atomVarStateVectorGridMode])

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
    // TODO 1: only has the case for 'alerts'. Need to include the others from their components
    // TODO 2: make it smaller and move each case to its own private function
    useEffect(() => {

        // if in overview, ignore me
        if (atsVarStateLib.inMainMenuControlActiveTabOverview(atVarStateDomMainMenuControl)) {
            console.log("Do nothing!")
            return
        } else {
            console.log("DO IT! We are in:", atsVarStateLib.getMainMenuControlActiveTab(atVarStateDomMainMenuControl))
        }

        // consider case a case
        const curIconsType = atsVarStateLib.getContextIconsType(atomVarStateContext)
        if (curIconsType === "alerts") {
            const contextIconsArgs = atsVarStateLib.getContextIconsArgs('alerts',
                                                                        atomVarStateContext)
            let selectedThresholdGroup = contextIconsArgs.thresholdGroupId
            let selectedModuleInstanceId = contextIconsArgs.moduleInstanceId
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

        } else if (curIconsType === "uniform") {
            console.log("Go _onContextIconsTypeUniform() !")
            _onContextIconsTypeUniform()
        }

    }, [atsVarStateLib.getContextFilterId(atomVarStateContext),
        atsVarStateLib.getContextIconsType(atomVarStateContext)])


    // reactions related to EVALUATION icons
    // TODO 1: this should be moved to a function
    // TODO 2: the new function should also be invoked in the previous useEffect
    useEffect(() => {

        // basic check 1
        if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== 'evaluation') {
          return (null)
        }
    
        // basic check 2
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
    
        // define url to be called and skip call if this was the last URL called
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
          new Promise((resolve, _) => { resolve(null) }).then((value) => {
            _setLocationIconsLoading()
          })

          // request URL, update local states, update cache, access cache
          const extraArgs = { url: urlTimeseriesCalcRequest }
          fetcherWith(urlTimeseriesCalcRequest, extraArgs).then(([jsonData, extras]) => {
            consCacheLib.addUrlRequested(extras.url, consCache)
            consCacheLib.storeEvaluationResponseData(extras.url, jsonData.evaluation, consCache)
            callbackFunc()
          })
        }
    
    }, [
        atsVarStateLib.getContextIconsType(atomVarStateContext),
        atsVarStateLib.getContextFilterId(atomVarStateContext),
        atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext).metric,
        atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext).parameterGroupId,
        atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext).simulationModuleInstanceId,
        atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext).observationModuleInstanceId
    ])

    // ** No-hook private functions ************************************************************

    // TODO: move to a shared place
    const _getSimObsParameterIds = (metricId, parameterGroupId, settings) => {
      // return two strings: the parameter ID of the simulations and the parameter id of the observations
      const pgroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
      return [pgroups[parameterGroupId].parameters.sim, pgroups[parameterGroupId].parameters.obs]
    }

    // 
    const _onContextIconsTypeUniform = () => {
        console.log('From VarsStateManager!')

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
            
            console.log("updateLocationIcons from callback!")
            atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
                atomVarStateContext, atmVarStateDomMapLegend, consCache, consFixed, settings)
            
            // apply setters
            setAtVarStateLocations(atmVarStateLocations)
            setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
            console.log("Updated locationsIcons to:", JSON.stringify(atmVarStateLocations))
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
        } else {
            callbackFunc(urlTimeseriesRequest)
        }
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