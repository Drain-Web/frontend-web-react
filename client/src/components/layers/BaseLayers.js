import { TileLayer, LayersControl } from "react-leaflet";
import React from "react";

const { BaseLayer } = LayersControl;

const BaseLayers = ({ baseLayerData }) => {
  return (
    <>
      {baseLayerData.map((baseLayer) => {
        if (baseLayer.maxNativeZoom) {
          return (
            <BaseLayer
              checked={baseLayer.checked}
              name={baseLayer.name}
              key={baseLayer.name}
            >
              <TileLayer
                attribution={baseLayer.attribution}
                url={baseLayer.url}
                maxNativeZoom={baseLayer.maxNativeZoom}
              />
            </BaseLayer>
          );
        } else {
          return (
            <BaseLayer
              checked={baseLayer.checked}
              name={baseLayer.name}
              key={baseLayer.name}
            >
              <TileLayer
                attribution={baseLayer.attribution}
                url={baseLayer.url}
              />
            </BaseLayer>
          );
        }
      })}
      <BaseLayer checked={true} name={"PPT"} key={"PPT"}>
        <TileLayer
          attribution={"Prueba"}
          url={"./prueba_reproj/{z}/{x}/{y}.png"}
          tms={true}
          opacity={0.5}
        />
      </BaseLayer>
    </>
  );
};

export default BaseLayers;
