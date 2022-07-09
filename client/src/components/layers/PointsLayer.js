import React, { useContext, useEffect, Fragment } from "react";
import { Icon } from "leaflet";
import {
  Marker,
  Polygon,
  Tooltip,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

// import contexts
import VarsState from "../contexts/VarsState";
import consFixedLib from "../contexts/consFixedLib";
import varsStateLib from "../contexts/varsStateLib";

// ids should be removed later, just used to keep the same current functionalities while creating basic components (a.k.a. machetazo)

/* ** SUB COMPONENTS ************************************************************************* */

const createMarkerPolygon = (locationInfo, activeLocation) => {
  if (!locationInfo.polygon) return <></>;

  return (
    <Polygon
      pathOptions={{
        color: "#0000AA",
        fillColor: "#7777FF",
        fill:
          activeLocation &&
          activeLocation.locationId === locationInfo.locationId,
        opacity:
          activeLocation &&
          activeLocation.locationId === locationInfo.locationId
            ? 0.5
            : 0,
      }}
      positions={JSON.parse(locationInfo.polygon).map((pol) => {
        return [pol[1], pol[0]];
      })}
      display="none"
      filter={false}
    />
  );
};

const createTooltip = (locationInfo) => {
  return (
    <Tooltip className="toolTipClass">
      <div>
        <h5>
          <span className="popuptitle">{locationInfo.shortName}</span>
        </h5>
        <p>
          <span className="popupsubtitle">Id: </span>
          <span className="popuptext">{locationInfo.locationId}</span>
        </p>
        <p>
          <span className="popupsubtitle">Longitude: </span>
          <span className="popuptext">{locationInfo.x}</span>
        </p>
        <p>
          <span className="popupsubtitle">Latitude: </span>
          <span className="popuptext">{locationInfo.y}</span>
        </p>
      </div>
    </Tooltip>
  );
};

const createMarker = (
  locationId,
  locationInfo,
  locationIcon,
  iconSize,
  varsState,
  setVarState
) => {
  return (
    <Fragment key={locationId}>
      <Marker
        position={[locationInfo.y, locationInfo.x]}
        icon={newIcon(locationIcon.icon, iconSize)}
        eventHandlers={{
          click: () => {
            const previousLocation = varsStateLib.getActiveLocation(varsState);
            if (
              !previousLocation ||
              previousLocation.locationId !== locationId
            ) {
              const curActiveTab =
                varsStateLib.getMainMenuControlActiveTab(varsState);
              varsStateLib.pushIntoActiveTabHistory(curActiveTab, varsState);
              varsStateLib.setMainMenuControlActiveTabAsActiveFeatureInfo(
                varsState
              );
              varsStateLib.setActiveLocation(locationInfo, varsState);
            } else {
              varsStateLib.setActiveLocation(null, varsState);
              const lastActiveTab =
                varsStateLib.pullFromActiveTabHistory(varsState);
              if (lastActiveTab) {
                varsStateLib.setMainMenuControlActiveTab(
                  lastActiveTab,
                  varsState
                );
              }
            }
            setVarState(Math.random());
          },
        }}
      >
        {createTooltip(locationInfo)}
      </Marker>
      {createMarkerPolygon(
        locationInfo,
        varsStateLib.getActiveLocation(varsState)
      )}
    </Fragment>
  );
};

// regular location icon
const newIcon = (newIconUrl, iconSize) => {
  return new Icon({
    iconUrl: newIconUrl,
    iconSize: [iconSize, iconSize],
    popupAnchor: [0, -15],
  });
};

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span key=${Math.random()}>${cluster.getChildCount()}</span>`,
    // customMarker is the class name in the styles.css file
    className: "customMarker",
    iconSize: L.point(48, 48, true),
  });
};

/* ** COMPONENT ****************************************************************************** */

const PointsLayer = ({ layerName, iconSize = 22, consFixed }) => {
  /* ** SET HOOKS **************************************************************************** */

  // load contexts
  const { varsState, setVarState } = useContext(VarsState);

  // refresh icons whenever something in the varsState['locations'] changes
  useEffect(() => {
    console.log("Do I need to use it?");
  }, [varsState.locations]);

  /* ** MAIN RENDER  *************************************************************************** */
  return (
    <>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          <MarkerClusterGroup
            showCoverageOnHover={false}
            iconCreateFunction={createClusterCustomIcon}
          >
            {Object.keys(varsState.locations).map((curLocationId, idx) => {
              const curLocationIcon = varsState.locations[curLocationId];
              const curLocationInfo = consFixedLib.getLocationData(
                curLocationId,
                consFixed
              );

              if (!curLocationIcon.display) {
                return null;
              }

              return createMarker(
                curLocationId,
                curLocationInfo,
                curLocationIcon,
                iconSize,
                varsState,
                setVarState
              );
            })}
          </MarkerClusterGroup>
        </LayerGroup>
      </LayersControl.Overlay>
    </>
  );
};

export default PointsLayer;
