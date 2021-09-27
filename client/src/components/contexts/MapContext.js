import { createContext } from "react";

const MapContext = createContext({
  mapContextData: {
    position: null,
    zoom: null,
    region: null,
    pointFeatures: null,
    activePointFeature: null,
    setActivePointFeature: null,
    isHidden: null,
    setIsHidden: null,
    timeSerieUrl: null,
    setTimeSerieUrl: null,
    filterContextData: null,
    setFilterContextData: null,
    boundariesData: null,
    regionData: null,
    filtersData: null,
    ids: null,
  },
  setMapContextData: (mapData) => {},
});

export default MapContext;
