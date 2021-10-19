import React, { useContext } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import MapLocationsContext from "../../contexts/MapLocationsContext";
import FilterContext from "../../contexts/FilterContext";
import MapContext from "../../contexts/MapContext";
import { TabActiveFeatureInfoContext } from "../../contexts/TabActiveFeatureInfoContext";
import ownStyles from "../../../style/MainMenuControl.module.css";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

export const TabActiveFeatureInfo = ({ filtersData, overviewFilter }) => {
  // retireves context data
  const { mapLocationsContextData } = useContext(MapLocationsContext);
  const { filterContextData } = useContext(FilterContext);
  const {
    activePointFeature,
    setActivePointFeature,
    setTimeSerieUrl,
    setIsHidden,
  } = useContext(MapContext);

  return (
    <>
      {activePointFeature ? (
        <div>
          <h5>
            <span className="popuptitle">{activePointFeature.shortName}</span>
          </h5>
          <p>
            <span className="popupsubtitle">Id: </span>
            <span className="popuptext">{activePointFeature.locationId}</span>
          </p>
          <p>
            <span className="popupsubtitle">Longitude: </span>
            <span className="popuptext">{activePointFeature.x}</span>
          </p>
          <p>
            <span className="popupsubtitle">Latitude: </span>
            <span className="popuptext">{activePointFeature.y}</span>
          </p>
          {!filterContextData.inOverview ? (
            <Button
              variant="primary"
              onClick={() => {
                setTimeSerieUrl(
                  `https://hydro-web.herokuapp.com/v1/timeseries/?filter=${filterContextData.filterId}&location=${activePointFeature.locationId}`
                );
                setIsHidden(false);
              }}
            >
              <Spinner as="span" size="sm" role="status" aria-hidden="true" />
              Plot event
            </Button>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="popuptext">
          Click on a location icon to get more information.
        </div>
      )}
    </>
  );
};
