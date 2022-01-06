import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import MapContext from "../contexts/MapContext";
import { useContext } from "react";

import L from "leaflet";

import "leaflet.vectorgrid";

export default function VectorGrid({ layerSettings, props }) {
  const { layerContainer, map } = useLeafletContext();
  // const { zoom, setZoomLevel } = useContext(MapContext);

  function getColor(value) {
    if (value <= 0.91) {
      return "#462EB9";
    } else if (value <= 0.92) {
      return "#3F63CF";
    } else if (value <= 0.94) {
      return "#4C90C0";
    } else if (value <= 0.99) {
      return "#63AC9A";
    } else if (value <= 1.11) {
      return "#83BA70";
    } else if (value <= 1.71) {
      return "#AABD52";
    } else if (value <= 5.694) {
      return "#CEB541";
    } else if (value <= 13.853) {
      return "#CEB541";
    } else if (value <= 39.974) {
      return "#E49938";
    } else if (value <= 220.912) {
      return "#E4632E";
    } else if (value <= 99999) {
      return "#DB2122";
    }
  }

  var mapboxUrl = "http://localhost:8082/river_network/{z}/{x}/{y}.pbf";

  function styleFunction(properties, zoom) {
    // 1 -> 12
    // 2 -> 11
    // 3 -> 10
    // 4 -> 9
    // 5 -> 8
    // 6 -> 7
    // 7 -> 6

    var horton = properties.horton;
    let color = null;
    let weight = 0;

    if (horton + zoom >= 13) {
      weight = layerSettings.lineWeight * 1.4 ** horton + (0 * zoom) / 12;
      color = getColor(parseFloat(properties.acum));
    } else {
      weight = 0;
    }

    return {
      weight: weight,
      color: color,
    };
  }

  var options = {
    rendererFactory: L.canvas.tile,

    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>',

    vectorTileLayerStyles: {
      sliced: styleFunction,
    },

    interactive: true,
    getFeatureId: function (f) {
      return f.properties["Tramo"];
    },
  };

  console.log(options);

  const vectorGrid = L.vectorGrid.protobuf(mapboxUrl, options);

  const container = layerContainer || map;

  console.log(vectorGrid);

  useEffect(() => {
    container.addLayer(vectorGrid);
    return () => {
      container.removeLayer(vectorGrid);
    };
  }, []);

  return null;
}
