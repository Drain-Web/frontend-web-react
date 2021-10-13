import React from "react";
import GeoJsonVtLayer from "./GeoJsonVtLayer";
import axios from "axios";
import useSWR from "swr";

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

  console.log(hortonOrders);
  console.log(geoJSON);

  let auxFeatures;

  return hortonOrders.map((horton) => {
    auxFeatures = geoJSON.features.filter(
      (feature) => feature.properties.Horton === horton
    );

    console.log({ ...geoJSON, features: auxFeatures });

    return (
      <>
        <GeoJsonVtLayer
          geoJSON={{ ...geoJSON, features: auxFeatures }}
          options={{
            style: {
              color: layerSettings.lineColor,
              weight: layerSettings.lineWeight + 0.7 * horton,
            },
          }}
        />
        ;
      </>
    );
  });
}

export default GeoJsonLayer;
