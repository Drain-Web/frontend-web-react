import React, { useContext } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { apiUrl } from "../../../libs/api.js"

// import contexts
import varsStateLib from '../../contexts/varsStateLib'
import VarsState from '../../contexts/VarsState'

export const TabActiveFeatureInfo = ({ settings }) => {
  // get context
  const { varsState, setVarState } = useContext(VarsState)
  const activeLocation = varsStateLib.getActiveLocation(varsState)

  return (
    <>
      {
      activeLocation
        ?
          (
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
                <span className="popuptext">{activeLocation.y}</span>
              </p>
              {
                (!varsStateLib.inMainMenuControlActiveTabOverview(varsState))
                  ?
                    (
                      <Button
                        variant="primary"
                        onClick={() => {
                          const timeseriesUrl = apiUrl(
                            settings.apiBaseUrl,
                            "v1",
                            "timeseries",
                            {
                              filter: varsStateLib.getContextFilterId(varsState),
                              location: activeLocation.locationId
                            }
                          )
                          varsStateLib.showPanelTabs(varsState)
                          varsStateLib.setTimeSerieUrl(timeseriesUrl, varsState)
                          setVarState(Math.random())
                        }}
                      >
                        <Spinner as="span" size="sm" role="status" aria-hidden="true" />
                        Plot event
                      </Button>
                    )
                  :
                    (
                      <></>
                    )
              }
            </div>
          ) 
        :
          (
            <div className="popuptext">
              Click on a location icon to get more information.
            </div>
          )
        }
    </>
  );
};
