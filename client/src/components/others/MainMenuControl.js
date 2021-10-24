import React, { useContext, useEffect, useRef, useState } from "react";
import { DomEvent } from "leaflet";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import useRemValue from "use-rem-value";

// import custom components
import FilterContext from "../contexts/FilterContext";
import MapContext from "../contexts/MapContext";
import { TabFilters } from "./mainMenuControl/TabFilters";
import { TabActiveFeatureInfo } from "./mainMenuControl/TabActiveFeatureInfo";
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

// import CSS styles
import ownStyles from "../../style/MainMenuControl.module.css";

/*
 * Map menu that allows selection of filters and more.
 */

/* ** OBJ - Bootstrap div ******************************************************************** */

export const MainMenuControl = ({
  settings,
  consFixed,
  position
}) => {
  /* ** SET HOOKS **************************************************************************** */

  // Retireves context data
  // TODO: move to varsState
  const { filterContextData, setFilterContextData } = useContext(FilterContext);
  const { activeTab, setActiveTab } = useContext(MapContext);

  // Get global states and set local states
  const { varsState, setVarsState } = useContext(VarsState)
  const [showMe, setShowMe] = useState(varsStateLib.getMainMenuControlShow(varsState))
  
  const divRef = useRef(null);

  useEffect(() => {
    DomEvent.disableClickPropagation(divRef.current);
  });

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
              defaultActiveKey={
                filterContextData.inOverview ? "tabOverview" : "tabFilters"
              }
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
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
                  overviewFilter={settings.overviewFilter}
                />
              </Tab>

              <Tab eventKey="tabActiveFeatureInfo" title="Info">
                <TabActiveFeatureInfo
                  filtersData={consFixed['filters']}
                  overviewFilter={settings.overviewFilter}
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
          setVarsState(varsState)
          setShowMe(varsStateLib.getMainMenuControlShow(varsState))
        }}
      >
        {varsState['domObjects']['mainMenuControl']['show'] ? "◀" : "▶"}
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
