import React from "react";
import GeoJsonVtLayer from "./GeoJsonVtLayer";
import axios from "axios";
import useSWR from "swr";

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

function GeoJsonLayer({ layerSettings }) {
  const [geoJSON, setGeoJSON] = React.useState(null);

  const { data: geojsonData, error: geojsonError } = useSWR(
    layerSettings.url,
    fetcher
  );

  React.useEffect(() => {
    setGeoJSON(geojsonData);
  }, [geojsonData]);

  if (!geoJSON) {
    return null;
  }
  
  const options = {
    style: {
      color: layerSettings.lineColor,
      weight: layerSettings.lineWeight
    }
  }

  return <GeoJsonVtLayer geoJSON={geoJSON} options={options} />;
}

export default GeoJsonLayer;
