import { LayersControl, ZoomControl, useMap } from "react-leaflet";
import React, { useEffect, useContext } from "react";
import axios from "axios";

// import components
import { MainMenuControl } from "./MainMenuControl";
import MapLocationsContext from "./MapLocationsContext";
import FilterContext from "./FilterContext";
import PolygonLayer from "./PolygonLayer";
import PointsLayer from "./PointsLayer";
import MapContext from "./MapContext";
import BaseLayers from "./BaseLayers";
import Panel from "./Panel";
import FlexContainer from "./FlexContainer";

// import assets
import { baseLayersData } from "../assets/MapBaseLayers";

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

const updateLocations = (jsonData, setMapLocationsContextData) => {
  // this function updates TODO
  const filteredLocations = {};
  const filteredParameters = {};

  for (const curFilteredTimeseries of jsonData) {
    const locationId = curFilteredTimeseries.header.location_id;
    const parameterId = curFilteredTimeseries.header.parameterId;

    if (!(locationId in filteredLocations)) {
      filteredLocations[locationId] = [];
    }
    if (!(parameterId in filteredParameters)) {
      filteredParameters[parameterId] = [];
    }

    filteredLocations[locationId].push({
      timeseriesId: curFilteredTimeseries.id,
    });
    filteredParameters[parameterId].push({
      timeseriesId: curFilteredTimeseries.id,
      locationId: locationId,
    });
  }

  setMapLocationsContextData({
    byLocations: filteredLocations,
    byParameter: filteredParameters,
  });
};

const MapControler = () => {
  // this specific component is needed to allow useMap()

  const {
    locationsData,
    isHidden,
    setIsHidden,
    timeSerieUrl,
    setTimeSerieUrl,
    filterContextData,
    setFilterContextData,
    mapLocationsContextData,
    setMapLocationsContextData,
    boundariesData,
    regionData,
    filtersData,
    ids,
  } = useContext(MapContext);
  const map = useMap();

  // when filterContextData is changed, load new filter data and refresh map
  useEffect(() => {
    if (!("filterId" in filterContextData)) return null;

    const urlFilterRequest =
      "https://hydro-web.herokuapp.com/v1/filter/".concat(
        filterContextData.filterId
      );

    const urlTimeseriesRequest =
      "https://hydro-web.herokuapp.com/v1/timeseries/?filter=".concat(
        filterContextData.filterId
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
      updateLocations(jsonData, setMapLocationsContextData);
    });
  }, [filterContextData]);

  return (
    <>
      <FlexContainer>
        {/* add the main floating menu */}
        <FilterContext.Provider
          value={{ filterContextData, setFilterContextData }}
        >
          <MapLocationsContext.Provider value={{ mapLocationsContextData }}>
            <MainMenuControl
              position="topleft"
              regionName={regionData.systemInformation.name}
              filtersData={filtersData}
            />
          </MapLocationsContext.Provider>
        </FilterContext.Provider>

        {/* hyrographs panel */}
        <Panel
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
          position="leaflet-right"
        />
        {/* position='Right' */}

        <LayersControl>
          <BaseLayers baseLayerData={baseLayersData} />

          {/* adds layer of points as a react component */}
          <MapLocationsContext.Provider value={{ mapLocationsContextData }}>
            <PointsLayer
              layerData={locationsData}
              layerName="Locations"
              iconUrl="./img/browndot.png"
              ids={ids}
              timeSerieUrl={timeSerieUrl}
              setTimeSerieUrl={setTimeSerieUrl}
              setIsHidden={setIsHidden}
            />
          </MapLocationsContext.Provider>

          {/* adds a polygon layer to the control and the map as a component  */}
          <FilterContext.Provider value={{ filterContextData }}>
            <PolygonLayer
              layerData={boundariesData}
              layerName="Boundaries"
              reversePolygon
            />
          </FilterContext.Provider>
        </LayersControl>

        <ZoomControl position="bottomright" />
      </FlexContainer>
    </>
  );
};

export default MapControler;
