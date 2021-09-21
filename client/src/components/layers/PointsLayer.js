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

  const [activePointFeature, setActivePointFeature] = useState(null);

  /* ** MAIN RENDER  *************************************************************************** */
  return (
    <>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          {layerData.locations.map((layerData) => {
            // maker will be displayed if its location Id is in the mapLocationsContextData

            // function that decides if a location will be shown
            const displayMarker = () => {
              if (
                mapLocationsContextData.byLocations &&
                layerData.locationId in mapLocationsContextData.byLocations &&
                mapLocationsContextData.byLocations[layerData.locationId].show
              ) {
                return true;
              }
              return false;
            };

            // function that defines the iconUrl
            const getIconUrl = () => {
              const mapLoc =
                mapLocationsContextData.byLocations[layerData.locationId];
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
              <Fragment key={layerData.locationId}>
                <Marker
                  position={[layerData.y, layerData.x]}
                  onClose={() => {
                    setActivePointFeature(null);
                  }}
                  icon={displayMarker() ? newIcon(getIconUrl()) : noIcon}
                >
                  <Popup>
                    <div>
                      <h5>
                        <span className="popuptitle">
                          {layerData.shortName}
                        </span>
                      </h5>
                      <p>
                        <span className="popuptitle">Id:</span>{" "}
                        {layerData.locationId}
                      </p>
                      <p>
                        <span className="popuptitle">Longitude:</span>{" "}
                        {layerData.x}
                      </p>
                      <p>
                        <span className="popuptitle">Latitude:</span>{" "}
                        {layerData.y}
                      </p>
                      {!filterContextData.inOverview ? (
                        <p>
                          <span
                            onClick={() => {
                              setTimeSerieUrl(
                                `https://hydro-web.herokuapp.com/v1/timeseries/?filter=${filterContextData.filterId}&location=${layerData.locationId}`
                              );
                              setIsHidden(false);
                            }}
                          >
                            <Button variant="primary" disabled>
                              <Spinner
                                as="span"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              Plot event
                            </Button>
                          </span>
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                    {filterContextData.inOverview ? (
                      <DropDownTimeSeries
                        ids={ids}
                        locationid={layerData.locationId}
                        timeSerieUrl={timeSerieUrl}
                        setTimeSerieUrl={setTimeSerieUrl}
                        setIsHidden={setIsHidden}
                      />
                    ) : (
                      <></>
                    )}
                  </Popup>
                </Marker>
                {
                  /* display location polygon if needed */
                  layerData.polygon ? (
                    <Polygon
                      pathOptions={{
                        color: "#0000AA",
                        fillColor: "#7777FF",
                        fill:
                          activePointFeature &&
                          activePointFeature.locationId ===
                            layerData.locationId,
                        opacity:
                          activePointFeature &&
                          activePointFeature.locationId === layerData.locationId
                            ? 0.5
                            : 0,
                      }}
                      positions={JSON.parse(layerData.polygon).map((pol) => [
                        pol[1],
                        pol[0],
                      ])}
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
