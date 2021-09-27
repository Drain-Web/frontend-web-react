import React, { useState, useContext, Fragment } from "react";
import { Icon } from "leaflet";
import DropDownTimeSeries from "../others/DropDownTimeSeries";
import {
  Marker,
  Polygon,
  Popup,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import MapLocationsContext from "../contexts/MapLocationsContext";
import FilterContext from "../contexts/FilterContext";
import MapContext from "../contexts/MapContext";
import TabActiveFeatureInfoContext from "../contexts/TabActiveFeatureInfoContext";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

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
  const { activePointFeature, setActivePointFeature } = useContext(MapContext);
  // regular location icon
  const icon = new Icon({
    iconUrl: iconUrl,
    iconSize: [iconSize, iconSize],
    popupAnchor: [0, -15],
  });

  const newIcon = (newIconUrl) => {
    return new Icon({
      iconUrl: newIconUrl,
      iconSize: [iconSize, iconSize],
      popupAnchor: [0, -15],
    });
  };

  // mock location icon for a place not-to-be-shown
  const noIcon = new Icon({
    iconUrl: iconUrl,
    iconSize: [0, 0],
  });

  /* ** SET HOOKS ****************************************************************************** */

  // retireves context data
  const { mapLocationsContextData } = useContext(MapLocationsContext);
  const { filterContextData } = useContext(FilterContext);

  /* ** MAIN RENDER  *************************************************************************** */
  return (
    <>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          {layerData.locations.map((layerDataPoint) => {
            // maker will be displayed if its location Id is in the mapLocationsContextData

            // function that decides if a location will be shown
            const displayMarker = () => {
              if (
                mapLocationsContextData.byLocations &&
                layerDataPoint.locationId in
                  mapLocationsContextData.byLocations &&
                mapLocationsContextData.byLocations[layerDataPoint.locationId]
                  .show
              ) {
                return true;
              }
              return false;
            };

            // function that defines the iconUrl
            const getIconUrl = () => {
              const mapLoc =
                mapLocationsContextData.byLocations[layerDataPoint.locationId];
              if (!mapLoc.warning) {
                return iconUrl; // TODO:
              } else {
                return mapLoc.warning.iconName;
              }
            };

            if (displayMarker()) {
              console.log("getIconUrl:", getIconUrl());
            }

            return (
              <Fragment key={layerDataPoint.locationId}>
                <Marker
                  position={[layerDataPoint.y, layerDataPoint.x]}
                  eventHandlers={{
                    click: () => {
                      if (activePointFeature === null) {
                        setActivePointFeature(layerDataPoint);
                      } else {
                        setActivePointFeature((previousValue) => {
                          if (previousValue === layerDataPoint) {
                            return null;
                          } else {
                            return layerDataPoint;
                          }
                        });
                      }
                    },
                  }}
                  icon={displayMarker() ? newIcon(getIconUrl()) : noIcon}
                ></Marker>
                {
                  /* display location polygon if needed */
                  layerDataPoint.polygon ? (
                    <Polygon
                      pathOptions={{
                        color: "#0000AA",
                        fillColor: "#7777FF",
                        fill:
                          activePointFeature &&
                          activePointFeature.locationId ===
                            layerDataPoint.locationId,
                        opacity:
                          activePointFeature &&
                          activePointFeature.locationId ===
                            layerDataPoint.locationId
                            ? 0.5
                            : 0,
                      }}
                      positions={JSON.parse(layerDataPoint.polygon).map(
                        (pol) => [pol[1], pol[0]]
                      )}
                      display="none"
                      filter={false}
                    />
                  ) : (
                    <></>
                  )
                }
              </Fragment>
            );
          })}
        </LayerGroup>
      </LayersControl.Overlay>
    </>
  );
};

export default PointsLayer;
