import React, { useEffect, useRef } from 'react'
import { Button, Col, Container, Row } from "react-bootstrap";
import { DomEvent } from "leaflet";
import { useRecoilValue } from 'recoil';

import { atVarStateVectorGridMode } from "../../atoms/atsVarState";

// import CSS styles
import ownStyles from "../../../style/VectorGridLegend.module.css";
import vGridStyles from "../../../style/VectorGridCommon.module.css";


const Legend = ({title, colors, values}) => {
    return (
        <Container className={`${ownStyles.legendContainer} align-items-center align-middle`} >
            <Row style={{paddingRight: "5%", paddingLeft: "5%"}}>
                <Col xs={12} md={12} lg={12}> 
                    <strong>{title}</strong>
                </Col>
            </Row>
            <Row style={{paddingRight: "5%", paddingLeft: "5%"}}>
                <Col xs={2} md={2} lg={2} style={{backgroundColor:"#5555FF", color:"#5555FF"}}>
                    <div style={{backgroundColor:"#5555FF", color:"#5555FF"}}>__</div>
                </Col>
                <Col xs={2} md={2} lg={2} style={{backgroundColor:"#5522BB", color:"#5522BB"}}> 
                    <div style={{backgroundColor:"#5522BB", color:"#5522BB"}}>__</div>
                </Col>
                <Col xs={2} md={2} lg={2} style={{backgroundColor:"#550099", color:"#550099"}}> 
                    <div style={{backgroundColor:"#550099", color:"#550099"}}>__</div>
                </Col>
                <Col xs={2} md={2} lg={2} style={{backgroundColor:"#AA00AA", color:"#AA00AA"}}> 
                <div style={{backgroundColor:"#AA00AA", color:"#AA00AA"}}>__</div>
                </Col>
                <Col xs={2} md={2} lg={2} style={{backgroundColor:"#DD0055", color:"#DD0055"}}> 
                    <div style={{backgroundColor:"#DD0055", color:"#DD0055"}}>__</div>
                </Col>
                <Col xs={2} md={2} lg={2} style={{backgroundColor:"#990022", color:"#990022"}}> 
                    <div style={{backgroundColor:"#990022", color:"#990022"}}>__</div>
                </Col>
            </Row>
            <Row style={{paddingRight: "5%", paddingLeft: "5%"}}>
                <Col xs={2} md={2} lg={2}> 
                    1
                </Col>
                <Col xs={2} md={2} lg={2}> 
                    2
                </Col>
                <Col xs={2} md={2} lg={2}> 
                    5
                </Col>
                <Col xs={2} md={2} lg={2}> 
                    10
                </Col>
                <Col xs={2} md={2} lg={2}> 
                    25
                </Col>
                <Col xs={2} md={2} lg={2}> 
                    50
                </Col>
            </Row>
        </Container>
    )
}

const ConfigButton = ({iconUrl, infoLabel}) => {

    // ** SET HOOKS ****************************************************************************
    
    // Avoid click propagation
    const divRef = useRef(null);
    useEffect(() => { DomEvent.disableClickPropagation(divRef.current); })

    // ** RENDER *******************************************************************************

    return (
        <div ref={divRef}
          onClick={() => {alert(`Selecting: ${infoLabel}`)}}
          className={`${vGridStyles.controlButton}`}
        >
            +
        </div>
    )
}

const SubContainer = ({title, colors, values, iconUrl, infoLabel}) => {
    // title: string
    // colors: array of size N
    // values: array of size N

    // ** SET HOOKS ****************************************************************************
    
    // Avoid click propagation
    const divRef = useRef(null);
    useEffect(() => { DomEvent.disableClickPropagation(divRef.current); })

    // ** RENDER *******************************************************************************

    return (
      <Container className={`${ownStyles.subContainer}`} ref={divRef} >
        <Row>
          <Col s={10} md={10} lg={10}>
            <Legend title={title} />
          </Col>
          <Col s={2} md={2} lg={2} className={`${ownStyles.configCol}`}>
            <ConfigButton iconUrl={iconUrl} infoLabel={infoLabel} />
          </Col>
        </Row>
      </Container>
    )
}

const VectorGridLegend = ({ settings }) => {

    // ** SET HOOKS ****************************************************************************
    
    // Avoid click propagation
    const divRef = useRef(null);
    useEffect(() => { DomEvent.disableClickPropagation(divRef.current); })

    const atomVarStateVectorGridMode = useRecoilValue(atVarStateVectorGridMode)

    // ** RENDER *******************************************************************************

    if (atomVarStateVectorGridMode !== 'animated') {
        return (<div />)
    }

    return (
        <div className={`${ownStyles.mainContainer} leaflet-control leaflet-bar`} ref={divRef}>
            <SubContainer title='Streams: Ret. Period (years)' colors={null} values={null} />
            <SubContainer title='Other: Ret. Period (years)' colors={null} values={null} />
        </div>
    )

    return (
        <div className={`${ownStyles.mainContainer} leaflet-center leaflet-bottom leaflet-bar`} ref={divRef}>
            <Container className={`${ownStyles.content} align-items-center align-middle`} style={{width:"90%"}}>
                <Row style={{paddingRight: "5%", paddingLeft: "5%"}}>
                    <Col xs={12} md={12} lg={12}> 
                        <strong>Return Period (years)</strong>
                    </Col>
                </Row>
                <Row style={{paddingRight: "5%", paddingLeft: "5%"}}>
                    <Col xs={2} md={2} lg={2} style={{backgroundColor:"#5555FF", color:"#5555FF"}}>
                        <div style={{backgroundColor:"#5555FF", color:"#5555FF"}}>__</div>
                    </Col>
                    <Col xs={2} md={2} lg={2} style={{backgroundColor:"#5522BB", color:"#5522BB"}}> 
                        <div style={{backgroundColor:"#5522BB", color:"#5522BB"}}>__</div>
                    </Col>
                    <Col xs={2} md={2} lg={2} style={{backgroundColor:"#550099", color:"#550099"}}> 
                        <div style={{backgroundColor:"#550099", color:"#550099"}}>__</div>
                    </Col>
                    <Col xs={2} md={2} lg={2} style={{backgroundColor:"#AA00AA", color:"#AA00AA"}}> 
                    <div style={{backgroundColor:"#AA00AA", color:"#AA00AA"}}>__</div>
                    </Col>
                    <Col xs={2} md={2} lg={2} style={{backgroundColor:"#DD0055", color:"#DD0055"}}> 
                        <div style={{backgroundColor:"#DD0055", color:"#DD0055"}}>__</div>
                    </Col>
                    <Col xs={2} md={2} lg={2} style={{backgroundColor:"#990022", color:"#990022"}}> 
                        <div style={{backgroundColor:"#990022", color:"#990022"}}>__</div>
                    </Col>
                </Row>
                <Row style={{paddingRight: "5%", paddingLeft: "5%"}}>
                    <Col xs={2} md={2} lg={2}> 
                        1
                    </Col>
                    <Col xs={2} md={2} lg={2}> 
                        2
                    </Col>
                    <Col xs={2} md={2} lg={2}> 
                        5
                    </Col>
                    <Col xs={2} md={2} lg={2}> 
                        10
                    </Col>
                    <Col xs={2} md={2} lg={2}> 
                        25
                    </Col>
                    <Col xs={2} md={2} lg={2}> 
                        50
                    </Col>
                </Row>
            </Container>
        </div>
    )

}

export default VectorGridLegend;