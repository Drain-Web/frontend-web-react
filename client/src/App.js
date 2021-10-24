import React, { useState } from "react";
import "regenerator-runtime/runtime";
import axios from "axios";
import useSWR from "swr";
import { MapContainer } from "react-leaflet";

// import custom components
import AppLoading from "./components/others/AppLoading";
import MapControler from "./components/others/MapControler";
import MapContext from "./components/contexts/MapContext";
import GetZoomLevel from "./components/others/GetZoomLevel";
import VarsState from "./components/contexts/VarsState";
import varsStateLib from "./components/contexts/varsStateLib";

// import libs
import { loadConsFixed, isStillLoadingConsFixed }
  from './libs/appLoad.js'

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

  // TODO: make this the only state
  const [varsState, setVarsState] = useState(VarsState._currentValue.varsState)

  // basic check for opening the system
  const consFixed = loadConsFixed(settings)

  // check if still loading
  const isLoading = isStillLoadingConsFixed(consFixed)
  if (isLoading) { return <AppLoading consFixed={consFixed} /> }

  /* ** FILL varState with default values ****************************************************** */
  /* ** TODO - move to appLoad.js ************************************************************** */

  let newVarsState = { ...varsState };
  let updatedVarsState = false;

  // add locations (if needed)
  if (Object.keys(varsState['locations']).length == 0) {
    const locationIds = consFixed['locations']['locations'].map(loc => loc['locationId']);
    const locationsIcon = settings['generalLocationIcon'];
    newVarsState = varsStateLib.addLocations(locationIds, locationsIcon, true, newVarsState);
    updatedVarsState = true
  }

  // set defalt context (if needed)
  if (!newVarsState['context']['filterId']) {
    newVarsState = varsStateLib.setContextFilterId(consFixed['region']['defaultFilter'],
                                                   newVarsState)
    newVarsState = varsStateLib.setContextIcons("uniform", {}, newVarsState)
    updatedVarsState = true
  }

  // trigger render (if needed)
  if (updatedVarsState) { setVarsState(newVarsState) }

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
          <MapControler settings={settings} consFixed={consFixed} />
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
    return <App settings={settingsData} />;
  } else {
    return <div>Load basic settings...</div>;
  }
};

export default AppSettings;
