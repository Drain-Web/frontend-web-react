import React, { useContext } from "react";
import { useMapEvents } from "react-leaflet";

import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

const GetZoomLevel = ({}) => {
  // initial zoom level provided for MapContainer
  const { varsState, setVarState } = useContext(VarsState);

  // as map changes its zoom, context variable is updates accordingly
  const mapEvents = useMapEvents({
    zoomend: () => {
      varsStateLib.setMapZoomLevel(mapEvents.getZoom(), varsState);
      setVarState(Math.random());
    },
  });

  return null;
};

export default GetZoomLevel;
