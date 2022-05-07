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
    if (value <= 0.91) {
      return "#462EB9";
    } else if (value <= 10) {
      return "#3F63CF";
    } else if (value <= 30) {
      return "#4C90C0";
    } else if (value <= 60) {
      return "#63AC9A";
    } else if (value <= 120) {
      return "#83BA70";
    } else if (value <= 150) {
      return "#AABD52";
    } else if (value <= 220) {
      return "#CEB541";
    } else if (value <= 350) {
      return "#CEB541";
    } else if (value <= 480) {
      return "#E49938";
    } else if (value <= 520) {
      return "#E4632E";
    } else if (value <= 99999) {
      return "#DB2122";
    }
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
    var horton =
      properties[settings.stream_network.vector_attributes.stream_order];
    let color = null;
    let weight = 0;

    if (horton + varsState.domObjects.map.zoomLevel >= 12) {
      weight =
        1 * 1.3 ** horton + (1 * varsState.domObjects.map.zoomLevel) / 12;
      //horton;
      color = getColor(properties["acum"]); //settings.stream_network.default_color
    } else {
      weight = 0;
      color = "r";
    }

    return {
      weight: weight,
      color: color,
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
      const returnId =
        f.properties[settings.stream_network.vector_attributes.id];
      return returnId;
    },
  };

  const vectorGrid = L.vectorGrid.protobuf(url, options);
  const container = layerContainer || map;

  useEffect(() => {
    container.addLayer(vectorGrid);
    return () => {
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
