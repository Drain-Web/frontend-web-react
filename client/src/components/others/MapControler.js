import { LayersControl, ZoomControl, useMap } from "react-leaflet";
import React, { useEffect, useContext } from "react";
import { cloneDeep } from 'lodash';

// import components
import MainMenuControl from "./MainMenuControl";
import PolygonLayer from "../layers/PolygonLayer";
import PointsLayer from "../layers/PointsLayer";
import BaseLayers from "../layers/BaseLayers";
import PanelTabs from "./PanelTabs";
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
import { atVarStateContext, atVarStateDomMainMenuControl, atVarStateLocations,
         atVarStateDomMapLegend, atVarStateVectorGridMode } from "../atoms/atsVarState";

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

  const atmVarStateContext = cloneDeep(atomVarStateContext)
  const atmVarStateDomMainMenuControl = cloneDeep(atomVarStateDomMainMenuControl)
  const atmVarStateLocations = cloneDeep(atomVarStateLocations)
  const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)

  atsVarStateLib.getMainMenuControlActiveTab(atVarStateDomMainMenuControl)

  // TODO: move to state manager
  // when atom context or active tab is changed, update location icons
  useEffect(() => {
    console.log('updateLocationIcons from MapControler')
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

  // ** MAIN RENDER  ***************************************************************************

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
            layerName="Flow animation"
            settings={settings}
          />

        </LayersControl>
        <SearchField />
        <ZoomControl position="bottomright" />
        
        { (atomVarStateVectorGridMode === 'animated') ? 
          (<VectorGridLegend settings={settings} />) : 
          (<></>) }
        
      </div>
      {/* </FlexContainer> */}
    </>
  );
};

export default MapControler;
