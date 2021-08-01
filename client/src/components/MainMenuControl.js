import React, { useState, useContext } from 'react'
import {
  Form, Container, Row, Col
} from 'react-bootstrap'
import ownStyles from '../style/MainMenuControl.module.css'
import FilterContext from './FilterContext'

/* Map menu that allows selection of filters and more.
 */

/* ** AUX ************************************************************************************** */

const identifyGeoEvents = (filtersData) => {
  // Function that identifies unique geo units and events
  // Returns two dictionaries (geo list, evt list) with {id: label} each

  // first identify unique events and geo filters into dictionaries
  const [evtDict, geoDict] = [{}, {}]
  for (const curFilter of filtersData) {
    const curFilterIdSplit = curFilter.id.split('.')
    const curFilterNameSplit = curFilter.description.split('@')
    if ((curFilterIdSplit.length !== 2) || (curFilterNameSplit.length !== 2)) {
      console.log('Unable to parse filter "' + curFilter.id + '":"' + curFilter.description + '".')
      continue
    }
    const [curEvtId, curGeoId] = curFilterIdSplit
    const [curEvtName, curGeoName] = curFilterNameSplit
    evtDict[curEvtId] = curEvtName
    geoDict[curGeoId] = curGeoName
  }

  // then convert the dictionaries into lists of [id, name] elements
  const [evtList, geoList] = [[], []]
  for (const [k, v] of Object.entries(geoDict)) {
    geoList.push([k, v])
  }
  for (const [k, v] of Object.entries(evtDict)) {
    evtList.push([k, v])
  }

  return { geo: geoList, events: evtList }
}

const getSubFilterSelectBox = (id, label, idTitleList, onChangeFunction) => {
  //
  // idTitleList: Array of [option_id, option_title] pairs
  // onChangeFunction: function to be triggered when select box is changed

  return (
    <div>
      <Form>
        <Form.Control as='select' onChange={onChangeFunction} className='rounded-0 shadow'>
          {
            idTitleList.map(
              ([geoId, geoTitle]) => (
                <option value={geoId} key={geoId}>
                  {geoTitle}
                </option>
              )
            )
          }
        </Form.Control>
      </Form>
    </div>
  )
}

/* ** OBJ - Bootstrap div ********************************************************************** */

export const MainMenuControl = ({ regionName, filtersData }) => {
  // defaultFilter: A dictionary as {geoFilterId: "abc", evtFilterId: "def", filterId: "abc.def", filterTitle: "ABCing @ DEFet"}

  const [, setActiveFilter] = useState() // tweak to force the page rendering (TODO: replace)
  const filterContextData = useContext(FilterContext)

  // identifies all geo and event filters
  const { geo: retGeo, events: retEvt } = identifyGeoEvents(filtersData)

  /* ** DEFS ** */

  const functionOnChangeGeoFilter = (event) => {
    // Triggered when the subregion selectbox is changed
    const newGeoFilterId = event.target.value
    const newFilterId = filterContextData.evtFilterId.concat('.').concat(newGeoFilterId)
    setActiveFilter(newFilterId) // tweak to force the page rendering (TODO: replace)
    filterContextData.filterId = newFilterId
    filterContextData.geoFilterId = newGeoFilterId
  }

  const functionOnChangeEventSubFilter = (event) => {
    // Triggered when the event selectbox is changed
    const newEvtFilterId = event.target.value
    const newFilterId = newEvtFilterId.concat('.').concat(filterContextData.geoFilterId)
    setActiveFilter(newFilterId) // tweak to force the page rendering (TODO: replace)
    filterContextData.filterId = newFilterId
    filterContextData.evtFilterId = newEvtFilterId
  }

  /* ** MAIN ** */

  // build content of the menu
  const menuContent = (
    <Container>
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
        <Col>
          {getSubFilterSelectBox('dropdown-geofilter', 'Sub Region', retGeo,
            (changeGeoFilterEvt) => { functionOnChangeGeoFilter(changeGeoFilterEvt) })}
        </Col>
      </Row>
      <Row>
        <Col>
          {getSubFilterSelectBox('selectbox-evtfilter', 'Event', retEvt,
            (changeEvtFilterEvt) => { functionOnChangeEventSubFilter(changeEvtFilterEvt) })}
        </Col>
      </Row>
      {/*
      <Row>
        <Col>
          Name: {activeFilter.filterTitle}
        </Col>
      </Row>
      */}
      <Row>
        <Col>
          FilterId: {filterContextData.filterId}
        </Col>
      </Row>
    </Container>
  )

  // containing div th
  return (
    <div className={'leaflet-control leaflet-bar '.concat(ownStyles.mainContainer)}>{menuContent}</div>
  )
}
