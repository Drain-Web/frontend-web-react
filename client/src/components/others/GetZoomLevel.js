import React, { useContext, Fragment } from "react";
import { useMapEvents } from "react-leaflet";
import { useRecoilState } from "recoil";

import { cloneDeep } from "lodash";

// import VarsState from "../contexts/VarsState";
// import varsStateLib from "../contexts/varsStateLib";

import atsVarStateLib from "../atoms/atsVarStateLib";
import { atVarStateDomMap } from "../atoms/atsVarState";

const GetZoomLevel = ({}) => {
  // initial zoom level provided for MapContainer
  // const { varsState, setVarState } = useContext(VarsState)

  const [atomVarStateDomMap, setAtVarStateDomMap] = useRecoilState(atVarStateDomMap)

  // as map changes its zoom, context variable is updates accordingly
  const mapEvents = useMapEvents({
    zoomend: () => {
      // varsStateLib.setMapZoomLevel(mapEvents.getZoom(), varsState)
      // setVarState(Math.random())

      const atmVarStateDomMap = cloneDeep(atomVarStateDomMap)
      atsVarStateLib.setMapZoomLevel(mapEvents.getZoom(), atmVarStateDomMap)
      setAtVarStateDomMap(atmVarStateDomMap)
    },
  });

  return null;
};

export default GetZoomLevel;
