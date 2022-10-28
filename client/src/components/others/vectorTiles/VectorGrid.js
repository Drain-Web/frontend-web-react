import React, { useContext, useEffect, useState } from 'react'
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet.vectorgrid";
import { useRecoilValue } from 'recoil';

// contexts
import ConsFixed from "../../contexts/ConsFixed";

// atoms
import atsVarStateLib from '../../atoms/atsVarStateLib';
import { atVarStateVectorGridAnimation, atVarStateVectorGridMode } from '../../atoms/atsVarState';

// TODO: check if it is really needed
const ATTRIBUTION =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>';

// TODO: temp code
const getColorFromValueOld = (flowValue) => {
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

const getColorFromValue = (flowValue) => {
  let retColor = "#00AA00"
  if (flowValue < 2) {
    retColor = "#5555FF"
  } else if (flowValue < 2.8) {
    retColor = "#5522BB"
  } else if (flowValue < 3.6) {
    retColor = "#550099"
  } else if (flowValue < 4.4) {
    retColor = "#AA00AA"
  } else if (flowValue < 5.2) {
    retColor = "#DD0055"
  } else {
    retColor = "#990022"
  }
  return retColor
}
// , , , , , 

const getGradColorFromValue = (flowValue) => {
  const d2h = (d) => { return (+d).toString(16).padStart(2, '0') }

  const r = d2h(Math.round(255 * flowValue/10))
  const g = d2h(Math.round(255 * (1 - (flowValue/20))))
  const b = d2h(Math.round(255 * (1 - (flowValue/10))))
  return "#".concat(r, g, b)
}

const VectorGrid = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */
  
  const { layerContainer, map } = useLeafletContext();
  const { consFixed } = useContext(ConsFixed)
  const [ trueVGrid, setTrueVGrid ] = useState()

  const atomVarStateVectorGridAnimation = useRecoilValue(atVarStateVectorGridAnimation)
  const atomVarStateVectorGridMode = useRecoilValue(atVarStateVectorGridMode)

  // const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)

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
    const linkId = properties.OBJECTID                        // TODO: temp code
    const linkTs = consFixed.networkTimeseriesMatrix[linkId]  // TODO: temp code

    let color = null;
    let weight = 0;
    let opacity = 0;

    if (linkTs && (horton >= 1)) {
      weight = horton
      // color = settings.stream_network.default_color
      color = getColorFromValue(linkTs[networkTimeIdx])
    } else {
      weight = 0;
      color = "r";
      opacity = 0;
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
      console.log(f);
      const returnId = f.properties["OBJECTID"];
      return returnId;
    },
  };
  
  const vectorGrid = L.vectorGrid.protobuf(settings.stream_network.url, options);
  const container = layerContainer || map;

  // create layer at the beginning of the execution
  useEffect(() => {
    container.addLayer(vectorGrid);
    vectorGrid.setZIndex(200);
    setTrueVGrid(vectorGrid)
    return () => {
      container.removeLayer(vectorGrid);
    };
  }, [url]);

  const layerName = "Stream network";

  // TODO: temp code
  // set style updater
  useEffect(() => {
    // only applies if the vector grid was loaded
    if (!trueVGrid) { return }

    if (atomVarStateVectorGridMode === "static") {
      // if in static mode, print a single color
      const timeResolution = atsVarStateLib.getVectorGridAnimationTimeResolution(atomVarStateVectorGridAnimation)
      for (const curLinkId of Object.keys(consFixed.networkTimeseriesMatrix[timeResolution])) {
        trueVGrid.setFeatureStyle(curLinkId, { color: "#275095" })
      }

    } else if (atomVarStateVectorGridMode === "animated") {
      // if in animated mode, print the instant color of each link

      // for...of (imperative code) tends to be faster than forEach or map (declarative code)
      const networkTimeIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation)
      const timeResolution = atsVarStateLib.getVectorGridAnimationTimeResolution(atomVarStateVectorGridAnimation)
      let printed = false
      for (const curLinkId of Object.keys(consFixed.networkTimeseriesMatrix[timeResolution])) {
        const v = consFixed.networkTimeseriesMatrix[timeResolution][curLinkId][networkTimeIdx]
        // const c = getGradColorFromValue(v)  // before: getColorFromValue(v)
        const c = getColorFromValue(v)
        if (!printed) {
          printed = true
        }
        trueVGrid.setFeatureStyle(curLinkId, { color: c })
      }
      
    } else {
      // 
      console.log('Unexpected value for VarStateVectorGridMode:', atomVarStateVectorGridMode)

    }
  }, [atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation),
      atsVarStateLib.getVectorGridAnimationTimeResolution(atomVarStateVectorGridAnimation),
      atomVarStateVectorGridMode]);

  return null

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
