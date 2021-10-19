import React, { useContext, useEffect, useRef } from "react";
import { DomEvent } from "leaflet";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import useRemValue from "use-rem-value";
import ownStyles from "../../style/MainMenuControl.module.css";
import FilterContext from "../contexts/FilterContext";
import MapContext from "../contexts/MapContext";
import { TabFilters } from "./mainMenuControl/TabFilters";
import { TabActiveFeatureInfo } from "./mainMenuControl/TabActiveFeatureInfo";

/* Map menu that allows selection of filters and more.
 */

/* ** OBJ - Bootstrap div ******************************************************************** */

export const MainMenuControl = ({
  regionName,
  filtersData,
  locationsData,
  thresholdValueSets,
  thresholdGroups,
  overviewFilter,
  showMainMenuControl,
  setShowMainMenuControl,
  position,
}) => {
  /* ** SET HOOKS **************************************************************************** */

  // retireves context data
  const { filterContextData, setFilterContextData } = useContext(FilterContext);
  const { activeTab, setActiveTab } = useContext(MapContext);

  const divRef = useRef(null);

  useEffect(() => {
    DomEvent.disableClickPropagation(divRef.current);
  });

  const remValue = useRemValue();

  const contentProps = useSpring({
    marginLeft: showMainMenuControl ? 0 : -18 * remValue,
  });

  /* ** DEFS ********************************************************************************* */

  const functionOnChangeTab = (newTabId) => {
    // Triggered when a tab Overview/Filter is chaned
    setFilterContextData({
      ...filterContextData,
      inOverview: newTabId === "tabOverview",
    });
  };

  /* ** MAIN RENDER ************************************************************************** */

  // build content of the menu
  const menuContent = (
    <>
      <animated.div className={ownStyles.content} style={contentProps}>
        <Container className="h-100" ref={divRef}>
          <Row>
            <Col>
              <h1>{regionName}</h1>
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
              // onSelect={functionOnChangeTab}
              onSelect={(k) => setActiveTab(k)}
              // onChange={setActiveTab}
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
                  filtersData={filtersData}
                  locationsData={locationsData}
                  thresholdValueSets={thresholdValueSets}
                  thresholdGroups={thresholdGroups}
                  overviewFilter={overviewFilter}
                />
              </Tab>

              <Tab eventKey="tabActiveFeatureInfo" title="Info">
                <TabActiveFeatureInfo
                  filtersData={filtersData}
                  overviewFilter={overviewFilter}
                />
              </Tab>
            </Tabs>
          </Row>
        </Container>
      </animated.div>
      <div
        className={ownStyles.buttonSlide}
        onClick={() => {
          setShowMainMenuControl(!showMainMenuControl);
        }}
      >
        {showMainMenuControl ? "◀" : "▶"}
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
