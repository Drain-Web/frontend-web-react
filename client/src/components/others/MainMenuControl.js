import React, { useContext, useEffect, useRef } from 'react'
import { DomEvent } from 'leaflet'
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap'
import { useSpring, animated } from 'react-spring'
import useRemValue from 'use-rem-value'
import ownStyles from '../../style/MainMenuControl.module.css'
import FilterContext from '../contexts/FilterContext'
import { TabFilters } from './mainMenuControl/TabFilters.js'

/* Map menu that allows selection of filters and more.
 */

/* ** OBJ - Bootstrap div ********************************************************************** */

export const MainMenuControl = ({
  regionName, filtersData, overviewFilter, showMainMenuControl, setShowMainMenuControl, position
}) => {
  /* ** SET HOOKS ****************************************************************************** */

  // retireves context data
  const { filterContextData, setFilterContextData } = useContext(FilterContext)

  const divRef = useRef(null)

  useEffect(() => {
    DomEvent.disableClickPropagation(divRef.current)
  })

  const remValue = useRemValue()

  const contentProps = useSpring({
    marginLeft: showMainMenuControl ? 0 : -18 * remValue
    // width: showMainMenuControl ? 18 :
  })

  /* ** DEFS *********************************************************************************** */

  const functionOnChangeTab = (newTabId) => {
    // Triggered when a tab Overview/Filter is chaned
    setFilterContextData({
      ...filterContextData, inOverview: (newTabId === 'tabOverview')
    })
  }

  /* ** MAIN RENDER **************************************************************************** */

  // build content of the menu
  const menuContent = (
    <>
      <animated.div className={ownStyles.content} style={contentProps}>
        <Container className='h-100' ref={divRef}>
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
              className='mb-2'
              defaultActiveKey={(filterContextData.inOverview ? 'tabOverview' : 'tabFilters')}
              onSelect={functionOnChangeTab}
            >
              <Tab eventKey='tabOverview' title='Overview'>
                <p><strong>About</strong></p>
                <p>Here comes some information about the app.</p>
              </Tab>
              <Tab eventKey='tabFilters' title='Filters'>
                <TabFilters
                  filtersData={filtersData}
                  overviewFilter={overviewFilter}
                />
              </Tab>
            </Tabs>
          </Row>
        </Container>
      </animated.div>
      <div className={ownStyles.buttonSlide} onClick={() => { setShowMainMenuControl(!showMainMenuControl) }}>
        {showMainMenuControl ? '◀' : '▶'}
      </div>
    </>
  )

  // containing div th
  return (
    <div className={`${ownStyles.mainContainer} leaflet-control leaflet-bar ${position}`}>
      {menuContent}
    </div>
  )
}
