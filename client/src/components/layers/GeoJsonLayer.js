import networkGeoJson from "../../assets/network.json";
import React from "react";
import GeoJsonVtLayer from "./GeoJsonVtLayer";

function GeoJsonLayer() {
  const [geoJSON, setGeoJSON] = React.useState(null);

  React.useEffect(() => {
    setGeoJSON(networkGeoJson);
  });

  if (!geoJSON) {
    return null;
  }

  var options = {
    maxZoom: 16,
    tolerance: 30,
    debug: 0,
    extent: 400,
    style: {
      color: "#F2FF00",
    },
  };

  return <GeoJsonVtLayer geoJSON={geoJSON} options={options} />;
}

export default GeoJsonLayer;
