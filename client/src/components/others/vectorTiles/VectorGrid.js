import React, { useContext, useEffect, useState } from 'react'
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet.vectorgrid";

import ConsFixed from "../../contexts/ConsFixed";

// TODO: check if it is really needed
const ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>'

// TODO: temp code
const getColorFromValue = (flowValue) => {
  let retColor = "#990000"
  if (flowValue == 1) {
    retColor = "#AAAAFF"
  } else if (flowValue == 2) {
    retColor = "#8888FF"
  } else if (flowValue == 3) {
    retColor = "#8866EE"
  } else if (flowValue == 4) {
    retColor = "#9955DD"
  } else if (flowValue == 5) {
    retColor = "#AA44BB"
  } else if (flowValue == 6) {
    retColor = "#AA3399"
  } else if (flowValue == 7) {
    retColor = "#AA2277"
  } else if (flowValue == 8) {
    retColor = "#AA1155"
  } else if (flowValue == 9) {
    retColor = "#AA0022"
  }
  return retColor
}

const VectorGrid = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */
  
  const { layerContainer, map } = useLeafletContext();
  const { consFixed } = useContext(ConsFixed)
  const [ networkTimeIdx, setNetworkTimeIdx ] = useState(0) // TODO: temp code
  const [ trueVGrid, setTrueVGrid ] = useState()

  // TODO: temp code
  // every time 'networkTimeIdx' is changed (useEffect), function itvFunc is scheduled to be
  //   called after 1000 milliseconds (1 second) and... HA! it will change 'networkTimeIdx'!
  useEffect(() => {
    const itvTime = 1000  // update time: 1 second
    const itvFunc = () => {
      console.log('This will run every second. Now it is time', networkTimeIdx, '.')
      setNetworkTimeIdx((networkTimeIdx == 23) ? 0 : networkTimeIdx + 1)
    }
    const interval = setInterval(itvFunc, itvTime);
    return () => clearInterval(interval);
  }, [networkTimeIdx]);

  /* ** FUNCTIONS **************************************************************************** */

  function styleFunction(properties) {
    // The lower the zoom, the lower the resolution (min: 0, max: 18). 
    // 1 -> 12
    // 2 -> 11
    // 3 -> 10
    // 4 -> 9
    // 5 -> 8
    // 6 -> 7
    // 7 -> 6

    const horton = properties[settings.stream_network.vector_attributes.stream_order];
    const linkId = properties.OBJECTID // TODO: temp code
    const linkTs = consFixed.networkTimeseriesMatrix[linkId]  // TODO: temp code
    let color = null;
    let weight = 0;

    if (linkTs && (horton >= 1)) {
      weight = horton
      // color = settings.stream_network.default_color
      color = getColorFromValue(linkTs[networkTimeIdx])
    } else {
      weight = 1;
      color = "r";
    }

    return {
      weight: weight,
      color: color,
      fill: true,
      fillColor: color,
      fillOpacity: 1,
      stroke: true
    };
  }

  /* ** MAIN RUN ***************************************************************************** */

  // add all layers to have the same styling function
  const vectorStyleFunctions = {}
  for (const layerName of settings.stream_network.layer_names){
    vectorStyleFunctions[layerName] = styleFunction
  }

  // vector layer options
  const options = {
    rendererFactory: L.canvas.tile,
    attribution: ATTRIBUTION,
    interactive: true,
    getFeatureId: function (f) {
      const returnId = f.properties[settings.stream_network.vector_attributes.id];
      return returnId;
    }
  };
  
  const vectorGrid = L.vectorGrid.protobuf(settings.stream_network.url, options);

  const container = layerContainer || map;

  // create layer at the beginning of the execution
  useEffect(() => {
    container.addLayer(vectorGrid);
    setTrueVGrid(vectorGrid)
    return () => {
      container.removeLayer(vectorGrid);
    };
  }, []);

  // TODO: temp code
  // set style updater
  useEffect(() => {
    // only applies if the vector grid was loaded
    if (!trueVGrid) { return }

    // for...of (imperative code) tends to be faster than forEach or map (declarative code)
    for (const curLinkId of Object.keys(consFixed.networkTimeseriesMatrix)) {
      const v = consFixed.networkTimeseriesMatrix[curLinkId][networkTimeIdx]
      const c = getColorFromValue(v)
      trueVGrid.setFeatureStyle(curLinkId, { color: c })
    }
  }, [networkTimeIdx]);

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
