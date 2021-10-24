import React, { useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import "regenerator-runtime/runtime";
import axios from "axios";
import useSWR from "swr";
import { MapContainer } from "react-leaflet";
// import 'core-js/stable'

// import custom components
import MapControler from "./components/others/MapControler";
import MapContext from "./components/contexts/MapContext";
import FlexContainer from "./components/others/FlexContainer";
import GetZoomLevel from "./components/others/GetZoomLevel";
import VarsState from "./components/contexts/VarsState";
import varStateLib from "./components/contexts/varsStateLib";

// import libs
import { loadConsFixed, isStillLoadingConsFixed, isStillLoadingConsFixedValue }
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

// function for defining the '' or 'not loading' message
const wasLoaded = (k, v) => {
  return (
    <>
      &nbsp;&nbsp;-&nbsp;&nbsp;{k}: { isStillLoadingConsFixedValue(v) ? '...' : 'loaded' }<br />
    </>
  )
}

// build loading message
const loadingMessage = (cF) => {
  return (
    <div>
      Loading...<br />
      {wasLoaded('regions', cF['region'])}
      {wasLoaded('boundaries', cF['boundaries'])}
      {wasLoaded('filters', cF['filters'])}
      {wasLoaded('locations', cF['locations'])}
      {wasLoaded('threshold groups', cF['thresholdGroups'])}
      {wasLoaded('threshold value sets', cF['thresholdValueSets'])}
      {wasLoaded('parameters', cF['parameters'])}
      {wasLoaded('parameter groups', cF['parameterGroups'])}
      <br />
      <Spinner
        animation="border"
        variant="danger"
        role="status"
        style={{
          width: "400px",
          height: "400px",
          margin: "auto",
          display: "block",
        }}
      />
    </div>
  );
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
  if (isLoading) { return loadingMessage(consFixed) }

  /* ** FILL varState with default values ****************************************************** */
  /* ** TODO - move to appLoad.js ************************************************************** */

  // add locations
  if (Object.keys(varsState['locations']).length == 0) {
    varStateLib.addLocations(consFixed['locations']['locations'].map(loc => loc['locationId']),
                             'icoDef', false, varsState, setVarsState)
  }

  // set defalt context
  if (!varsState['context']) {
    // TODO: varStateLib.setContextFilterId()
    // TODO: varStateLib.setContextIcons("uniform", {})
  }

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
      <VarsState.Provider value={ {varsState, setVarsState} }>
        <MapContainer center={position} zoom={zoom} zoomControl={false}>
          <GetZoomLevel />
          <MapControler settings={settings} consFixed={consFixed}/>
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
