import { LayersControl, TileLayer } from "react-leaflet";
import React, { useState, useContext, useEffect } from "react";
import VarsState from "../../contexts/VarsState";

const PngTilesLayers = ({ pngTileLayersData }) => {
  const { varsState, setVarState } = useContext(VarsState);

  const dates = [
    "20210201000000",
    "20210201003000",
    "20210201010000",
    "20210201013000",
    "20210201020000",
    "20210201023000",
    "20210201030000",
    "20210201033000",
    "20210201040000",
    "20210201043000",
    "20210201050000",
    "20210201053000",
    "20210201060000",
    "20210201063000",
    "20210201070000",
    "20210201073000",
    "20210201080000",
    "20210201083000",
    "20210201090000",
    "20210201093000",
    "20210201100000",
    "20210201103000",
    "20210201110000",
    "20210201113000",
    "20210201120000",
    "20210201123000",
    "20210201130000",
    "20210201133000",
    "20210201140000",
    "20210201143000",
    "20210201150000",
    "20210201153000",
    "20210201160000",
    "20210201163000",
    "20210201170000",
    "20210201173000",
    "20210201180000",
    "20210201183000",
    "20210201190000",
    "20210201193000",
    "20210201200000",
    "20210201203000",
    "20210201210000",
    "20210201213000",
    "20210201220000",
    "20210201223000",
    "20210201230000",
    "20210201233000",
    "20210202000000",
    "20210202003000",
    "20210202010000",
    "20210202013000",
    "20210202020000",
    "20210202023000",
    "20210202030000",
    "20210202033000",
    "20210202040000",
    "20210202043000",
    "20210202050000",
    "20210202053000",
    "20210202060000",
    "20210202063000",
    "20210202070000",
    "20210202073000",
    "20210202080000",
    "20210202083000",
    "20210202090000",
    "20210202093000",
    "20210202100000",
    "20210202103000",
    "20210202110000",
    "20210202113000",
    "20210202120000",
    "20210202123000",
    "20210202130000",
    "20210202133000",
    "20210202140000",
    "20210202143000",
    "20210202150000",
    "20210202153000",
    "20210202160000",
    "20210202163000",
    "20210202170000",
    "20210202173000",
    "20210202180000",
    "20210202183000",
    "20210202190000",
    "20210202193000",
    "20210202200000",
    "20210202203000",
    "20210202210000",
    "20210202213000",
    "20210202220000",
    "20210202223000",
    "20210202230000",
    "20210202233000",
    "20210203000000",
    "20210203003000",
    "20210203010000",
    "20210203013000",
    "20210203020000",
    "20210203023000",
  ];

  const [time, setTime] = useState(0);
  const [animationActive, setAnimationActive] = useState(false);

  useEffect(() => {
    setAnimationActive(true);

    const interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 5000);

    if (time >= 30) {
      setAnimationActive(false);
      clearInterval(interval);
    }
    return () => {
      setAnimationActive(false);
      clearInterval(interval);
    };
  }, [time, animationActive]);

  return (
    <>
      {Object.keys(pngTileLayersData).map((tileLayer) => {
        return (
          <LayersControl.Overlay
            checked={pngTileLayersData[tileLayer].checked}
            name={pngTileLayersData[tileLayer].name}
          >
            <TileLayer
              attribution={pngTileLayersData[tileLayer].attribution}
              url={pngTileLayersData[tileLayer].url.replace(
                "date",
                dates[time]
              )}
              tms={pngTileLayersData[tileLayer].tms}
              opacity={pngTileLayersData[tileLayer].opacity}
            />
          </LayersControl.Overlay>
        );
      })}
    </>
  );
};

export default PngTilesLayers;
