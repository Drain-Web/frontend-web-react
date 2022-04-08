import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-ellipse";
import { createPathComponent } from "@react-leaflet/core";

function createEllipse(props, context) {
  const instance = new L.Ellipse(
    props.center,
    props.radii,
    props.tilt,
    props.options
  );

  return {
    instance,
    context: {
      ...context,
      overlayContainer: instance,
    },
  };
}

function updateEllipse(instance, props, prevProps) {
  if (
    props.center !== prevProps.center ||
    props.radii !== prevProps.radii ||
    props.tilt !== prevProps.tilt ||
    props.options !== prevProps.options
  ) {
    instance.setLatLng(props.center);
    instance.setRadius(props.radii);
    instance.setTilt(props.tilt);
    instance.setStyle(props.options);
  }
}

const Ellipse = createPathComponent(createEllipse, updateEllipse);

export default Ellipse;
