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
import MapContext from "./components/contexts/MapContext";
import ConsFixed from "./components/contexts/ConsFixed";
import VarsState from "./components/contexts/VarsState";

// import libs
import appLoad from './libs/appLoad.js'

// import CSS styles
import "style/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "style/GeoSearchBox.css";
import "./App.css";

/* ** FUNCTIONS ******************************************************************************** */

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

// function used to fill the filterContext dictionary
const fillFilterContextData = (filterId, filterContextData) => {

  if (!filterId) return {};

  const curFilterIdSplit = filterId.split(".");

  // TODO - make it more general
  if (curFilterIdSplit.length !== 2) {
    console.log("Unable to parse filter ID: ", filterId);
    return null;
  }

  // set attributes
  filterContextData.evtFilterId = curFilterIdSplit[0];
  filterContextData.geoFilterId = curFilterIdSplit[1];
  filterContextData.filterId = filterId;

  return null;
};

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

  // Estado - enpoint para series de tiempo
  const [timeSerieUrl, setTimeSerieUrl] = useState(null);

  // Panel state - show or hide
  const [isHidden, setIsHidden] = useState(false);
  const [activePointFeature, setActivePointFeature] = useState(null);

  // Context states
  const [filterContextData, setFilterContextData] = useState({});
  const [mapLocationsContextData, setMapLocationsContextData] = useState({});
  const [activeTab, setActiveTab] = useState("tabFilters");
  const [zoomLevel, setZoomLevel] = useState(9);

  // TODO: make these the only states
  const [varsState, setVarsState] = useState(VarsState._currentValue.varsState)
  const consFixed = useState(appLoad.loadConsFixed(settings))[0]

  // check if still loading
  if (appLoad.isStillLoadingConsFixed(consFixed)) { return <AppLoading /> }


  /* ** FILL varState with default values ****************************************************** */

  // update varsState and trigger render if needed
  let updatedVarsState = false;
  if (appLoad.setVarsStateLocations(consFixed, settings, varsState)) { updatedVarsState = true; }
  if (appLoad.setVarsStateContext(consFixed, settings, varsState)) { updatedVarsState = true; }
  if (updatedVarsState) { setVarsState(varsState) }
  

  /* ** MAIN RENDER **************************************************************************** */

  // currently active filter
  if (!("filterId" in filterContextData)) {
    fillFilterContextData(consFixed['region'].defaultFilter, filterContextData);
  }

  // gets the central coordinates of the map into const 'position'
  const posXY = getMapCenter(consFixed['region'].map.defaultExtent);
  const position = [posXY.y, posXY.x];

  // defines zoom level
  // TODO: make it a function of the map extents
  const zoom = 9;

  const consCache = {
    filters: {},
    location: {}
  }

  return (
    <MapContext.Provider
      value={{
        activePointFeature,
        setActivePointFeature,
        isHidden,
        setIsHidden,
        timeSerieUrl,
        setTimeSerieUrl,
        filterContextData,
        setFilterContextData,
        mapLocationsContextData,
        setMapLocationsContextData,
        activeTab,
        setActiveTab,
        zoomLevel,
        setZoomLevel
      }}
    >
      <VarsState.Provider value={{ varsState, setVarsState }}>
        <MapContainer center={position} zoom={zoom} zoomControl={false}>
          <GetZoomLevel />
          <MapControler settings={settings} />
        </MapContainer>
      </VarsState.Provider>
    </MapContext.Provider>
  );
};

const AppSettings = () => {
  /* ** SET HOOKS ****************************************************************************** */

  // read app settings
  const settingsData = useState({})[0];
  const { data: dataSettings, error: errorSettings } = useSWR("settings.json", fetcher);

  /* ** MAIN RENDER  *************************************************************************** */

  if (dataSettings && !errorSettings) {
    for (const i in dataSettings) settingsData[i] = dataSettings[i];
    return (
      <ConsFixed.Provider value={ ConsFixed._currentValue } >
        <App settings={settingsData} />
      </ConsFixed.Provider>
    )
  } else {
    return <div>Load basic settings...</div>;
  }
};

export default AppSettings;
