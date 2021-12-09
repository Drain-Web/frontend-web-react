import { LayersControl, TileLayer } from "react-leaflet";
import React from "react";

const MapTileLayers = ({ mapTilesLayersData }) => {
  return (
    <>
      {Object.keys(mapTilesLayersData).map((tileLayer) => {
        return (
          <LayersControl.Overlay
            checked={mapTilesLayersData[tileLayer].checked}
            name={mapTilesLayersData[tileLayer].name}
          >
            <TileLayer
              attribution={mapTilesLayersData[tileLayer].attribution}
              url={mapTilesLayersData[tileLayer].url}
              tms={mapTilesLayersData[tileLayer].tms}
              opacity={mapTilesLayersData[tileLayer].opacity}
            />
          </LayersControl.Overlay>
        );
      })}
    </>
  );
};

export default MapTileLayers;
