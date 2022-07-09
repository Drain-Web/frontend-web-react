import React, { useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { DomEvent } from "leaflet";

// import CSS styles
import ownStyles from "../../../style/TimeViewer.module.css";

const TimeViewer = ({ url, step }) => {
  const date = url.split("/")[4];
  const date_string =
    date.slice(0, 4) +
    "-" +
    date.slice(4, 6) +
    "-" +
    date.slice(6, 8) +
    " " +
    date.slice(8, 10) +
    ":" +
    date.slice(10, 12) +
    ":" +
    date.slice(12, 14);
  return (
    <>
      <div
        className={`${ownStyles.mainContainer} leaflet-center leaflet-bottom leaflet-bar`}
      >
        <Container
          className={`${ownStyles.content} align-items-center align-middle`}
          style={{ width: "100%" }}
        >
          <p style={{ margin: 0 }}>{date_string}</p>
          <p style={{ margin: 0 }}>x{step * 2}H</p>
        </Container>
      </div>
    </>
  );
};

export default TimeViewer;
