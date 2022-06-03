import React, { useContext, useEffect, useState } from "react";
import { cloneDeep } from 'lodash';

// import recoil to replace contexts
import { useRecoilState, useRecoilValue } from "recoil";

// caches
import ConsCache from "../contexts/ConsCache";
import consCacheLib from "../contexts/consCacheLib";

// atoms
import {
    atVarStateContext, atVarStateLocations, atVarStateDomTimeSeriesData,
    atVarStateDomMainMenuControl,
    atVarStateDomMap, atVarStateVectorGridAnimation,
    atVarStateDomTimeseriesPanel, atVarStateVectorGridMode
} from "../atoms/atsVarState";
import atsVarStateLib from "../atoms/atsVarStateLib";

// import libs
import appLoad from "../../libs/appLoad.js";

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

    // ** Icons

    // 
    useEffect(() => {

        if (atsVarStateLib.getContextIconsType(atomVarStateContext) === "alerts") {
            const contextIconsArgs = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext)
            let selectedThresholdGroup = contextIconsArgs.thresholdGroupId
            const selectedModuleInstanceId = contextIconsArgs.moduleInstanceId

            // if no thresholdGroup selected, select one
            if (!selectedThresholdGroup) {
                const atmVarStateContext = cloneDeep(atomVarStateContext)
                selectedThresholdGroup = Object.keys(consFixed.thresholdGroup)[0]
                console.log("Will set As...")
                atsVarStateLib.setContextIcons('alerts',
                                               { thresholdGroupId: selectedThresholdGroup },
                                               atmVarStateContext)
                setAtVarStateContext(atmVarStateContext)
                console.log(" ...set thresh group as:", selectedThresholdGroup)
            }

            // if no moduleInstanceId selected, select one
            if (!selectedModuleInstanceId) {
                const moduleInstancesIds = consCacheLib.getModuleInstancesOfThreshouldGroup(selectedThresholdGroup, consCache)
                const atmVarStateContext = cloneDeep(atomVarStateContext)
                console.log("Modules from", selectedThresholdGroup, ":", moduleInstancesIds)
                const moduleInstanceInstanceId = Array.from(moduleInstancesIds)[0]
                console.log("Will set Bs...")
                atsVarStateLib.setContextIcons('alerts', { moduleInstanceId: moduleInstanceInstanceId }, atmVarStateContext)
                setAtVarStateContext(atmVarStateContext)
                console.log(" ...set Bs.")

                return <></>
            }

        } else {
            console.log("Not refactored yet:", atsVarStateLib.getContextIconsType(atomVarStateContext))
        }

        console.log("Should do second updates here!")

    }, [atsVarStateLib.getContextIconsType(atomVarStateContext)])

    // ** No-hook functions ********************************************************************

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