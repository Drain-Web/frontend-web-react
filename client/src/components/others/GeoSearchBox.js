import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
// import "style/GeoSearchBox.css";

// setup of the geosearch box

const SearchField = () => {
  const providerSearchBox = new OpenStreetMapProvider();

  // @ts-ignore
  const searchControl = new GeoSearchControl({
    provider: providerSearchBox,
    autoComplete: true, // optional: true|false  - default true
    autoCompleteDelay: 250, // optional: number      - default 250
    showMarker: true,
    showPopup: false,
    popupFormat: ({ query, result }) => result.label,
    maxMarkers: 3,
    retainZoomLevel: false,
    animateZoom: true,
    autoClose: false,
    searchLabel: "Enter location to search",
    keepResult: true,
  });

  const map = useMap();

  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

export default SearchField;
