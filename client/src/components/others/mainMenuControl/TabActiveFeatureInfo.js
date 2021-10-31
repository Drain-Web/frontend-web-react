import React, { useContext } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { apiUrl } from "../../../libs/api.js"

// import contexts
// TODO: use only the standard ones
import MapContext from "../../contexts/MapContext";
import { TabActiveFeatureInfoContext } from "../../contexts/TabActiveFeatureInfoContext";
import varsStateLib from "../../contexts/varsStateLib";
import VarsState from "../../contexts/VarsState";

// import CSS styles
import ownStyles from "../../../style/MainMenuControl.module.css";

export const TabActiveFeatureInfo = ({ filtersData, overviewFilter }) => {
  // retireves context data
  const {
    setTimeSerieUrl,
    setIsHidden,
  } = useContext(MapContext);

  // const varsState = useContext(VarsState)[0]
  const { varsState } = useContext(VarsState)

  const activeLocation = varsStateLib.getActiveLocation(varsState)

  return (
    <>
      {activeLocation ? (
        <div>
          <h5>
            <span className="popuptitle">{activeLocation.shortName}</span>
          </h5>
          <p>
            <span className="popupsubtitle">Id: </span>
            <span className="popuptext">{activeLocation.locationId}</span>
          </p>
          <p>
            <span className="popupsubtitle">Longitude: </span>
            <span className="popuptext">{activeLocation.x}</span>
          </p>
          <p>
            <span className="popupsubtitle">Latitude: </span>
            <span className="popuptext">{activeLocationy}</span>
          </p>
          { (!varsStateLib.inMainMenuControlActiveTabOverview(varsState)) ? (
            <Button
              variant="primary"
              onClick={() => {
                console.log('From TabActiveFeatureInfo')
                const timeseriesUrl = apiUrl(
                  settings.apiBaseUrl,
                  "v1",
                  "timeseries",
                  {
                    filter: varsStateLib.getContextFilterId(varsState),
                    location: activeLocation.locationId
                  }
                );
                setTimeSerieUrl(timeseriesUrl);
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
