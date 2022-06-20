import React, {useContext, useEffect} from "react";
import { useRecoilState } from "recoil";
import { cloneDeep } from 'lodash';

// import custom components
import AppReady from "./AppReady";

// import contexts and atoms
import ConsFixed from "./components/contexts/ConsFixed";
import { atVarStateContext, atVarStateDomTimeSeriesData, atVarStateDomMainMenuControl }
    from "./components/atoms/atsVarState";

// import lib
import appLoad from "./libs/appLoad";

const AppOnLoad = ({ settings }) => {

    // ** SET HOOKS ****************************************************************************

    const { consFixed } = useContext(ConsFixed)

    const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
    const [atomVarStateDomTimeSeriesData, setAtVarStateDomTimeSeriesData] = 
        useRecoilState(atVarStateDomTimeSeriesData)
    const [atomVarStateDomMainMenuControl, setAtVarStateDomMainMenuControl] = 
        useRecoilState(atVarStateDomMainMenuControl)

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
    }, [])

    // ** MAIN RENDER **************************************************************************
    
    if (atomVarStateContext.filterId) {
        return (<AppReady settings={settings} />)
    } else {
        return (<div>Initiating...</div>)
    }
    
}

export default AppOnLoad
