import React from "react";
import { SideNavBar } from "./SideNavBar";
import "./styles.css";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

const SideNavBarMap = ({ position }) => {
  const parentMap = useMap();

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topleft;

  return (
    <div className={`${positionClass}`}>
      <div className="leaflet-control leaflet-bar">{<SideNavBar />}</div>
    </div>
  );
};

export default SideNavBarMap;
