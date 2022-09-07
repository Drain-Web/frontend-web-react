import React from "react";
import GeoJsonVtLayer from "./GeoJsonVtLayer";
import axios from "axios";
import useSWR from "swr";
import { LayersControl } from "react-leaflet";

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

function GeoJsonLayer({ layerSettings }) {
  const [geoJSON, setGeoJSON] = React.useState(null);

  const { data: geojsonData, error: geojsonError } = useSWR(
    layerSettings.url,
    fetcher
  );

  React.useEffect(() => {
    setGeoJSON(geojsonData);
  }, [geojsonData]);

  if (!geoJSON) {
    return null;
  }

  const options = {
    style: {
      color: layerSettings.lineColor,
      weight: layerSettings.lineWeight,
    },
  };

  let hortonOrders = geoJSON.features.map(
    (feature) => feature.properties.Horton
  );

  hortonOrders = hortonOrders.filter((v, i, a) => a.indexOf(v) === i);

  // console.log(hortonOrders);
  // console.log(geoJSON);

  let auxFeatures;
  let checkHorton;

  return hortonOrders.map((horton) => {
    auxFeatures = geoJSON.features.filter(
      (feature) => feature.properties.Horton === horton
    );

    // console.log({ ...geoJSON, features: auxFeatures });
    if (horton + varState.domObjects.map.zoomLevel >= 13) {
      checkHorton = true;
    } else {
      checkHorton = false;
    }

    // 1 -> 12
    // 2 -> 11
    // 3 -> 10
    // 4 -> 9
    // 5 -> 8
    // 6 -> 7
    // 7 -> 6

    return (
      <LayersControl.Overlay
        checked={checkHorton}
        name={layerSettings.layerName + " Horton order " + horton}
      >
        <GeoJsonVtLayer
          geoJSON={{ ...geoJSON, features: auxFeatures }}
          options={{
            maxZoom: 18,
            tolerance: 5,
            extent: 4096,
            buffer: 64,
            debug: 0,
            indexMaxZoom: 0,
            indexMaxPoints: 100000,
            style: {
              color: layerSettings.lineColor,
              weight:
                layerSettings.lineWeight * 1.4 ** horton +
                (0 * varState.domObjects.map.zoomLevel) / 12,
            },
          }}
        />
        ;
      </LayersControl.Overlay>
    );
  });
}

export default GeoJsonLayer;
