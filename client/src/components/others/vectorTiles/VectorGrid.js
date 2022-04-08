import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
// import MapContext from "../contexts/MapContext";
import { useContext } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet.vectorgrid";

export default function VectorGrid({ layerSettings, props }) {
  const { layerContainer, map } = useLeafletContext();
  // const { zoom, setZoomLevel } = useContext(MapContext);
  // const map = useMap();
  const zoom = 9;

  function getColor(value) {
    if (value <= 0.91) {
      return { fillColor: "#462EB9" };
    } else if (value <= 0.92) {
      return { fillColor: "#3F63CF" };
    } else if (value <= 0.94) {
      return { fillColor: "#4C90C0" };
    } else if (value <= 0.99) {
      return { fillColor: "#63AC9A" };
    } else if (value <= 1.11) {
      return { fillColor: "#83BA70" };
    } else if (value <= 1.71) {
      return { fillColor: "#AABD52" };
    } else if (value <= 5.694) {
      return { fillColor: "#CEB541" };
    } else if (value <= 13.853) {
      return { fillColor: "#CEB541" };
    } else if (value <= 39.974) {
      return { fillColor: "#E49938" };
    } else if (value <= 220.912) {
      return { fillColor: "#E4632E" };
    } else if (value <= 99999) {
      return { fillColor: "#DB2122" };
    }
  }

  var mapboxUrl = "http://localhost:8082/river_network_rounded/{z}/{x}/{y}.pbf";

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

    if (horton + zoom >= 1) {
      console.log(horton);
      weight = layerSettings.lineWeight * 1.4 ** horton + (0 * zoom) / 12;
      color = getColor(parseFloat(properties.acum));
    } else {
      weight = 1;
      color = "r";
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
      network: (properties) => {
        styleFunction(properties.acum, 9);
      },
    },

    interactive: true,
    getFeatureId: function (f) {
      return f.properties["Tramo"];
    },
  };

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
