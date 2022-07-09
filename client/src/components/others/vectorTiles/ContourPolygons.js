import React from "react";
import { Polygon, Tooltip } from "react-leaflet";

import { nieve } from "../../../assets/nieve";

const ContourPolygons = (data) => {
  const data1 = nieve;

  function getColor(value) {
    let color = null;

    if (value <= 1) {
      color = "#04e9e7";
    } else if (value <= 2) {
      color = "#019ff4";
    } else if (value <= 3) {
      color = "#0300f4";
    } else if (value <= 4) {
      color = "#02fd02";
    } else if (value <= 5) {
      color = "#01c501";
    } else if (value <= 6) {
      color = "#008e00";
    } else if (value <= 7) {
      color = "#fdf802";
    } else if (value <= 8) {
      color = "#e5bc00";
    } else if (value <= 9) {
      color = "#fd9500";
    } else if (value <= 10) {
      color = "#fd0000";
    } else if (value <= 10) {
      color = "#d40000";
    } else if (value <= 10) {
      color = "#bc0000";
    } else if (value <= 10) {
      color = "#f800fd";
    } else if (value <= 10) {
      color = "#9854c6";
    } else if (value <= 10) {
      color = "#fdfdfd";
    }
    return color;
  }

  const zip = (...arr) =>
    Array(Math.max(...arr.map((a) => a.length)))
      .fill()
      .map((_, i) => arr.map((a) => a[i]));

  function Heatmap(data) {
    return zip(data1.x, data1.y, data1.z).map((d) => {
      const upper_right = [d[1] + 0.05, d[0] + 0.05];
      const upper_left = [d[1] - 0.05, d[0] + 0.05];
      const bottom_right = [d[1] + 0.05, d[0] - 0.05];
      const bottom_left = [d[1] - 0.05, d[0] - 0.05];

      const positions = [upper_right, upper_left, bottom_left, bottom_right];
      // console.log(d[2]);
      const pathOptions = {
        fillColor: getColor(d[2]),
        fillOpacity: 0.8,
        color: null,
        strokeColor: null,
      };

      return (
        <>
          <Polygon pathOptions={pathOptions} positions={positions}>
            <Tooltip sticky>{d[2]}mm</Tooltip>
          </Polygon>
        </>
      );
    });
  }

  return (
    <>
      <Heatmap data={data1} />
    </>
  );
};

export default ContourPolygons;
