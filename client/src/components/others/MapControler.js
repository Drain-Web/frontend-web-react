import { LayersControl, ZoomControl, useMap } from "react-leaflet";
// import React, { useEffect, useContext, useState } from "react";  // for Seba's code
import React, { useEffect, useContext } from "react";
import { cloneDeep, random } from 'lodash';

// import components
import MainMenuControl from "./MainMenuControl";
import PolygonLayer from "../layers/PolygonLayer";
import PointsLayer from "../layers/PointsLayer";
import BaseLayers from "../layers/BaseLayers";
import PanelTabs from "./PanelTabs";
import RasterGrid from "../layers/RasterGrid";
import MapLegend from "./MapLegend";
import SearchField from "./GeoSearchBox";
import VectorGrid from "./vectorTiles/VectorGrid";
import VectorGridPlayer from "./vectorTiles/VectorGridPlayer";
import VectorGridLegend from "./vectorTiles/VectorGridLegend";

// import recoil to replace contexts
import { useRecoilState, useRecoilValue } from "recoil";

// import contexts
import ConsCache from "../contexts/ConsCache";
import ConsFixed from "../contexts/ConsFixed";
import consFixedLib from "../contexts/consFixedLib";

import atsVarStateLib from "../atoms/atsVarStateLib";
import {
  atVarStateContext, atVarStateDomMainMenuControl, atVarStateLocations,
  atVarStateDomMap, atVarStateDomMapLegend, atVarStateVectorGridMode,
  atVarStateVectorGridAnimation, atVarStateRasterGridAnimation
} from "../atoms/atsVarState";

// import assets
import { baseLayersData } from "../../assets/MapBaseLayers";

const MapControler = ({ settings }) => {
  // ** SET HOOKS ******************************************************************************
  // this specific component is needed to allow useMap()
  const map = useMap();

  // load contexts
  const { consCache } = useContext(ConsCache);
  const { consFixed } = useContext(ConsFixed);

  const atomVarStateContext = useRecoilValue(atVarStateContext)
  const atomVarStateDomMainMenuControl = useRecoilValue(atVarStateDomMainMenuControl)
  const [atomVarStateLocations, setAtVarStateActiveLocation] =
    useRecoilState(atVarStateLocations)
  const [atomVarStateDomMapLegend, setAtVarStateDomMapLegend] =
    useRecoilState(atVarStateDomMapLegend)
  const atomVarStateVectorGridMode = useRecoilValue(atVarStateVectorGridMode)
  // const atomVarStateDomMap = useRecoilValue(atVarStateDomMap)  // for Seba's code

  const atmVarStateContext = cloneDeep(atomVarStateContext)
  const atmVarStateDomMainMenuControl = cloneDeep(atomVarStateDomMainMenuControl)
  const atmVarStateLocations = cloneDeep(atomVarStateLocations)
  const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)

  // TODO: Sebas' code
  // const [index, setIndex] = useState(0);
  // const [step, setStep] = useState(1);
  // const [url, setUrl] = useState(settings.stream_network.url)

  // TODO: get the following variable out of here:
  // const baseUrl =
  //   "https://storage.googleapis.com/tile-server-storage/resultados_simulacion/20220328000000/{z}/{x}/{y}.pbf";

  // TODO: move to state manager
  // when atom context or active tab is changed, update location icons
  useEffect(() => {
    atsVarStateLib.updateLocationIcons(atmVarStateDomMainMenuControl, atmVarStateLocations,
      atmVarStateContext, atmVarStateDomMapLegend,
      consCache, consFixed, settings)
    setAtVarStateActiveLocation(atmVarStateLocations)
    setAtVarStateDomMapLegend(atmVarStateDomMapLegend)

  }, [atomVarStateContext,
    atsVarStateLib.getMainMenuControlActiveTab(atomVarStateDomMainMenuControl)
  ]);

  // TODO: move to state manager
  // when atom context, active tab or context is changed, update map view window
  useEffect(() => {

    let mapExtent = null;

    if (atsVarStateLib.inMainMenuControlActiveTabOverview(atmVarStateDomMainMenuControl)) {
      mapExtent = consFixedLib.getRegionData(consFixed).map.defaultExtent;
    } else if (atsVarStateLib.inMainMenuControlActiveTabFilters(atmVarStateDomMainMenuControl)) {

      const filterId = atsVarStateLib.getContextFilterId(atmVarStateContext);
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
    atomVarStateContext,
    atsVarStateLib.getContextFilterId(atomVarStateContext),
    atsVarStateLib.getMainMenuControlActiveTab(atomVarStateDomMainMenuControl)
  ]);

  // Sebas' code
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(Math.max(1, 10 - atsVarStateLib.getMapZoomLevel(atomVarStateDomMap)));
      setIndex((index + step) % urls.length);
      setUrl(baseUrl.replace("date", urls[index]));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [url, index]);
  */

  const atomVarStateVectorGridAnimation = useRecoilValue(atVarStateVectorGridAnimation)
  const atomVarStateRasterGridAnimation = useRecoilValue(atVarStateRasterGridAnimation)

  // ** CONSTANTS *********************************************************************************

  // TODO: replace the constants 'AVAILABLE_DATETIMES', 'BASE_URL_1', 'BASE_URL_2' by dynamic values
  const AVAILABLE_DATETIMES = ["evt041_20130708_2030_ldtime-04",
                               "evt041_20130708_2115_ldtime-08",
                               "evt041_20130708_2200_ldtime-12",
                               "evt041_20130708_2315_ldtime-16"];
  const BASE_URL_1 = "https://wb-trca-api.herokuapp.com/v1dw/multitiles_server/"
  const BASE_URL_2 = "/{z}/{x}/{y}"

  /* ** LOGIC ********************************************************************************** */

  const imageTimeIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(
    atomVarStateVectorGridAnimation) % AVAILABLE_DATETIMES.length
  const curTilesUrl = BASE_URL_1 + AVAILABLE_DATETIMES[imageTimeIdx] + BASE_URL_2

  console.log("--->", curTilesUrl)

  const zIdxRaster1st = atomVarStateRasterGridAnimation.currentFrame1stZindex
  const zIdxRaster2nd = atomVarStateRasterGridAnimation.currentFrame2ndZindex
  const keyRaster1st = `tileLayer1st${zIdxRaster1st}`
  const keyRaster2nd = `tileLayer1st${zIdxRaster2nd}`
  console.log('1.', zIdxRaster1st, keyRaster1st)
  console.log('2.', zIdxRaster2nd, keyRaster2nd)

  // ** MAIN RENDER ****************************************************************************

  return (
    <>
      <div>
        {" "}
        {/* <FlexContainer> */}
        {/* add the main left menu */}
        <MainMenuControl settings={settings} position="leaflet-right" />

        <MapLegend settings={settings} position="left" />

        {/*
        // TODO: bring back */}
        <VectorGridPlayer settings={settings} />

        {/* <SideNavBarMap /> */}
        {/* timeseries panel */}
        <PanelTabs position="leaflet-right" settings={settings} />
        <LayersControl>

          {/* adds base layer */}
          <BaseLayers baseLayerData={baseLayersData} />

          {/* adds layer of points as a react component */}
          <PointsLayer layerName="Locations" consFixed={consFixed} settings={settings} />

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
            layerName="Flow animation"
            settings={settings}
          />

          {/* Use Seba's others/vectorTiles/VectorGrid.js instead */}
          {/*<ContourPolygon />*/}

          {/* animated raster for the flood inundation map */}
          {/* tilesUrl="https://wb-trca-api.herokuapp.com/v1dw/multitiles_server/evt041_20130708_2030_ldtime-04/{z}/{x}/{y}" */}
          <RasterGrid
            layerName="Raster Grid"
            tilesUrl={curTilesUrl}
            key1st={keyRaster1st} zIdx1st={zIdxRaster1st}
            key2nd={keyRaster2nd} zIdx2nd={zIdxRaster2nd}
          />

        </LayersControl>
        <SearchField />
        <ZoomControl position="bottomright" />

        {(atomVarStateVectorGridMode === 'animated') ?
          (<VectorGridLegend settings={settings} />) :
          (<></>)}

      </div>
      {/* </FlexContainer> */}
    </>
  );
};

export default MapControler;
