import React, { useContext } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import MapLocationsContext from "../../contexts/MapLocationsContext";
import FilterContext from "../../contexts/FilterContext";
import TabActiveFeatureInfoContext from "../../contexts/TabActiveFeatureInfoContext";
import ownStyles from "../../../style/MainMenuControl.module.css";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

export const TabActiveFeatureInfo = ({ filtersData, overviewFilter }) => {
  // retireves context data
  const { mapLocationsContextData } = useContext(MapLocationsContext);
  const { filterContextData } = useContext(FilterContext);
  const {
    tabActiveFeatureInfoContextData,
    setTabActiveFeatureInfoContextData,
  } = useContext(TabActiveFeatureInfoContext);

  return (
    <>
      {" "}
      <div>
        <h5>
          <span className="popuptitle">prueba</span>
        </h5>
        <p>
          <span className="popuptitle">Id:</span> prueba
        </p>
        <p>
          <span className="popuptitle">Longitude:</span> prueba
        </p>
        <p>
          <span className="popuptitle">Latitude:</span> prueba
        </p>
        {!filterContextData.inOverview ? (
          <p>
            <span onClick={() => {}}>
              <Button variant="primary" disabled>
                <Spinner as="span" size="sm" role="status" aria-hidden="true" />
                Plot event
              </Button>
            </span>
          </p>
        ) : (
          <></>
        )}
      </div>
      ;
    </>
  );
};
