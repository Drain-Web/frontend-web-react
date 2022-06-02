import React, { useContext, useEffect, useState } from "react";
import { cloneDeep } from 'lodash';

// import recoil to replace contexts
import { useRecoilState, useRecoilValue } from "recoil";

import {
    atVarStateContext, atVarStateLocations, atVarStateDomTimeSeriesData,
    atVarStateDomMainMenuControl,
    atVarStateDomMap, atVarStateVectorGridAnimation,
    atVarStateDomTimeseriesPanel
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

    // TODO: move it to a shared library
    // const atmVarStateLocations = cloneDeep(atomVarStateLocations);
    // const atmVarStateContext = cloneDeep(atomVarStateContext)
    // const atmVarStateDomTimeSeriesData = cloneDeep(atomVarStateDomTimeSeriesData);
    // const atmVarStateDomMainMenuControl = cloneDeep(atomVarStateDomMainMenuControl);

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

    // ** VarStateVectorGridAnimation **********************************************************

    // TODO: temp code
    // every time 'networkTimeIdx' is changed (useEffect), function itvFunc is scheduled to be
    //   called after 1000 milliseconds (1 second) and... HA! it will change 'networkTimeIdx'!
    useEffect(() => {
        
        const itvTime = atsVarStateLib.getVectorGridAnimationInterval(atomVarStateVectorGridAnimation)
        const itvFunc = () => {
            const curNetworkTimeIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation)

            // only do anything if player is running
            if (!atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
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
        atsVarStateLib.getVectorGridAnimationTimeResolution(atomVarStateVectorGridAnimation)]);

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

        console.log("Should do second updates here!")

    }, [atomVarStateContext])

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