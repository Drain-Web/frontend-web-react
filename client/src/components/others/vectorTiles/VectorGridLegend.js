import React, { useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { DomEvent } from "leaflet";

// import CSS styles
import ownStyles from "../../../style/VectorGridLegend.module.css";

const VectorGridLegend = ({ settings }) => {
  // ** SET HOOKS ****************************************************************************

  // Avoid click propagation
  const divRef = useRef(null);
  useEffect(() => {
    DomEvent.disableClickPropagation(divRef.current);
  });

  // ** RENDER *******************************************************************************

  return (
    <div
      className={`${ownStyles.mainContainer} leaflet-center leaflet-bottom leaflet-bar`}
      ref={divRef}
    >
      <Container
        className={`${ownStyles.content} align-items-center align-middle`}
        style={{ width: "90%" }}
      >
        <Row style={{ paddingRight: "5%", paddingLeft: "5%" }}>
          <Col xs={12} md={12} lg={12}>
            <strong>Flow magnitude</strong>
          </Col>
        </Row>
        <Row style={{ paddingRight: "5%", paddingLeft: "5%" }}>
          <Col
            xs={2}
            md={2}
            lg={2}
            style={{ backgroundColor: "#0000FF", color: "#0000FF" }}
          >
            <div style={{ backgroundColor: "#0000FF", color: "#0000FF" }}>
              __
            </div>
          </Col>
          <Col
            xs={2}
            md={2}
            lg={2}
            style={{ backgroundColor: "#00FF00", color: "#00FF00" }}
          >
            <div style={{ backgroundColor: "#00FF00", color: "#00FF00" }}>
              __
            </div>
          </Col>
          <Col
            xs={2}
            md={2}
            lg={2}
            style={{ backgroundColor: "#FFFF00", color: "#FFFF00" }}
          >
            <div style={{ backgroundColor: "#FFFF00", color: "#FFFF00" }}>
              __
            </div>
          </Col>
          <Col
            xs={2}
            md={2}
            lg={2}
            style={{ backgroundColor: "#FFA500", color: "#FFA500" }}
          >
            <div style={{ backgroundColor: "#FFA500", color: "#FFA500" }}>
              __
            </div>
          </Col>
          <Col
            xs={2}
            md={2}
            lg={2}
            style={{ backgroundColor: "#FF0000", color: "#FF0000" }}
          >
            <div style={{ backgroundColor: "#FF0000", color: "#FF0000" }}>
              __
            </div>
          </Col>
          <Col
            xs={2}
            md={2}
            lg={2}
            style={{ backgroundColor: "#6a0dad", color: "#6a0dad" }}
          >
            <div style={{ backgroundColor: "#6a0dad", color: "#6a0dad" }}>
              __
            </div>
          </Col>
        </Row>
        <Row style={{ paddingRight: "5%", paddingLeft: "5%" }}>
          <Col xs={2} md={2} lg={2}>
            {"<0.5"}
          </Col>
          <Col xs={2} md={2} lg={2}>
            {"<1"}
          </Col>
          <Col xs={2} md={2} lg={2}>
            {"<1.5"}
          </Col>
          <Col xs={2} md={2} lg={2}>
            {"<2"}
          </Col>
          <Col xs={2} md={2} lg={2}>
            {"<2.5"}
          </Col>
          <Col xs={2} md={2} lg={2}>
            {"<3"}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VectorGridLegend;
