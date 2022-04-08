import React, { useContext, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SVGOverlay } from "react-leaflet";
import * as d3 from "d3";
import * as d3Geo from "d3-geo";
import { LayerGroup } from "react-leaflet";
import Ellipse from "./Ellipse";

const geoShape = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [174.78, -41.29],
            [174.79, -41.29],
            [174.79, -41.28],
            [174.78, -41.28],
            [174.78, -41.29],
          ],
        ],
      },
    },
  ],
};

const DrainageNetwork = ({}) => {
  //   const map = useContext(MapContext);

  return (
    <LayerGroup>
      {geoShape.features.geometry.map((city) => (
        <>
          <Ellipse
            center={[city[2], city[1]]}
            radii={[50, 50]}
            tilt={1}
            // options={city.options}
          >
            <Popup>This is quality popup content.</Popup>
          </Ellipse>
        </>
      ))}
    </LayerGroup>
  );
};

export default DrainageNetwork;
