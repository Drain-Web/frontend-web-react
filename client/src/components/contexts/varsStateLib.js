/*
 * Functions here are used to change VarsState consistently.
 * All the public functions output a consistent content of varsState that should be
 *   later used as argument for the function setVarsState().
 */

import VarsState from "./VarsState";

// Include a new location entry
const addLocation = (locationId, icon, display, varsState) => {
  varsState["locations"][locationId] = {
    icon: icon,
    display: display,
  };
};

// Include a set of new location entries
const addLocations = (locationIds, iconDefault, displayDefault, varsState) => {
  for (const locationId of locationIds) {
    addLocation(locationId, iconDefault, displayDefault, varsState);
  }
};

//
const getMainMenuControlShow = (varsState) => {
  return varsState["domObjects"]["mainMenuControl"]["show"];
};

//
const hideMainMenuControl = (varsState) => {
  varsState["domObjects"]["mainMenuControl"]["show"] = false;
};

// Just changes the value of the variable
const setContextFilterId = (filterId, varsState) => {
  varsState["context"]["filterId"] = filterId;
};

// Changes the type of the icons and fill its respective arguments
const setContextIcons = (iconsType, args, varsState) => {
  const argsKey = {
    uniform: "typeUniform",
    alerts: "typeAlert",
    evaluation: "typeEvaluation",
    competition: "typeCompetition",
    comparison: "typeComparison",
  }[iconsType];
  varsState["context"]["icons"]["iconType"] = iconsType;
  for (const k in args) {
    varsState["context"]["icons"][argsKey][k] = args[k];
  }
};

//
const showMainMenuControl = (varsState) => {
  varsState["domObjects"]["mainMenuControl"]["show"] = true;
};

//
const toggleMainMenuControl = (varsState) => {
  varsState["domObjects"]["mainMenuControl"]["show"] =
    !varsState["domObjects"]["mainMenuControl"]["show"];
};

/////////
//Time series plots
/////////

// Set the time series url to fetch data
const setTimeSerieUrl = (timeSerieUrl, varsState) => {
  varsState["domObjects"]["timeSeriesData"]["timeSerieUrl"] = timeSerieUrl;
};

// Set the data to be used for plots
const setTimeSeriesPlotData = (plotData, varsState) => {
  varsState["domObjects"]["timeSeriesData"]["plotData"] = plotData;
};

const setTimeSeriesPlotArrays = (plotArrays, varsState) => {
  varsState["domObjects"]["timeSeriesData"]["plotArrays"] = plotArrays;
};

const setTimeSeriesPlotAvailableVariables = (availableVariables, varsState) => {
  varsState["domObjects"]["timeSeriesData"]["availableVariables"] =
    availableVariables;
};

const setTimeSeriesPlotUnitsVariables = (unitsVariables, varsState) => {
  varsState["domObjects"]["timeSeriesData"]["unitsVariables"] = unitsVariables;
};

const setTimeSeriesPlotThresholdsArray = (thresholdsArray, varsState) => {
  varsState["domObjects"]["timeSeriesData"]["thresholdsArray"] =
    thresholdsArray;
};

// aggregate all public functions into a single namespace
const varsStateLib = {
  addLocation: addLocation,
  addLocations: addLocations,
  getMainMenuControlShow: getMainMenuControlShow,
  hideMainMenuControl: hideMainMenuControl,
  setContextFilterId: setContextFilterId,
  setContextIcons: setContextIcons,
  showMainMenuControl: showMainMenuControl,
  toggleMainMenuControl: toggleMainMenuControl,
  setTimeSerieUrl: setTimeSerieUrl,
  setTimeSeriesPlotData: setTimeSeriesPlotData,
  setTimeSeriesPlotArrays: setTimeSeriesPlotArrays,
  setTimeSeriesPlotAvailableVariables: setTimeSeriesPlotAvailableVariables,
  setTimeSeriesPlotUnitsVariables: setTimeSeriesPlotUnitsVariables,
  setTimeSeriesPlotThresholdsArray: setTimeSeriesPlotThresholdsArray,
};

export default varsStateLib;
