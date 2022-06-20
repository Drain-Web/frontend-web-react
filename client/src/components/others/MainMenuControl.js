import React, { useContext, useEffect, useRef, useState } from "react";
import { DomEvent } from "leaflet";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import useRemValue from "use-rem-value";
import { Button, CloseButton } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { cloneDeep } from 'lodash';

// import custom components
import { TabFilters } from "./mainMenuControl/TabFilters";
import { TabActiveFeatureInfo } from "./mainMenuControl/TabActiveFeatureInfo";

// import atoms
import atsVarStateLib from "../atoms/atsVarStateLib"
import { atVarStateDomMainMenuControl } from "../atoms/atsVarState";

// import contexts
import ConsFixed from "../contexts/ConsFixed";

// import CSS styles
import ownStyles from "../../style/MainMenuControl.module.css";

/*
 * Map menu that allows selection of filters and more.
 */

// ** OBJ - Bootstrap div **********************************************************************

const MainMenuControl = ({ settings, position }) => {
  // ** SET HOOKS ******************************************************************************
  const { consFixed } = useContext(ConsFixed);

  const [atomVarStateDomMainMenuControl, setAtVarStateDomMainMenuControl] =
    useRecoilState(atVarStateDomMainMenuControl)

  // Get global states and set local states
  const [isVisible, setIsVisible] = useState(true)

  const divRef = useRef(null);

  useEffect(() => {
    DomEvent.disableClickPropagation(divRef.current);
  })

  const remValue = useRemValue()

  const contentProps = useSpring({
    marginLeft: isVisible ? 1 : -16 * remValue
  })

  // ** FUNCTIONS ******************************************************************************

  const tabOnSelect = (selectedTab) => {
    const atmVarStateDomMainMenuControl = cloneDeep(atomVarStateDomMainMenuControl);
    atsVarStateLib.setMainMenuControlActiveTab(selectedTab, atmVarStateDomMainMenuControl)
    console.log("Setting new tab as:", selectedTab)
    setAtVarStateDomMainMenuControl(atmVarStateDomMainMenuControl)
  }

  // ** MAIN RENDER ****************************************************************************

  // build content of the menu
  const menuContent = (
      <animated.div className={ownStyles.content} style={contentProps}>
        <Container className="h-100" ref={divRef}>
          <Row>
            <Col xs={10} md={10} lg={10} >
              <h1>{consFixed.region.systemInformation.name}</h1>
            </Col>
            <Col xs={2} md={2} lg={2} className="text-right" >
              {
                (isVisible) ?
                (<CloseButton onClick={() => { setIsVisible(false) }}/>) :
                (<Button onClick={() => { setIsVisible(true) }}>+</Button>)
              } 
            </Col>
          </Row>
          <Row>
            <Col>
              <hr />
            </Col>
          </Row>
          <Row>
            <Tabs
              className="mb-2"
              defaultActiveKey={atsVarStateLib.getMainMenuControlActiveTab(atomVarStateDomMainMenuControl)}
              activeKey={atsVarStateLib.getMainMenuControlActiveTab(atomVarStateDomMainMenuControl)}
              onSelect={tabOnSelect}
            >
              <Tab
                eventKey="tabOverview"
                title="Overview"
                style={{ fontsize: "24px" }}
              >
                <p>
                  <span className="popuptitle">About</span>
                </p>
                <span className="popuptext">
                  <p>Four major stream systems compose the GTA.</p>
                  <p><strong style={{ color: "#900090" }}>Humber River:</strong></p>
                  <ul>
                    <li>Area: 911 km<sup>2</sup></li>
                    <li>
                      Land cover:
                      <ul>
                        <li>45% urban</li>
                        <li>47% rural</li>
                        <li>8% forest</li>
                      </ul>
                    </li>
                  </ul>
                  <p><strong style={{ color: "#6060B0" }}>Don River:</strong></p>
                  <ul>
                    <li>Area: 360 km<sup>2</sup></li>
                    <li>
                      Land cover:
                      <ul>
                        <li>92% urban</li>
                        <li>8% rural</li>
                      </ul>
                    </li>
                  </ul>
                  <p><strong style={{ color: "#909000" }}>Mimico and Etobicoke Creeks:</strong></p>
                  <ul>
                    <li>Area: 244 km<sup>2</sup></li>
                    <li>
                      Land cover:
                      <ul>
                        <li>80% urban</li>
                        <li>20% rural</li>
                      </ul>
                    </li>
                  </ul>

                </span>
              </Tab>

              <Tab eventKey="tabFilters" title="Filters">
                <TabFilters
                  filtersData={consFixed.filters}
                  settings={settings} 
                />
              </Tab>

              <Tab eventKey="tabActiveFeatureInfo" title="Info">
                <TabActiveFeatureInfo settings={settings} />
              </Tab>
            </Tabs>
          </Row>
        </Container>
      </animated.div>
  );

  // containing div th
  return (
    <div className={`${ownStyles.mainContainer} leaflet-control leaflet-bar ${position}`} >
        {menuContent}
    </div>
  );
};

export default MainMenuControl;
