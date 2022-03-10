import { LayersControl, ZoomControl, useMap } from "react-leaflet";
import React, { useEffect, useContext, useState } from "react";

// import components
import MainMenuControl from "./MainMenuControl";
import PolygonLayer from "../layers/PolygonLayer";
import PointsLayer from "../layers/PointsLayer";
import BaseLayers from "../layers/BaseLayers";
import PanelTabs from "./PanelTabs";
import MapLegend from "./MapLegend";
import SearchField from "./GeoSearchBox";
import WMSTileLayers from "./rasterTiles/WMSTiles";
import PngTilesLayers from "./rasterTiles/PngTiles";
// import SideNavBarMap from "./SideNavBar/SideNavBarMap";

// import contexts
import ConsCache from "../contexts/ConsCache";
import ConsFixed from "../contexts/ConsFixed";
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

// import assets
import { baseLayersData } from "../../assets/MapBaseLayers";
import { wmsLayersData } from "../../assets/WMSLayers.js";
import { pngTilesLayersData } from "../../assets/PngTileLayers";

const MapControler = ({ settings }) => {
  // this specific component is needed to allow useMap()
  const map = useMap();

  // load contexts
  const { consCache } = useContext(ConsCache);
  const { consFixed } = useContext(ConsFixed);
  const { varsState, setVarState } = useContext(VarsState);

  // when varsState.context is changed, update location icons
  useEffect(() => {
    varsStateLib.updateLocationIcons(varsState, consCache, consFixed, settings);
    setVarState(Math.random());
  }, [varsState.context, varsStateLib.getMainMenuControlActiveTab(varsState)]);

  // const [date, setDate] = useState(dates[1]);
  // const [countDate, setCountDate] = useState(1);

  // varsStateLib.setPngTilesDate(dates[time], varsState);
  // setVarState(Math.random());

  return (
    <>
      <div>
        {" "}
        {/* <FlexContainer> */}
        {/* add the main left menu */}
        <MainMenuControl settings={settings} position="leaflet-right" />
        {/* <SideNavBarMap /> */}
        {/* timeseries panel */}
        <PanelTabs position="leaflet-right" settings={settings} />
        <LayersControl>
          <BaseLayers baseLayerData={baseLayersData} />
          <WMSTileLayers wmsLayersData={wmsLayersData} />
          {<PngTilesLayers pngTileLayersData={pngTilesLayersData} />}

          {/* adds layer of points as a react component */}
          <PointsLayer layerName="Locations" consFixed={consFixed} />

          {/* adds a polygon layer to the control and to the map as a component - boundaries */}
          <PolygonLayer
            layerData={consFixed["boundaries"]}
            layerName="Boundaries"
            reversePolygon
          />

          {/* adds GeoJson layer to the control and to the map as a component - river network */}
          {/*
          settings.riverNetwork.fullRaw
            ?
              (<GeoJsonLayerRiverNetwork layerSettings={settings.riverNetwork.fullRaw} />)
            :
              (<></>)
            */}
        </LayersControl>
        <SearchField />
        <ZoomControl position="bottomright" />
        <MapLegend settings={settings} position="left" />
      </div>{" "}
      {/* </FlexContainer> */}
    </>
  );
};

export default MapControler;
