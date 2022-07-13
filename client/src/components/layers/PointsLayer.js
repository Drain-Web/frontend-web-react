import React, { Fragment } from "react";
import { Icon } from "leaflet";
import { Marker, Polygon, Tooltip, LayersControl, LayerGroup } from "react-leaflet";
import { cloneDeep } from 'lodash';
import MarkerClusterGroup from "react-leaflet-markercluster";

import { useRecoilState, useRecoilValue } from "recoil";

// context and atoms
import { atVarStateLocations, atVarStateActiveLocation, atVarStateDomMainMenuControl } from
  "../atoms/atsVarState";

// import contexts
import consFixedLib from "../contexts/consFixedLib";
import atsVarStateLib from "../atoms/atsVarStateLib";

// ids should be removed later, just used to keep the same current functionalities while creating basic components (a.k.a. machetazo)

/* ** SUB COMPONENTS ************************************************************************* */

const createMarkerPolygon = (locationInfo, activeLocation) => {
  if (!locationInfo.polygon) return (<></>)

  return (
    <Polygon
      pathOptions={{
        color: "#0000AA",
        fillColor: "#7777FF",
        fill:
          activeLocation &&
          (activeLocation.locationId === locationInfo.locationId),
        opacity:
          activeLocation &&
          (activeLocation.locationId === locationInfo.locationId)
            ? 0.5
            : 0
      }}
      positions={JSON.parse(locationInfo.polygon).map(
        (pol) => {
          return [pol[1], pol[0]];
        }
      )}
      display="none"
      filter={false}
    />
  )
}

const createTooltip = (locationInfo) => {
  return (
    <Tooltip className="toolTipClass">
      <div>
        <h5>
          <span className="popuptitle">
            {locationInfo.shortName}
          </span>
        </h5>
        <p>
          <span className="popupsubtitle">Id: </span>
          <span className="popuptext">
            {locationInfo.locationId}
          </span>
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
  )
}

const createMarker = (locationId, locationInfo, locationIcon, iconSize,
    atomVarStateActiveLocation, setAtVarStateActiveLocation,
    atmVarStateDomMainMenuControl, setAtVarStateDomMainMenuControl) => {
  return (
    <Fragment key={locationId}>
      <Marker
        position={[locationInfo.y, locationInfo.x]}
        icon={newIcon(locationIcon.icon, iconSize)}
        eventHandlers={{
          click: () => {
            const previousLocation = atVarStateActiveLocation
            if ((!previousLocation) || (previousLocation.locationId !== locationId)) {
              const curActiveTab = atsVarStateLib.getMainMenuControlActiveTab(atmVarStateDomMainMenuControl)
              atsVarStateLib.pushIntoActiveTabHistory(curActiveTab, atmVarStateDomMainMenuControl)
              atsVarStateLib.setMainMenuControlActiveTabAsActiveFeatureInfo(atmVarStateDomMainMenuControl)
              setAtVarStateActiveLocation(locationInfo)
              setAtVarStateDomMainMenuControl(atmVarStateDomMainMenuControl)
            } else {
              setAtVarStateActiveLocation(null)
              const lastActiveTab = atsVarStateLib.pullFromActiveTabHistory(atmVarStateDomMainMenuControl)
              if (lastActiveTab) {
                atsVarStateLib.setMainMenuControlActiveTab(lastActiveTab, atmVarStateDomMainMenuControl)
                setAtVarStateDomMainMenuControl(atmVarStateDomMainMenuControl)
              }
            }
          }
        }}
      >
        {createTooltip(locationInfo)}
      </Marker>
      {createMarkerPolygon(locationInfo, atomVarStateActiveLocation)}
    </Fragment>
  )
}

// TODO: make it not hard-coded
// 'customMarker' is the class name in the styles.css file
const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span key=${Math.random()}>${cluster.getChildCount()}</span>`,
    className: "customMarker",
    iconSize: L.point(48, 48, true),
  });
};

// regular location icon
const newIcon = (newIconUrl, iconSize) => {
  return new Icon({
    iconUrl: newIconUrl,
    iconSize: [iconSize, iconSize],
    popupAnchor: [0, -15]
  })
}

// ** COMPONENT ********************************************************************************

const PointsLayer = ({ layerName, iconSize = 22, consFixed, settings }) => {
  // ** SET HOOKS ******************************************************************************

  // load contexts
  const atomVarStateLocations = useRecoilValue(atVarStateLocations)
  const [atomVarStateActiveLocation, setAtVarStateActiveLocation] =
    useRecoilState(atVarStateActiveLocation)
  const [atomVarStateDomMainMenuControl, setAtVarStateDomMainMenuControl] =
    useRecoilState(atVarStateDomMainMenuControl)

  const atmVarStateActiveLocation = cloneDeep(atomVarStateActiveLocation)
  const atmVarStateDomMainMenuControl = cloneDeep(atomVarStateDomMainMenuControl)

  // creates a list of markers
  let allMarkers = Object.keys(atomVarStateLocations).map((curLocationId, idx) => {
    const curLocationIcon = atomVarStateLocations[curLocationId]
    const curLocationInfo = consFixedLib.getLocationData(curLocationId, consFixed)

    if (!curLocationIcon.display) { return (null) }

    return (createMarker(curLocationId, curLocationInfo, curLocationIcon, iconSize,
      atmVarStateActiveLocation, setAtVarStateActiveLocation,
      atmVarStateDomMainMenuControl, setAtVarStateDomMainMenuControl))
  })

  // created component with powers to cluster (or not) markers
  if (settings.mapMarkersClustering) {
    allMarkers = (
      <MarkerClusterGroup
        showCoverageOnHover={false}
        iconCreateFunction={createClusterCustomIcon}>
          {allMarkers}
      </MarkerClusterGroup>
    )
  }

  // ** MAIN RENDER  ***************************************************************************
  return (
    <LayersControl.Overlay checked name={layerName}>
      <LayerGroup name={layerName}>
        { allMarkers }
      </LayerGroup>
    </LayersControl.Overlay>
  )
}

export default PointsLayer
