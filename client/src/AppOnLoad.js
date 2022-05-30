import React, { useState, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import { cloneDeep } from 'lodash';
import { useRecoilState, useRecoilValue } from "recoil";

// import custom components
import AppLoading from "./components/others/AppLoading";
import AppOnInit from "./AppOnInit";
import MapControler from "./components/others/MapControler";
import GetZoomLevel from "./components/others/GetZoomLevel";

// import contexts
import ConsCache from "./components/contexts/ConsCache";
import ConsFixed from "./components/contexts/ConsFixed";
import VarsStateManager from "./components/logic/VarsStateManager";

// import contexts
import { atVarStateContext, atVarStateLocations, atVarStateDomTimeSeriesData,
    atVarStateDomMainMenuControl } from "./components/atoms/atsVarState";

// import libs
import appLoad from "./libs/appLoad.js";
import { useStateManager } from "./components/logic/myHook";

const AppOnLoad = ({ settings }) => {
  // ** SET HOOKS ******************************************************************************

  // Contexts
  const consCache = useState(ConsCache._currentValue.consCache)[0];
  const consFixed = useState(appLoad.loadConsFixed(settings))[0];

  const atomVarStateContext = useRecoilValue(atVarStateContext)

  // ** MAIN RENDER ****************************************************************************

  if (appLoad.isStillLoadingConsFixed(consFixed)) {
    // still loading
    return (<AppLoading />);
  
  } else  {
    // loaded
    return (
      <ConsFixed.Provider value={{ consFixed }}>
        <ConsCache.Provider value={{ consCache }}>
          <AppOnInit settings={settings} />
        </ConsCache.Provider>
      </ConsFixed.Provider>
    );

    /*
      <VarsStateManager settings={settings} consFixed={consFixed} />
        <MapContainer zoomControl={false}>
          {
          // TODO: bring back
          //<GetZoomLevel />
          }
        <MapControler settings={settings} />
      </MapContainer>
    */

  }
}

export default AppOnLoad;
