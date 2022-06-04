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
// import GeoJsonLayer from "./vectorTiles/GeoJsonLayerRiverNetwork";
import VectorGrid from "./vectorTiles/VectorGrid";
// import SideNavBarMap from "./SideNavBar/SideNavBarMap";

// import contexts
import ConsCache from "../contexts/ConsCache";
import ConsFixed from "../contexts/ConsFixed";
import consFixedLib from "../contexts/consFixedLib";
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

  // when varsState.context is changed, update map view window
  useEffect(() => {
    let mapExtent = null;

    if (varsStateLib.inMainMenuControlActiveTabOverview(varsState)) {
      mapExtent = consFixedLib.getRegionData(consFixed).map.defaultExtent;
    } else if (varsStateLib.inMainMenuControlActiveTabFilters(varsState)) {
      const filterId = varsStateLib.getContextFilterId(varsState);
      const filterData = consFixedLib.getFilterData(filterId, consFixed);

      // basic check
      if (!filterData) {
        return;
      }

      //
      mapExtent = filterData.map.defaultExtent;
    } else {
      return null;
    }

    const mapBounds = [
      [mapExtent.bottom, mapExtent.left],
      [mapExtent.top, mapExtent.right],
    ];

    map.fitBounds(mapBounds);
  }, [
    varsState.context,
    varsStateLib.getContextFilterId(varsState),
    varsStateLib.getMainMenuControlActiveTab(varsState),
  ]);

  const baseUrl =
    "http://192.168.100.123:8082/river_network_rounded_date/{z}/{x}/{y}.pbf";

  const [url, setUrl] = useState(
    "http://192.168.100.123:443/prueba/mvt/{z}/{x}/{y}.pbf"
  );

  const urls = [
    "20210112000000",
    "20210112010000",
    "20210112030000",
    "20210112020000",
    "20210111150000",
    "20210111160000",
    "20210111170000",
    "20210111190000",
    "20210111180000",
    "20210111240000",
    "20210111200000",
    "20210111210000",
    "20210111230000",
    "20210111220000",
  ];
  var index = 0;

  useEffect(() => {
    const interval = setInterval(
      () => setUrl(baseUrl.replace("date", urls[index++ % urls.length])),
      2000
    );

    return () => {
      clearInterval(interval);
    };
  }, [url]);

  // console.log(url);

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
          {/* adds base layer */}

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
          {/* {settings.riverNetwork.fullRaw ? (
            <GeoJsonLayer layerSettings={settings.riverNetwork.fullRaw} />
          ) : (
            <></>
          )} */}
          <VectorGrid
            settings={settings}
            url={
              "http://192.168.100.123:8082/resultados_simulacion/20220330220000/{z}/{x}/{y}.pbf"
            }
          />
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
