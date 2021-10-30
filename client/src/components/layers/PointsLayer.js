import React, { useContext, useEffect, Fragment } from "react";
import { Icon } from "leaflet";
import {
  Marker,
  Polygon,
  Tooltip,
  LayersControl,
  LayerGroup,
} from "react-leaflet";

// import contexts
import MapLocationsContext from "../contexts/MapLocationsContext";
import MapContext from "../contexts/MapContext";
import VarsState from "../contexts/VarsState";
import consFixedLib from "../contexts/consFixedLib";

// ids should be removed later, just used to keep the same current functionalities while creating basic components (a.k.a. machetazo)

const PointsLayer = ({
  layerName,
  iconUrl,
  iconSize = 22,
  consFixed
}) => {

  // load contexts
  const { varsState } = useContext(VarsState)
  const { activePointFeature, setActivePointFeature } = useContext(MapContext);
  const { activeTab, setActiveTab } = useContext(MapContext);
  const layerData = varsState['locations']  // TODO: remove it. kept for fast 'bug fix'

  // refresh icons whenever something in the varsState['locations'] changes
  useEffect( () => {
    console.log('Do I need to use it?')
  }, [varsState['locations']])

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


  /* ** MAIN RENDER  *************************************************************************** */
  return (
    <>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          {
            Object.keys(varsState['locations']).map(function(curLocationId, idx) {
              const curLocationIcon = varsState['locations'][curLocationId]
              const curLocationInfo = consFixedLib.getLocationData(curLocationId, consFixed)
              
              if (!curLocationIcon.display) { return (null) }
              
              return (
                <Fragment key={curLocationId}>
                  <Marker
                    position={[curLocationInfo.y, curLocationInfo.x]}
                    icon={newIcon(curLocationIcon.icon)}
                  >
                  {/* TODO: add everything that was there */}
                  </Marker>
                </Fragment>
              )
            })
          }

          { /*layerData.locations.map((layerDataPoint) => {
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
                return iconUrl; // TODO: make if accept undefined location
              } else {
                return mapLoc.warning.iconName;
              }
            };

            return (
              <Fragment key={layerDataPoint.locationId}>
                <Marker
                  position={[layerDataPoint.y, layerDataPoint.x]}
                  eventHandlers={{
                    click: () => {
                      if (activePointFeature === null) {
                        setActiveTab("tabActiveFeatureInfo");
                        setActivePointFeature(layerDataPoint);
                      } else {
                        setActiveTab(activeTab);
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
                >
                  <Tooltip className="toolTipClass">
                    <div>
                      <h5>
                        <span className="popuptitle">
                          {layerDataPoint.shortName}
                        </span>
                      </h5>
                      <p>
                        <span className="popupsubtitle">Id: </span>
                        <span className="popuptext">
                          {layerDataPoint.locationId}
                        </span>
                      </p>
                      <p>
                        <span className="popupsubtitle">Longitude: </span>
                        <span className="popuptext">{layerDataPoint.x}</span>
                      </p>
                      <p>
                        <span className="popupsubtitle">Latitude: </span>
                        <span className="popuptext">{layerDataPoint.y}</span>
                      </p>
                    </div>
                  </Tooltip>
                </Marker>
                {
                  // display location polygon if needed
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
                        (pol) => {
                          return [pol[1], pol[0]];
                        }
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
          }) */}
        </LayerGroup>
      </LayersControl.Overlay>
    </>
  );
};

export default PointsLayer;
