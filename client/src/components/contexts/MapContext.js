import { createContext } from "react";

// should be removed

const MapContext = createContext({
  mapContextData: {
    position: null,
    zoom: null,
    pointFeatures: null,
    isHidden: null,
    setIsHidden: null,
    timeSerieUrl: null,
    setTimeSerieUrl: null,
    zoomLevel: null,
    setZoomLevel: null,

  },
  setMapContextData: (mapData) => {},
});

export default MapContext;
