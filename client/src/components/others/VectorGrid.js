import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";

import L from "leaflet";

import "leaflet.vectorgrid";

export default function VectorGrid(props) {
  const { layerContainer, map } = useLeafletContext();

  var mapboxUrl = "http://localhost:8082/river_network/{z}/{x}/{y}.pbf";

  let options = {
    rendererFactory: L.canvas.tile,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>',
  };

  const vectorGrid = L.vectorGrid.protobuf(mapboxUrl, options);

  const container = layerContainer || map;

  useEffect(() => {
    container.addLayer(vectorGrid);
    return () => {
      container.removeLayer(vectorGrid);
    };
  }, []);

  return null;
}
