import React from 'react'
import { Dropdown, DropdownButton, ButtonToolbar } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from "react-bootstrap/Col"
import '../style/MainMenuControl.css'

/* Map menu that allows selection of filters and more.
 */

// Dictionary to make the position argument more readable
// TODO - should it move to somewhere else?
const POSITION_CLASSES = {
  bottom_left: 'leaflet-bottom leaflet-left',
  bottom_right: 'leaflet-bottom leaflet-right',
  top_left: 'leaflet-top leaflet-left',
  top_right: 'leaflet-top leaflet-right'
}

const identifyGeoEvents = (filtersData) => {
  // Function that identifies unique geo units and events
  // Returns two dictionaries with {id: label}

  // first identify unique events and geo filters into dictionaries
  const [geoDict, evtDict] = [{}, {}]
  for (const curFilter of filtersData) {
    const curFilterIdSplit = curFilter.id.split('.')
    const curFilterNameSplit = curFilter.description.split('@')
    if ((curFilterIdSplit.length !== 2) || (curFilterNameSplit.length !== 2)) {
      console.log('Unable to parse filter "' + curFilter.id + '":"' + curFilter.description + '".')
      continue
    }
    const [curGeoId, curEvtId] = curFilterIdSplit
    const [curGeoName, curEvtName] = curFilterNameSplit
    geoDict[curGeoId] = curGeoName
    evtDict[curEvtId] = curEvtName
  }

  // then convert the dictionaries into lists of [id, name] elements
  const [geoList, evtList] = [[], []]
  for (const [k, v] of Object.entries(geoDict)) {
    geoList.push([k, v])
  }
  for (const [k, v] of Object.entries(evtDict)) {
    evtList.push([k, v])
  }

  return { geo: geoList, events: evtList }
}

const functionOnChangeSubregionSubFilter = (event) => {
  // Triggered when the subregion selectbox is changed
  console.log('Changed SubRegion to \'' + event.target.value + '\'.')
}

const functionOnChangeEventSubFilter = (event) => {
  // Triggered when the event selectbox is changed
  console.log('Changed Event to \'' + event.target.value + '\'.')
}

const getSubFilterSelectBox = (id, label, idTitleList, onChangeFunction) => {
  //
  // idTitleList: Array of [option_id, option_title] pairs
  // onChangeFunction: function to be triggered when select box is changed

  return (
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
  )
}

const MainMenuControl = ({ position, regionName, filtersData }) => {
  // positions: String with one of the keys of POSITION_CLASSES

  // identifies all geo and event filters
  const { geo: retGeo, events: retEvt } = identifyGeoEvents(filtersData)

  // build content of the menu
  const menuContent = (
    <Container className='mainContainer'>
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
          {getSubFilterSelectBox('dropdown-geofilter', 'Sub Region',
            retGeo, functionOnChangeSubregionSubFilter)}
        </Col>
      </Row>
      <Row>
        <Col>
          {getSubFilterSelectBox('selectbox-evtfilter', 'Event',
            retEvt, functionOnChangeEventSubFilter)}
        </Col>
      </Row>
    </Container>
  )

  // containing div th
  const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.top_right
  return (
    <div className={positionClass}>
      <div className='leaflet-control leaflet-bar'>{menuContent}</div>
    </div>
  )
}

export default MainMenuControl
