import React, { useEffect, useRef } from 'react'
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
    })

    // ** RENDER *******************************************************************************
    return (
        <div className={`${ownStyles.mainContainer} leaflet-center leaflet-bottom leaflet-bar`} ref={divRef}>
            <Container className={`${ownStyles.content}`} >
                <Row>
                    <Col xs={12} md={12} lg={12}> 
                        <strong>Legend</strong>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12}> 
                        TODO
                    </Col>
                </Row>
            </Container>
        </div>
    )

}

export default VectorGridLegend;