import L from "leaflet";
import {
  createTileLayerComponent,
  updateGridLayer,
  withPane,
} from "@react-leaflet/core";
import geojsonvt from "geojson-vt";
window.geojsonvt = geojsonvt;
import {} from "leaflet-geojson-vt";

const GeoJsonVtLayer = createTileLayerComponent(function createGridLayer(
  { geoJSON, ...options },
  context
) {
  return {
    instance: L.gridLayer.geoJson(geoJSON, options.options),
    context,
  };
},
updateGridLayer);

export default GeoJsonVtLayer;
