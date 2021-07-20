import React, { useState } from "react";
import axios from "axios";
import { Icon } from "leaflet";
import L from "leaflet";
import { Alert, Spinner } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  FeatureGroup,
  Polygon,
} from "react-leaflet";
import useSWR from "swr";
import "./App.css";
import Panel from "./components/panel";
import DropDownTimeSeries from "./components/DropDownTimeSeries";
// import timeSeriesPlot from "./components/timeSeriesPlot";
import 'leaflet/dist/leaflet.css';

const { BaseLayer } = LayersControl;

const icon = new Icon({
  iconUrl: "img/browndot.png",
  iconSize: [25, 25],
  popupAnchor: [0, -15],
});

const fetcher = (url) => axios.get(url).then((res) => res.data);


const App = () => {
  //Estado - enpoint para series de tiempo
  const [timeSerieUrl, setTimeSerieUrl] = useState(null);
  //Panel state - show or hide
  const [isHidden, setIsHidden] = useState(false);

  const [activePointFeature, setActivePointFeature] = useState(null);
  const { data: data2, error: error2 } = useSWR(
    "https://hydro-web.herokuapp.com/v1/locations",
    fetcher
  );
  const point_feature = data2 && !error2 ? data2 : {};

  const [activeBoundaries, setActiveBoundaries] = useState(null);
  const { data: data1, error: error1 } = useSWR(
    "https://hydro-web.herokuapp.com/v1dw/boundaries",
    fetcher
  );
  const boundariesData = data1 && !error1 ? data1 : {};

  const [activeRegion, setActiveRegion] = useState(null);
  const { data: data3, error: error3 } = useSWR(
    "https://hydro-web.herokuapp.com/v1/region",
    fetcher
  );

  const regionData = data3 && !error3 ? data3 : {};

  const { data: dataids, error: errorids } = useSWR(
    "https://hydro-web.herokuapp.com/v1/filters",
    fetcher
  );

  if (errorids) return <div>failed to load</div>;
  if (!dataids) return <div>loading...</div>;

  let ids = dataids && !errorids ? dataids : {};

  ids = ids.map((filter) => filter.id);

  if (error1) {
    return <Alert variant="danger">There is a problem</Alert>;
  }

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

  const x =
    (regionData["map"].defaultExtent.right +
      regionData["map"].defaultExtent.left) /
    2;
  const y =
    (regionData["map"].defaultExtent.top +
      regionData["map"].defaultExtent.bottom) /
    2;

  const position = [y, x];

  const zoom = 9;

  return (
    <React.Fragment>
      <MapContainer center={position} zoom={zoom}>
        <LayersControl>
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <BaseLayer name="Terrain">
            <TileLayer
              attribution='&copy; <a href="https://stamen.com/open-source/">Stamen</a> contributors'
              url="http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg"
            />
          </BaseLayer>

          <BaseLayer name="NASA Gibs Blue Marble">
            <TileLayer
              url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
              attribution="&copy; NASA Blue Marble, image service by OpenGeo"
              maxNativeZoom={12}
            />
          </BaseLayer>

          <LayersControl.Overlay checked name="Stations">
            <LayerGroup name="Locations">
              {point_feature.locations.map((point_feature) => (
                <Marker
                  key={point_feature.locationId}
                  position={[point_feature.y, point_feature.x]}
                  onClick={() => {
                    setActivePointFeature(point_feature);
                  }}
                  icon={icon}
                >
                  <Popup
                    position={[point_feature.y, point_feature.x]}
                    onClose={() => {
                      setActivePointFeature(point_feature);
                    }}
                  >
                    <div>
                      <h5>
                        <span className="popuptitle">
                          {point_feature.shortName}
                        </span>
                      </h5>
                      <p>
                        <span className="popuptitle">Id:</span>{" "}
                        {point_feature.locationId}
                      </p>
                      <p>
                        <span className="popuptitle">Longitude:</span>{" "}
                        {point_feature.x}
                      </p>
                      <p>
                        <span className="popuptitle">Latitude:</span>{" "}
                        {point_feature.y}
                      </p>
                    </div>
                    <DropDownTimeSeries
                      ids={ids}
                      locationid={point_feature.locationId}
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

          <LayersControl.Overlay checked name="Basins">
            <LayerGroup name="Basins">
              {boundariesData.map((poly) => {
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
              })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <Panel
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
        />
      </MapContainer>
    </React.Fragment>
  );
};

export default App;
