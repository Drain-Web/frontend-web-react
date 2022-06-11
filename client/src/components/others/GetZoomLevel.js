import React from "react";
import { useMapEvents } from "react-leaflet";
import { useRecoilState } from "recoil";

import { cloneDeep } from "lodash";

import atsVarStateLib from "../atoms/atsVarStateLib";
import { atVarStateDomMap } from "../atoms/atsVarState";

const GetZoomLevel = ({}) => {
  // initial zoom level provided for MapContainer
  const [atomVarStateDomMap, setAtVarStateDomMap] = useRecoilState(atVarStateDomMap)

  // as map changes its zoom, context variable is updates accordingly
  const mapEvents = useMapEvents({
    zoomend: () => {
      const atmVarStateDomMap = cloneDeep(atomVarStateDomMap)
      atsVarStateLib.setMapZoomLevel(mapEvents.getZoom(), atmVarStateDomMap)
      setAtVarStateDomMap(atmVarStateDomMap)
    },
  });

  return null;
};

export default GetZoomLevel;
