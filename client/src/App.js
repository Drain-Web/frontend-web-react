import React, { useContext, useState } from "react";
import "regenerator-runtime/runtime";
import axios from "axios";
import useSWR from "swr";
import { MapContainer } from "react-leaflet";

// import custom components
import AppLoading from "./components/others/AppLoading";
import MapControler from "./components/others/MapControler";
import GetZoomLevel from "./components/others/GetZoomLevel";

// import contexts
import ConsCache from "./components/contexts/ConsCache";
import ConsFixed from "./components/contexts/ConsFixed";
import VarsState from "./components/contexts/VarsState";
import varsStateLib from "./components/contexts/varsStateLib";

// import libs
import appLoad from "./libs/appLoad.js";

// import CSS styles
import "style/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./App.css";

/* ** FUNCTIONS ******************************************************************************** */

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

//
const getMapCenter = (mapExtent) => {
  return {
    x: (mapExtent.right + mapExtent.left) / 2,
    y: (mapExtent.top + mapExtent.bottom) / 2,
  };
};

/* ** REACT COMPONENTS ************************************************************************* */

const App = ({ settings }) => {
  /* ** SET HOOKS ****************************************************************************** */

  // Contexts
  const consCache = useState(ConsCache._currentValue.consCache)[0];
  const consFixed = useState(appLoad.loadConsFixed(settings))[0];
  const [varsState, setVarsState] = useState(VarsState._currentValue.varsState);
  const setVarState = useState(null)[1];

  // check if still loading
  if (appLoad.isStillLoadingConsFixed(consFixed)) {
    return <AppLoading />;
  }

  /* ** FILL varState with default values ****************************************************** */

  // update varsState
  let updatedVarsState = false;
  if (appLoad.setVarsStateLocations(consFixed, settings, varsState)) {
    updatedVarsState = true;
  }
  if (appLoad.setVarsStateContext(consFixed, settings, varsState)) {
    updatedVarsState = true;
  }

  // trigger render if needed
  if (updatedVarsState) {
    setVarsState(varsState);
  }

  /* ** MAIN RENDER **************************************************************************** */

  return (
    <VarsState.Provider value={{ varsState, setVarState }}>
      <ConsCache.Provider value={{ consCache }}>
        <MapContainer zoomControl={false}>
          <GetZoomLevel />
          <MapControler settings={settings} />
        </MapContainer>
      </ConsCache.Provider>
    </VarsState.Provider>
  );
};

const AppSettings = () => {
  /* ** SET HOOKS ****************************************************************************** */

  // read app settings
  const settingsData = useState({})[0];
  const { data: dataSettings, error: errorSettings } = useSWR(
    "settings.json",
    fetcher
  );

  /* ** MAIN RENDER  *************************************************************************** */

  if (dataSettings && !errorSettings) {
    for (const i in dataSettings) settingsData[i] = dataSettings[i];
    return (
      <ConsFixed.Provider value={ConsFixed._currentValue}>
        <App settings={settingsData} />
      </ConsFixed.Provider>
    );
  } else {
    return <div>Load basic settings...</div>;
  }
};

export default AppSettings;
