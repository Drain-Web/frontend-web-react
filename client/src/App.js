import React, { useState } from "react";
import axios from "axios";
import { Icon } from "leaflet";

import { Alert, Spinner } from "react-bootstrap";
import {
  MapContainer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  Polygon,
} from "react-leaflet";
import useSWR from "swr";
import "./App.css";
import Panel from "./components/Panel";
import DropDownTimeSeries from "./components/DropDownTimeSeries";
// import timeSeriesPlot from "./components/timeSeriesPlot";
import "leaflet/dist/leaflet.css";
import { baseLayersData } from "./assets/MapBaseLayers";
import BaseLayers from "./components/BaseLayers";

const icon = new Icon({
  iconUrl: "img/browndot.png",
  iconSize: [25, 25],
  popupAnchor: [0, -15],
});

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

const App = () => {
  // Estado - enpoint para series de tiempo
  const [timeSerieUrl, setTimeSerieUrl] = useState(null);

  // Panel state - show or hide
  const [isHidden, setIsHidden] = useState(false);

  // request location data -> store in const 'point_feature'
  const [activePointFeature, setActivePointFeature] = useState(null);
  const { data: data2, error: error2 } = useSWR(
    "https://hydro-web.herokuapp.com/v1/locations",
    fetcher
  );
  const pointFeature = data2 && !error2 ? data2 : {};

  // request boundaries data -> store in const 'boundariesData'
  const [activeBoundaries, setActiveBoundaries] = useState(null);
  const { data: data1, error: error1 } = useSWR(
    "https://hydro-web.herokuapp.com/v1dw/boundaries",
    fetcher
  );
  const boundariesData = data1 && !error1 ? data1 : {};

  // request region data -> store in const 'regionData'
  const [activeRegion, setActiveRegion] = useState(null);
  const { data: data3, error: error3 } = useSWR(
    "https://hydro-web.herokuapp.com/v1/region",
    fetcher
  );
  const regionData = data3 && !error3 ? data3 : {};

  // request filters data -> store in 'ids'
  const { data: dataids, error: errorids } = useSWR(
    "https://hydro-web.herokuapp.com/v1/filters",
    fetcher
  );
  if (errorids) return <div>failed to load</div>;
  if (!dataids) return <div>loading...</div>;
  let ids = dataids && !errorids ? dataids : {};
  ids = ids.map((filter) => filter.id);

  // basic check - boundaries must load
  if (error1) {
    return <Alert variant="danger">There is a problem</Alert>;
  }

  // if failed to load boundaries does this
  if (!data1) {
    return (
      <Spinner
        animation="border"
        variant="danger"
        role="status"
        style={{
          width: "400px",
          height: "400px",
          margin: "auto",
          display: "block",
        }}
      />
    );
  }

  let reversedPolygon;

  // gets the central coordinates of the map into const 'position'
  const x =
    (regionData.map.defaultExtent.right + regionData.map.defaultExtent.left) /
    2;
  const y =
    (regionData.map.defaultExtent.top + regionData.map.defaultExtent.bottom) /
    2;
  const position = [y, x];

  // defines zoom level
  // TODO: make it a function of the map extents
  const zoom = 9;

  // build page if everithing worked fine
  return (
    <>
      <MapContainer center={position} zoom={zoom}>
        <LayersControl>
          <BaseLayers baseLayerData={baseLayersData} />

          {/* adds layer control for stations (shouldnt be 'locations'?) */}
          <LayersControl.Overlay checked name="Stations">
            <LayerGroup name="Locations">
              {pointFeature.locations.map((pointFeature) => (
                <Marker
                  key={pointFeature.locationId}
                  position={[pointFeature.y, pointFeature.x]}
                  onClick={() => {
                    setActivePointFeature(pointFeature);
                  }}
                  icon={icon}
                >
                  <Popup
                    position={[pointFeature.y, pointFeature.x]}
                    onClose={() => {
                      setActivePointFeature(pointFeature);
                    }}
                  >
                    <div>
                      <h5>
                        <span className="popuptitle">
                          {pointFeature.shortName}
                        </span>
                      </h5>
                      <p>
                        <span className="popuptitle">Id:</span>{" "}
                        {pointFeature.locationId}
                      </p>
                      <p>
                        <span className="popuptitle">Longitude:</span>{" "}
                        {pointFeature.x}
                      </p>
                      <p>
                        <span className="popuptitle">Latitude:</span>{" "}
                        {pointFeature.y}
                      </p>
                    </div>
                    <DropDownTimeSeries
                      ids={ids}
                      locationid={pointFeature.locationId}
                      timeSerieUrl={timeSerieUrl}
                      setTimeSerieUrl={setTimeSerieUrl}
                      setIsHidden={setIsHidden}
                    />
                    {/* <timeSeriesPlot data={data} /> */}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* adds layer control for basins (shouldnt be 'boundaries'?) */}
          <LayersControl.Overlay checked name="Basins">
            <LayerGroup name="Basins">
              {
                /* points in geojson are in [lat, lon] (or [y, x]) - need to be inverted */
                boundariesData.map((poly) => {
                  reversedPolygon = Array.from(poly.polygon.values()).map(
                    (pol) => [pol[1], pol[0]]
                  );

                  return (
                    <Polygon
                      pathOptions={{
                        color: "#069292",
                        fillColor: null,
                      }}
                      positions={reversedPolygon}
                      key={poly.id}
                    />
                  );
                })
              }
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {/* add */}
        <Panel
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
          position={"Right"}
        />

        <Panel
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
          position={"Left"}
        />
      </MapContainer>
    </>
  );
};

export default App;
