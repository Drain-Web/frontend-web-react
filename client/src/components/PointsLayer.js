import React, { useState } from "react";
import { Icon } from "leaflet";
import DropDownTimeSeries from "./DropDownTimeSeries";
import { Marker, Popup, LayersControl, LayerGroup } from "react-leaflet";

// ids should be removed later, just used to keep the same current functionalities while creating basic components (a.k.a. machetazo)

const PointsLayer = ({
  layerData,
  layerName,
  iconUrl,
  iconSize = 22,
  ids,
  timeSerieUrl,
  setTimeSerieUrl,
  setIsHidden,
}) => {
  const icon = new Icon({
    iconUrl: iconUrl,
    iconSize: [iconSize, iconSize],
    popupAnchor: [0, -15],
  });

  const [activePointFeature, setActivePointFeature] = useState(null);

  return (
    <React.Fragment>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          {layerData.locations.map((layerData) => (
            <Marker
              key={layerData.locationId}
              position={[layerData.y, layerData.x]}
              onClick={() => {
                setActivePointFeature(layerData);
              }}
              icon={icon}
            >
              <Popup
                position={[layerData.y, layerData.x]}
                onClose={() => {
                  setActivePointFeature(layerData);
                }}
              >
                <div>
                  <h5>
                    <span className="popuptitle">{layerData.shortName}</span>
                  </h5>
                  <p>
                    <span className="popuptitle">Id:</span>{" "}
                    {layerData.locationId}
                  </p>
                  <p>
                    <span className="popuptitle">Longitude:</span> {layerData.x}
                  </p>
                  <p>
                    <span className="popuptitle">Latitude:</span> {layerData.y}
                  </p>
                </div>
                <DropDownTimeSeries
                  ids={ids}
                  locationid={layerData.locationId}
                  timeSerieUrl={timeSerieUrl}
                  setTimeSerieUrl={setTimeSerieUrl}
                  setIsHidden={setIsHidden}
                />
                {/* <timeSeriesPlot data={data} /> */}
              </Popup>
            </Marker>
          ))}
        </LayerGroup>
      </LayersControl.Overlay>
    </React.Fragment>
  );
};

export default PointsLayer;
