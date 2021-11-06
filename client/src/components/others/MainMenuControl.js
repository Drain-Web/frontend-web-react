import React, { useContext, useEffect, useRef, useState } from "react";
import { DomEvent } from "leaflet";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import useRemValue from "use-rem-value";

// import custom components
import { TabFilters } from "./mainMenuControl/TabFilters";
import { TabActiveFeatureInfo } from "./mainMenuControl/TabActiveFeatureInfo";

// import contexts
import ConsFixed from "../contexts/ConsFixed";
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

// import CSS styles
import ownStyles from "../../style/MainMenuControl.module.css";

/*
 * Map menu that allows selection of filters and more.
 */

/* ** OBJ - Bootstrap div ******************************************************************** */

const MainMenuControl = ({ settings, position }) => {
  
  /* ** SET HOOKS **************************************************************************** */
  const { consFixed } = useContext(ConsFixed)

  // Get global states and set local states
  const { varsState, setVarState } = useContext(VarsState)
  const [showMe, setShowMe] = useState(varsStateLib.getMainMenuControlShow(varsState))

  const divRef = useRef(null);

  useEffect(() => {
    DomEvent.disableClickPropagation(divRef.current);
  });

  useEffect(() => {
    console.log("Should update.")
  }, [varsState['context'], varsState['domObjects']['mainMenuControl']['activeTab']]) 

  const remValue = useRemValue();

  const contentProps = useSpring({
    marginLeft: showMe ? 0 : -18 * remValue,
  });

  /* ** MAIN RENDER ************************************************************************** */

  // build content of the menu
  const menuContent = (
    <>
      <animated.div className={ownStyles.content} style={contentProps}>
        <Container className="h-100" ref={divRef}>
          <Row>
            <Col>
              <h1>{consFixed['region'].systemInformation.name}</h1>
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
              defaultActiveKey={ varsStateLib.getMainMenuControlActiveTab(varsState) }
              activeKey={ varsStateLib.getMainMenuControlActiveTab(varsState) }
              onSelect={(selectedTab) => {
                varsStateLib.setMainMenuControlActiveTab(selectedTab, varsState);
                setVarState(Math.random())
              }}
            >
              <Tab eventKey="tabOverview" title="Overview">
                <p>
                  <span className="popuptitle">About</span>
                </p>
                <span className="popuptext">
                  <p>Here comes some information about the app.</p>
                </span>
              </Tab>

              <Tab eventKey="tabFilters" title="Filters">
                <TabFilters
                  filtersData={consFixed['filters']}
                  locationsData={consFixed['locations']}
                  thresholdValueSets={consFixed['thresholdValueSets']}
                  thresholdGroups={consFixed['thresholdGroup']}
                  settings={settings}
                />
              </Tab>

              <Tab eventKey='tabActiveFeatureInfo' title='Info'>
                <TabActiveFeatureInfo
                  settings={settings}
                  // filtersData={consFixed['filters']}
                  // overviewFilter={settings.overviewFilter}
                />
              </Tab>

            </Tabs>
          </Row>
        </Container>
      </animated.div>
      <div
        className={ownStyles.buttonSlide}
        onClick={() => {
          varsStateLib.toggleMainMenuControl(varsState)
          setShowMe(varsStateLib.getMainMenuControlShow(varsState))
        }}
      >
        {varsStateLib.getMainMenuControlShow(varsState) ? '◀' : '▶'}
      </div>
    </>
  );

  // containing div th
  return (
    <div
      className={`${ownStyles.mainContainer} leaflet-control leaflet-bar ${position}`}
    >
      {menuContent}
    </div>
  );
};

export default MainMenuControl
