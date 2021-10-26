import { createContext } from "react";

const MapContext = createContext({
  mapContextData: {
    position: null,
    zoom: null,
    pointFeatures: null,
    activePointFeature: null,
    setActivePointFeature: null,  
    isHidden: null,
    setIsHidden: null,
    timeSerieUrl: null,
    setTimeSerieUrl: null,
    filterContextData: null,      // TODO: move to 'varsState.context.filterId'
    setFilterContextData: null,
    activeTab: null,
    setActiveTab: null,
    zoomLevel: null,
    setZoomLevel: null,

  },
  setMapContextData: (mapData) => {},
});

export default MapContext;
