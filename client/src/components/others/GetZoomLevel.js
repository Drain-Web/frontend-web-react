import React, { useState, useContext, Fragment } from "react";
import MapContext from "../contexts/MapContext";
// import react-compatible components
import { MapContainer, useMapEvents } from "react-leaflet";

const GetZoomLevel = ({}) => {
  // initial zoom level provided for MapContainer

  const { zoomLevel, setZoomLevel } = useContext(MapContext);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });

  console.log(zoomLevel);

  return null;
};

export default GetZoomLevel;
