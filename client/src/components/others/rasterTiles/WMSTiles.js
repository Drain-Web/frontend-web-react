import { LayersControl, WMSTileLayer } from "react-leaflet";
import React from "react";

const WMSTileLayers = ({ wmsLayersData }) => {
  return (
    <>
      {Object.keys(wmsLayersData).map((wmsLayer) => {
        return (
          <LayersControl.Overlay
            checked={wmsLayersData[wmsLayer].checked}
            name={wmsLayersData[wmsLayer].name}
          >
            <WMSTileLayer
              layers={wmsLayersData[wmsLayer].layers}
              url={wmsLayersData[wmsLayer].url}
              format={wmsLayersData[wmsLayer].format}
              transparent={wmsLayersData[wmsLayer].transparent}
              attribution={wmsLayersData[wmsLayer].attribution}
            />
          </LayersControl.Overlay>
        );
      })}
    </>
  );
};

export default WMSTileLayers;
