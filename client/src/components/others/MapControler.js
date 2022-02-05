import { LayersControl, ZoomControl, useMap } from "react-leaflet";
import React, { useEffect, useContext } from "react";

// import components
import MainMenuControl from "./MainMenuControl";
import PolygonLayer from "../layers/PolygonLayer";
import PointsLayer from "../layers/PointsLayer";
import BaseLayers from "../layers/BaseLayers";
import PanelTabs from "./PanelTabs";
import MapLegend from "./MapLegend";
import SearchField from "./GeoSearchBox";
// import SideNavBarMap from "./SideNavBar/SideNavBarMap";

// import contexts
import ConsCache from "../contexts/ConsCache";
import ConsFixed from "../contexts/ConsFixed";
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

// import assets
import { baseLayersData } from "../../assets/MapBaseLayers";

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

  return (
    <>
      <div>
        {/* <FlexContainer> */}
        {/* add the main left menu */}
        <MainMenuControl settings={settings} position="leaflet-right" />
        {/* timeseries panel */}
        <PanelTabs settings={settings} />
        <LayersControl>
          <BaseLayers baseLayerData={baseLayersData} />

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
      </div>
      {/* </FlexContainer> */}
    </>
  );
};

export default MapControler;
