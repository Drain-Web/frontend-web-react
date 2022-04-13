import React from 'react'
import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet.vectorgrid";

// TODO: check if it is really needed
const ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>'

const VectorGrid = ({ settings }) => {
  const { layerContainer, map } = useLeafletContext();

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

  function styleFunction(properties) {
    // The lower the zoom, the lower the resolution (min: 0, max: 18). 
    // 1 -> 12
    // 2 -> 11
    // 3 -> 10
    // 4 -> 9
    // 5 -> 8
    // 6 -> 7
    // 7 -> 6

    var horton = properties[settings.stream_network.vector_attributes.stream_order];
    let color = null;
    let weight = 0;

    if (horton >= 1) {
      weight = horton
      color = settings.stream_network.default_color
    } else {
      weight = 1;
      color = "r";
    }

    return {
      weight: weight,
      color: color,
    };
  }

  // add all names to have the same styling function
  const vectorStyleFunctions = {}
  for (const layerName of settings.stream_network.layer_names){
    vectorStyleFunctions[layerName] = styleFunction
  }

  // vector layer options
  const options = {
    rendererFactory: L.canvas.tile,
    attribution: ATTRIBUTION,
    vectorTileLayerStyles: vectorStyleFunctions,
    interactive: true,
    getFeatureId: function (f) {
      const returnId = f.properties[settings.stream_network.vector_attributes.id];
      return returnId;
    }
  };
  
  const vectorGrid = L.vectorGrid.protobuf(settings.stream_network.url, options);
  const container = layerContainer || map;

  useEffect(() => {
    container.addLayer(vectorGrid);
    return () => {
      container.removeLayer(vectorGrid);
    };
  }, []);

  return null

  /*
  // in a React-friendly universe, this would be the solution:
  return (
    <LayersControl.Overlay checked name={layerName}>
      <LayerGroup name={layerName}>
        <VectorGrid
          url={TILES_URL}
          vectorTileLayerStyles={{
            order01plus: (properties) => { return styleFunction(properties, 18) },
            order02plus: (properties) => { return styleFunction(properties, 16) },
            order03plus: (properties) => { return styleFunction(properties, 14) },
            order04plus: (properties) => { return styleFunction(properties, 12) },
            order05plus: (properties) => { return styleFunction(properties, 10) }
          }}
        />;
      </LayerGroup>
    </LayersControl.Overlay>
  )
  */
}

export default VectorGrid
