import { apiUrl } from "../../../libs/api.js"
import axios from "axios"

import {
  constraintLocationsShownByParameters, showThresholdValueSetsBySelectedParameters
} from '../../contexts/MapLocationsContext'

// function 'fetcher' will do HTTP requests
// TODO: find a public library to put it
const fetcher = (url) => axios.get(url).then((res) => res.data);


// TODO: Reviw if this should be somewhere else
// private
const buildThreshGroupBy = (
    thresholdGroups,
    thresholdValueSets,
    filteredTimeseries
  ) => {
  
    const retDict = {
      byParameter: {},
      byParameterGroup: {},
    };
  
    for (const threshGroup in thresholdGroups) {
      const threshGroupObj = thresholdGroups[threshGroup];
      const valueToKey = [];
      const paramIds = new Set();
  
      for (const levelThreshIdx in threshGroupObj.threshold_levels) {
        const threshLevel = threshGroupObj.threshold_levels[levelThreshIdx];
  
        // iterate over ThreshValueSet to get the one this LevelThresh
        const [contThreshValueSetId, valueFunction] = getThesholdValueSet(
          threshLevel.id,
          thresholdValueSets
        );
  
        // basic check
        if (contThreshValueSetId == null) {
          console.warn(
            "UNABLE TO DEFINE A ThresholdValueSet FOR LevelThreshold",
            threshLevel.id,
            "OF ThreshGroup",
            threshGroupObj.id
          );
          console.warn("POSSIBLE REASON: Inconsistent data from API.");
          break;
        }
  
        // identify parameter IDs
        const curParamIds = getParameterIds(
          contThreshValueSetId,
          filteredTimeseries
        );
        curParamIds.forEach(paramIds.add, paramIds);
  
        // identify parameter groups IDs
        // TODO
  
        // add to stuff
        valueToKey.push({
          levelThreshold: threshLevel,
          valueFunction: valueFunction,
        });
      }
  
      // create keys
      for (const paramId of paramIds) {
        if (!retDict.byParameter[paramId]) {
          retDict.byParameter[paramId] = {};
        }
        retDict.byParameter[paramId][threshGroupObj.id] = valueToKey;
      }
    }
  
    return retDict;
  }


// Identifies the parameters of the timeseries that are subject to a given ThreshValueSet
// Internal use
const getParameterIds = (contThreshValueSetId, filteredTimeseries) => {
    
  const paramIds = new Set();
  for (const tsIdx in filteredTimeseries) {
    const ts = filteredTimeseries[tsIdx];
    for (const threshValueSetIdx in ts.thresholdValueSets) {
      if (ts.thresholdValueSets[threshValueSetIdx].id == contThreshValueSetId) {
        paramIds.add(ts.header.parameterId);
      }
    }
  }
  
  return paramIds;
};


// Given a threshold level ID, identifies its theshold value set and respective value function
// Internal use
const getThesholdValueSet = (threshLevelId, thresholdValueSets) => {

  let [contThreshValueSetId, valueFunction] = [null, null];

  for (const threshValueSetId in thresholdValueSets) {
    const threshValueSet = thresholdValueSets[threshValueSetId];
    for (const threshValue of threshValueSet.levelThresholdValues) {
      if (threshValue.levelThresholdId === threshLevelId) {
        valueFunction = threshValue.valueFunction;
        break;
      }
    }
    if (valueFunction != null) {
      contThreshValueSetId = threshValueSetId;
      break;
    }
  }
  return [contThreshValueSetId, valueFunction];
};


// Updates mapLocationsContextData
// public
const onChangeFilterContextData = (map, filterContextData, mapLocationsContextData, setMapLocationsContextData, consFixed, settings) => {
    
    if (filterContextData.inOverview) {
      // if it is overview, show all locations and all boundaries

      // move map to initial zoom
      const defaultExt = consFixed['region'].map.defaultExtent;
      map.flyToBounds([
        [defaultExt.bottom, defaultExt.left],
        [defaultExt.top, defaultExt.right],
      ]);

      // show all locations
      updateLocationsToOverview(
        mapLocationsContextData,
        setMapLocationsContextData
      );

      return null;
    } else {
      // if it is not overview, apply filter changes

      if (!("filterId" in filterContextData)) return null;

      // define URLs
      const urlFilterRequest = apiUrl(
        settings.apiBaseUrl,
        "v1",
        "filter",
        filterContextData.filterId
      );
      const urlTimeseriesRequest = apiUrl(
        settings.apiBaseUrl,
        "v1",
        "timeseries",
        {
          filter: filterContextData.filterId,
          showStatistics: true,
          onlyHeaders: true,
        }
      );

      // move map view to fit the map extent
      fetcher(urlFilterRequest).then((jsonData) => {
        const newMapExtent = jsonData.map.defaultExtent;
        map.flyToBounds([
          [newMapExtent.bottom, newMapExtent.left],
          [newMapExtent.top, newMapExtent.right],
        ]);
      });

      // only show locations with timeseries in the filter
      fetcher(urlTimeseriesRequest).then((jsonData) => {
        updateLocationsByFilter(
          jsonData,
          mapLocationsContextData,
          setMapLocationsContextData,
          consFixed['thresholdValueSets'],
          consFixed['thresholdGroup'],
          consFixed['parameters'],
          consFixed['parameterGroups'],
          filterContextData.filterId
        );
      });

      return null
    }
  }


// Updates the locations' icons when the tab is changed to 'Filter'
// private
const updateLocationsByFilter = (
    filteredTimeseries,
    mapLocationsContextData,
    setMapLocationsContextData,
    thresholdValueSets,
    thresholdGroups,
    parameters,
    parameterGroups,
    filterId
  ) => {

    // TODO: review all that to use varsState
    
    const updLocs = mapLocationsContextData.byLocations
      ? mapLocationsContextData.byLocations
      : {};
    const updParams = {};
    const updThreshValueSets = {};
    const selectedParams = mapLocationsContextData.showParametersLocations;
  
    // hide all pre existing locations
    for (const curLocationId of Object.keys(updLocs)) {
      updLocs[curLocationId].show = false;
    }
  
    //
    for (const curFilteredTimeseries of filteredTimeseries) {
      const locationId = curFilteredTimeseries.header.location_id;
      const parameterId = curFilteredTimeseries.header.parameterId;
      const timeseriesId = curFilteredTimeseries.id;
      const thresholdValueSets = curFilteredTimeseries.thresholdValueSets;
  
      // add parameter no matter what
      if (!(parameterId in updParams)) {
        updParams[parameterId] = [];
      }
      updParams[parameterId].push({
        timeseriesId: timeseriesId,
        locationId: locationId,
      });
  
      // add threshold value sets
      thresholdValueSets.forEach((curThresholdValueSet) => {
        if (!(curThresholdValueSet.id in updThreshValueSets)) {
          updThreshValueSets[curThresholdValueSet.id] = {
            timeseries: [],
            showAsOption: false,
          };
        }
        updThreshValueSets[curThresholdValueSet.id].timeseries.push({
          timeseriesId: timeseriesId,
          locationId: locationId,
          iconUrl: null, // TODO - ignored now, make use of it
          parameterId: parameterId,
        });
      });
  
      // verifies if add location
      if (selectedParams && !selectedParams.has(parameterId)) {
        continue;
      }
  
      // add location if needed
      if (!(locationId in updLocs)) {
        updLocs[locationId] = {
          timeseries: {},
        };
      }
      if (!updLocs[locationId].timeseries[parameterId]) {
        updLocs[locationId].timeseries[parameterId] = {};
      }
  
      // set to be show and include timeseries
      updLocs[locationId].timeseries[parameterId][timeseriesId] = {
        filterId: filterId,
      };
      updLocs[locationId].show = true;
  
      // add statistics if they are present
      if ("maxValue" in curFilteredTimeseries) {
        updLocs[locationId].timeseries[parameterId][timeseriesId]["maxValue"] =
          curFilteredTimeseries.maxValue;
      }
      if ("minValue" in curFilteredTimeseries) {
        updLocs[locationId].timeseries[parameterId][timeseriesId]["minValue"] =
          curFilteredTimeseries.minValue;
      }
    }
  
    const pre = {
      ...mapLocationsContextData,
      byLocations: updLocs,
      byThresholdValueSet: updThreshValueSets,
      byParameter: updParams,
      thresholdGroups: buildThreshGroupBy(
        thresholdGroups,
        thresholdValueSets,
        filteredTimeseries
      ),
    };
  
    const pos = showThresholdValueSetsBySelectedParameters(
      constraintLocationsShownByParameters(pre)
    );
  
    setMapLocationsContextData(pos);
  };


// Updates the locations' icons when the tab is changed to 'overview'
// private
const updateLocationsToOverview = (
  mapLocationsContextData,
  setMapLocationsContextData
) => {
  
  // does nothing if no location is available yet
  // TODO: should load all locations
  if (!mapLocationsContextData.byLocations) return;
  
  // get all locations and show their icons
  // TODO: should work with varsState instead
  // TODO: should ensure icons are the default ones
  const updLocs = mapLocationsContextData.byLocations;
  for (const curLocationId of Object.keys(updLocs)) {
    updLocs[curLocationId].show = true;
  }

  // apply changes
  // TODO: check if this is how it is done
  setMapLocationsContextData({
    ...mapLocationsContextData,
    byLocations: updLocs,
  });
}

export {onChangeFilterContextData}

