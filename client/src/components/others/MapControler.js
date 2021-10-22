import { LayersControl, ZoomControl, useMap } from "react-leaflet";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useSpring } from "react-spring";

// import components
import { MainMenuControl } from "./MainMenuControl";
import MapLocationsContext, {
  constraintLocationsShownByParameters,
  showThresholdValueSetsBySelectedParameters,
} from "../contexts/MapLocationsContext";
import FilterContext from "../contexts/FilterContext";
import PolygonLayer from "../layers/PolygonLayer";
import PointsLayer from "../layers/PointsLayer";
import MapContext from "../contexts/MapContext";
import BaseLayers from "../layers/BaseLayers";
import Panel from "./Panel";
import GeoJsonLayerRiverNetwork from "../layers/GeoJsonLayerRiverNetwork";
import SearchField from "./GeoSearchBox";

// import assets
import { baseLayersData } from "../../assets/MapBaseLayers";

// import libs
import { apiUrl } from "../../libs/api.js";

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

const getThesholdValueSet = (threshLevelId, thresholdValueSets) => {
  // Given a threshold level ID, identifies its theshold value set

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

const getParameterIds = (contThreshValueSetId, filteredTimeseries) => {
  // Identifies the parameters of the timeseries that are subject to a given ThreshValueSet

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

const buildThreshGroupBy = (
  thresholdGroups,
  thresholdValueSets,
  filteredTimeseries
) => {
  // TODO: Create a new lib file and move this function there

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
};

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
  // this function updates the view of the locations when the view is for filter
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

const updateLocationsToOverview = (
  mapLocationsContextData,
  setMapLocationsContextData
) => {
  // this function updates the view of the locations when the view if for overview

  if (!mapLocationsContextData.byLocations) return;

  const updLocs = mapLocationsContextData.byLocations;
  for (const curLocationId of Object.keys(updLocs)) {
    updLocs[curLocationId].show = true;
  }
  setMapLocationsContextData({
    ...mapLocationsContextData,
    byLocations: updLocs,
  });
};

const MapControler = ({ settings, consFixed }) => {

  // this specific component is needed to allow useMap()
  const {
    isHidden,
    setIsHidden,
    timeSerieUrl,
    setTimeSerieUrl,
    filterContextData,
    setFilterContextData,
    mapLocationsContextData,
    setMapLocationsContextData
  } = useContext(MapContext);
  const map = useMap();

  const [showMainMenuControl, setShowMainMenuControl] = useState(true);

  // when filterContextData is changed, load new filter data and refresh map
  useEffect(() => {
    // updates mapLocationsContextData

    if (filterContextData.inOverview) {
      // if it is overview, show all locations and all boundaries

      // move map to initial zoom
      const defaultExt = regionData.map.defaultExtent;
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
    }
  }, [filterContextData]);

  return (
    <>
      <div>
        {" "}
        {/* <FlexContainer> */}
        {/* add the main floating menu */}
        <FilterContext.Provider
          value={{ filterContextData, setFilterContextData }}
        >
          <MapLocationsContext.Provider
            value={{ mapLocationsContextData, setMapLocationsContextData }}
          >
            <MainMenuControl
              regionName={consFixed['region'].systemInformation.name}
              filtersData={consFixed['filters']}
              locationsData={consFixed['locations']}
              thresholdValueSets={consFixed['thresholdValueSets']}
              thresholdGroups={consFixed['thresholdGroup']}
              overviewFilter={settings.overviewFilter}
              showMainMenuControl={showMainMenuControl}
              setShowMainMenuControl={setShowMainMenuControl}
              position="leaflet-right"
            />
          </MapLocationsContext.Provider>
        </FilterContext.Provider>
        {/* hyrographs panel */}
        <Panel
          hideAll={timeSerieUrl}
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
          position="leaflet-right"
        />
        <LayersControl>
          <BaseLayers baseLayerData={baseLayersData} />

          {/* adds layer of points as a react component */}
          <MapLocationsContext.Provider value={{ mapLocationsContextData }}>
            <FilterContext.Provider value={{ filterContextData }}>
              <PointsLayer
                layerData={consFixed['locations']}
                layerName="Locations"
                iconUrl={settings.generalLocationIcon}
              />
            </FilterContext.Provider>
          </MapLocationsContext.Provider>

          {/* adds a polygon layer to the control and to the map as a component - boundaries */}
          <FilterContext.Provider value={{ filterContextData }}>
            <PolygonLayer
              layerData={consFixed['boundaries']}
              layerName="Boundaries"
              reversePolygon
            />
          </FilterContext.Provider>

          {/* adds GeoJson layer to the control and to the map as a component - river network */}

          {settings.riverNetwork.fullRaw ? (
            <GeoJsonLayerRiverNetwork
              layerSettings={settings.riverNetwork.fullRaw}
            />
          ) : (
            <></>
          )}
        </LayersControl>
        <SearchField />
        <ZoomControl position="bottomright" />
      </div>{" "}
      {/* </FlexContainer> */}
    </>
  );
};

export default MapControler;
