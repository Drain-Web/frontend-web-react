import { LayersControl, ZoomControl, useMap } from "react-leaflet";
import React, { useEffect, useContext } from "react";

// import components
import MapLocationsContext from '../contexts/MapLocationsContext'
import { MainMenuControl } from "./MainMenuControl";
import PolygonLayer from "../layers/PolygonLayer";
import PointsLayer from "../layers/PointsLayer";
import BaseLayers from "../layers/BaseLayers";
import Panel from "./Panel";
import GeoJsonLayerRiverNetwork from "../layers/GeoJsonLayerRiverNetwork";
import SearchField from "./GeoSearchBox";

// import contexts
import MapContext from "../contexts/MapContext";
import FilterContext from "../contexts/FilterContext";
import VarsState from "../contexts/VarsState";
import ConsFixed from "../contexts/ConsFixed";

// import assets
import { baseLayersData } from "../../assets/MapBaseLayers";

// import libs
import { onChangeFilterContextData } from './mapControler/mapControlerLib.js'


const MapControler = ({ settings }) => {

  // this specific component is needed to allow useMap()
  const map = useMap();

  // load old contexts (TODO: remove them)
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

  // load contexts
  const { varsState } = useContext(VarsState)
  const { consFixed } = useContext(ConsFixed)

  // when filterContextData is changed, load new filter data and refresh map
  // useEffect(onChangeFilterContextData, [filterContextData]);
  useEffect( () => { 
    onChangeFilterContextData(map, filterContextData, mapLocationsContextData,
                              setMapLocationsContextData, varsState, consFixed, settings)
  }, [filterContextData])

  return (
    <>
      <div>
        {" "}
        {/* <FlexContainer> */}
        {/* add the main left menu */}
        <FilterContext.Provider
          value={{ filterContextData, setFilterContextData }}
        >
          <MapLocationsContext.Provider
            value={{ mapLocationsContextData, setMapLocationsContextData }}
          >
            <MainMenuControl
              settings={settings}
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
