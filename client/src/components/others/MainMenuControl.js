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
// import OpenCloseButton from "./mainMenuControl/OpenCloseButton";

// import atoms
import atsVarStateLib from "../atoms/atsVarStateLib"
import { atVarStateContext, atVarStateDomMainMenuControl, atVarStateLocations } from
  "../atoms/atsVarState";

// import contexts
import ConsFixed from "../contexts/ConsFixed";
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

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
  const { varsState, setVarState } = useContext(VarsState);
  const [showMe, setShowMe] = useState(
    varsStateLib.getMainMenuControlShow(varsState)
  )

  const divRef = useRef(null);

  useEffect(() => {
    DomEvent.disableClickPropagation(divRef.current);
  })

  useEffect(() => {
    console.log('Should update. Now in:', varsState.domObjects.mainMenuControl.activeTab)
  }, [
    varsState.context,
    varsState.domObjects.mainMenuControl.activeTab
  ])

  const remValue = useRemValue()

  const contentProps = useSpring({
    marginLeft: showMe ? 1 : -18 * remValue
  })

  const OpenCloseButtonOnly = () => {

    const createCloseButton = () => {
      return (
        <CloseButton
            onClick={() => {
              varsStateLib.toggleMainMenuControl(varsState);
              setShowMe(varsStateLib.getMainMenuControlShow(varsState));
            }}
          />
      )
    }

    const createOpenButton = () => {
      return (
        <Button
          onClick={() => {
            varsStateLib.hidePanelTabs(varsState);
            setVarState(Math.random());
          }}
        >
          -
        </Button>)
    }

    if (varsStateLib.getMainMenuControlShow(varsState)) {
      return createCloseButton()
    } else {
      return createOpenButton()
    }
  }

  // ** FUNCTIONS ******************************************************************************

  const tabOnSelect = (selectedTab) => {
    // varsStateLib.setMainMenuControlActiveTab(selectedTab, varsState)
    console.log("Setting change...")
    const atmVarStateDomMainMenuControl = cloneDeep(atomVarStateDomMainMenuControl);
    atsVarStateLib.setMainMenuControlActiveTab(selectedTab, atmVarStateDomMainMenuControl)
    setAtVarStateDomMainMenuControl(atmVarStateDomMainMenuControl)
    console.log(" ...change set.")
  }

  // ** MAIN RENDER ****************************************************************************

  // activeKey1={varsStateLib.getMainMenuControlActiveTab(varsState)}

  // build content of the menu
  const menuContent = (
    <>
      <animated.div className={ownStyles.content} style={contentProps}>
        <Container className="h-100" ref={divRef}>
          <Row>
            <Col xs={10} md={10} lg={10} >
              <h1>{consFixed.region.systemInformation.name}</h1>
            </Col>
            <Col xs={2} md={2} lg={2} className="text-right" >
              <OpenCloseButtonOnly />
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
              activeKey={atsVarStateLib.getMainMenuControlActiveTab(atomVarStateDomMainMenuControl) }
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
                  <p>Here comes some information about the app.</p>
                </span>
              </Tab>

              <Tab eventKey="tabFilters" title="Filters">
                <TabFilters
                  filtersData={consFixed.filters}
                  locationsData={consFixed.locations}
                  thresholdValueSets={consFixed.thresholdValueSets}
                  thresholdGroups={consFixed.thresholdGroup}
                  settings={settings}
                />
              </Tab>

              <Tab eventKey="tabActiveFeatureInfo" title="Info">
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

      {/* 
      <div
        className={ownStyles.buttonSlide}
        onClick={() => {
          varsStateLib.toggleMainMenuControl(varsState);
          setShowMe(varsStateLib.getMainMenuControlShow(varsState));
        }}
      >
        {varsStateLib.getMainMenuControlShow(varsState) ? "◀" : "▶"}
      </div> */}
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

export default MainMenuControl;
