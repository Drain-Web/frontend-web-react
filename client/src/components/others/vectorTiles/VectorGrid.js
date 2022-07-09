import React from "react";
import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet.vectorgrid";
import { LayersControl, LayerGroup } from "react-leaflet";
import VarsState from "../../contexts/VarsState";
import { useContext } from "react";

// TODO: check if it is really needed
const ATTRIBUTION =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>';

const VectorGrid = ({ settings, url }) => {
  const { layerContainer, map } = useLeafletContext();
  const { varsState, setVarState } = useContext(VarsState);

  function getColor(value) {
    if (value <= 0.5) {
      return "#0000FF";
    } else if (value <= 0.8) {
      return "#00FF00";
    } else if (value <= 1.1) {
      return "#FFFF00";
    } else if (value <= 1.4) {
      return "#FFA500";
    } else if (value <= 1.7) {
      return "#FF0000";
    } else if (value <= 2) {
      return "#6a0dad";
    } else {
      return "#964B00";
    }
    // } else if (value <= 480) {
    //   return "#E49938";
    // } else if (value <= 520) {
    //   return "#E4632E";
    // } else if (value <= 99999) {
    //   return "#DB2122";
    // }
  }

  function styleFunction(properties) {
    // The lower the zoom, the lower the resolution (min: 0, max: 18).
    // 1 -> 12
    // 2 -> 11
    // 3 -> 10
    // 4 -> 9
    // 5 -> 8
    // 6 -> 7
    // 7 -> 6
    var horton = properties["ORD_STRA"];
    // console.log(horton + varsState.domObjects.map.zoomLevel);
    let color = null;
    let weight = 0;
    let opacity = 0;

    if (horton + varsState.domObjects.map.zoomLevel >= 10) {
      weight =
        0.5 * 1.3 ** horton + (1 * varsState.domObjects.map.zoomLevel) / 12;
      //horton;
      color = getColor(properties["Q"]); //settings.stream_network.default_color
      opacity = 1;
    } else {
      weight = 0;
      color = "r";
      opacity = 0;
    }

    return {
      weight: weight,
      color: color,
      opacity: opacity,
    };
  }

  // add all names to have the same styling function
  const vectorStyleFunctions = {};
  for (const layerName of settings.stream_network.layer_names) {
    vectorStyleFunctions[layerName] = styleFunction;
  }

  // vector layer options
  const options = {
    rendererFactory: L.canvas.tile,
    attribution: ATTRIBUTION,
    vectorTileLayerStyles: vectorStyleFunctions,
    interactive: true,
    getFeatureId: function (f) {
      const returnId = f.properties["OBJECTID"];
      return returnId;
    },
  };

  const vectorGrid = L.vectorGrid
    .protobuf(url, options)
    .on("click", function (e) {
      // console.log(e.layer);
      L.DomEvent.stop(e);
    });
  const container = layerContainer || map;

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  useEffect(() => {
    container.addLayer(vectorGrid);
    return async () => {
      await timeout(700);
      container.removeLayer(vectorGrid);
    };
  }, [url]);

  const layerName = "Stream network";

  return null;

  // in a React-friendly universe, this would be the solution:
  // return (
  //   <LayersControl.Overlay checked name={layerName}>
  //     <LayerGroup name={layerName}>
  //       <VectorGrid
  //         url={"http://localhost:8082/river_network/{z}/{x}/{y}.pbf"}
  //         vectorTileLayerStyles={{
  //           network: (properties) => {
  //             return styleFunction(properties);
  //           },
  //         }}
  //       />
  //       ;
  //     </LayerGroup>
  //   </LayersControl.Overlay>
  // );
};

export default VectorGrid;
