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
  useEffect(() => {
    const itvTime = 1000
    const itvFunc = () => {
      console.log('This will run every second. Not it is time', networkTimeIdx);
      const newTimeIdx = (networkTimeIdx == 23) ? 0 : networkTimeIdx + 1
      setNetworkTimeIdx(newTimeIdx)
    }

    const interval = setInterval(itvFunc, itvTime);
    return () => clearInterval(interval);
  }, [networkTimeIdx]);

  /* ** FUNCTIONS **************************************************************************** */

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

    const horton = properties[settings.stream_network.vector_attributes.stream_order];
    const linkId = properties.OBJECTID // TODO: temp code
    const linkTs = consFixed.networkTimeseriesMatrix[linkId] 
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

    // TODO: temp code
    /*
    if (linkId == 25958737) {
      console.log("Stream ID:", linkId, "at", networkTimeIdx, "is", consFixed.networkTimeseriesMatrix[linkId][networkTimeIdx])
    } else {
      console.log("Stream ID:", linkId)
    }
    */

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

  // add all names to have the same styling function
  const vectorStyleFunctions = {}
  for (const layerName of settings.stream_network.layer_names){
    vectorStyleFunctions[layerName] = styleFunction
  }

  // vector layer options
  // vectorTileLayerStyles: vectorStyleFunctions,
  const options = {
    rendererFactory: L.canvas.tile,
    attribution: ATTRIBUTION,
    interactive: true,
    getFeatureId: function (f) {
      const returnId = f.properties[settings.stream_network.vector_attributes.id];
      // console.log("Called for", returnId)
      return returnId;
    }
  };
  
  const vectorGrid = L.vectorGrid.protobuf(settings.stream_network.url, options);

  // TODO: temp code
  /*
  const vectorGrid = L.vectorGrid.protobuf(settings.stream_network.url, options).on('load', (e) => {
    setTimeout(
      () => {
        // Remove the old grid layer from the map
        this.graphicsLayer.remove();
        // Stop listening to the load event
        e.target.off('load', onLoad);
        // Save the new graphics layer into the member variable
        this.graphicsLayer = e.target;
      },
      2000
    );
  })
  */

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
    if (!trueVGrid) { return }
    for (const curLinkId of Object.keys(consFixed.networkTimeseriesMatrix)) {
      // if (curLinkId == 25958737) {
      if (true) {
        const v = consFixed.networkTimeseriesMatrix[curLinkId][networkTimeIdx]
        const c = getColorFromValue(v)
        trueVGrid.setFeatureStyle(curLinkId, { weight: 5, color: c, fill: true,
          fillColor: 'green',
          fillOpacity: 0.25,
          stroke: true }
        )
        // console.log("Access to", curLinkId, "value", v, "->", getColorFromValue(v))
        // console.log("DataLayerNames:", vectorGrid.getDataLayerNames())
      }
    }

    trueVGrid.options.vectorTileLayerStyles.order05plus = function (properties, zoom) {
      return {
          fill: true, fillColor: '#000000', fillOpacity: 1,
          color: 'rgb(0, 0, 0)', opacity: 1, weight: networkTimeIdx/5,
      };
    }
    // trueVGrid.redraw()
    // console.log("Should have funct-redraw at time", networkTimeIdx, ":", vectorGrid.getDataLayerNames())
    console.log("Should have no-redraw at time", networkTimeIdx, ":", vectorGrid)
    console.log(" True VGrid:", trueVGrid)
    // console.log(" Container:", container)
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
