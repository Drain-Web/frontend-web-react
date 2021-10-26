import React, { useContext } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

// import contexts
// TODO: use only the standard ones
import MapLocationsContext from "../../contexts/MapLocationsContext";
import FilterContext from "../../contexts/FilterContext";
import MapContext from "../../contexts/MapContext";
import { TabActiveFeatureInfoContext } from "../../contexts/TabActiveFeatureInfoContext";
import VarsState from "../../contexts/VarsState";

// import CSS styles
import ownStyles from "../../../style/MainMenuControl.module.css";

export const TabActiveFeatureInfo = ({ filtersData, overviewFilter }) => {
  // retireves context data
  const { filterContextData } = useContext(FilterContext);
  const {
    activePointFeature,
    setActivePointFeature,
    setTimeSerieUrl,
    setIsHidden,
  } = useContext(MapContext);

  const varsState = useContext(VarsState)[0]

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
          { (varsState.domObjects.mainMenuControl.activeTab != 'tabOverview') ? (
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
