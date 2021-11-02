import { LayersControl, ZoomControl, useMap } from "react-leaflet";
import React, { useEffect, useContext } from "react";

// import components
import MainMenuControl from "./MainMenuControl";
import PolygonLayer from "../layers/PolygonLayer";
import PointsLayer from "../layers/PointsLayer";
import BaseLayers from "../layers/BaseLayers";
import Panel from "./Panel";
import GeoJsonLayerRiverNetwork from "../layers/GeoJsonLayerRiverNetwork";
import SearchField from "./GeoSearchBox";

// import contexts
import MapContext from "../contexts/MapContext";
import ConsCache from "../contexts/ConsCache";
import consCacheLib from "../contexts/consCacheLib";
import ConsFixed from "../contexts/ConsFixed";
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

// import assets
import { baseLayersData } from "../../assets/MapBaseLayers";

// import libs
// import { onChangeFilterContextData } from './mapControler/mapControlerLib.js'
import mapControlerLib from './mapControler/mapControlerLib.js'

const MapControler = ({ settings }) => {

  // this specific component is needed to allow useMap()
  const map = useMap();

  // load old contexts (TODO: remove them)
  const {
    isHidden,
    setIsHidden,
    timeSerieUrl,
    setTimeSerieUrl,
    mapLocationsContextData,
    setMapLocationsContextData
  } = useContext(MapContext);

  // load contexts
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  const { varsState, setVarState } = useContext(VarsState)

  // when filterContextData is changed, load new filter data and refresh map
  // useEffect(onChangeFilterContextData, [filterContextData]);
  /*
  useEffect( () => {
    onChangeFilterContextData(map, filterContextData, mapLocationsContextData,
                              setMapLocationsContextData, varsState, consFixed, settings)
  }, [filterContextData])
  */

  // when filterContextData is changed, load new filter data and refresh map
  /*
  useEffect( () => {
    mapControlerLib.onChangeContextFilter(map, varsState, consFixed, settings)
  }, [varsState])
  */
  
  useEffect(() => {
    varsStateLib.updateLocationIcons(varsState, consCache, consFixed, settings)
    setVarState(Math.random())
  }, [varsState['context'], varsStateLib.getMainMenuControlActiveTab(varsState)]) 

  return (
    <>
      <div>
        {" "}
        {/* <FlexContainer> */}
        {/* add the main left menu */}
        
        <MainMenuControl settings={settings} position="leaflet-right" />

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
          <PointsLayer layerName="Locations" consFixed={consFixed} />

          {/* adds a polygon layer to the control and to the map as a component - boundaries */}          
          <PolygonLayer
            layerData={consFixed['boundaries']}
            layerName="Boundaries"
            reversePolygon
          />

          {/* adds GeoJson layer to the control and to the map as a component - river network */}
          {settings.riverNetwork.fullRaw ? (
            <GeoJsonLayerRiverNetwork layerSettings={settings.riverNetwork.fullRaw} />
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
