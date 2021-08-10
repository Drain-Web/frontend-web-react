import React, { useContext } from 'react'
import {
  Form, Container, Row, Col
} from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import ownStyles from '../style/MainMenuControl.module.css'
import FilterContext from './FilterContext'
import MapLocationsContext from './MapLocationsContext'

/* Map menu that allows selection of filters and more.
 */

/* ** CONSTANTS ******************************************************************************** */

class Constants {
  static get lang () {
    return 'en'
  }

  static get overviewId () {
    return 'overview'
  }

  static get overviewTitle () {
    return {
      en: 'Overview'
    }[Constants.lang]
  }
}

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

const SubFilterSelectBox = ({ idTitleList, onChangeFunction, selectedId, addOverviewOption, label }) => {
  // Select box for the subfilters of area and event
  // idTitleList: Array of [option_id, option_title] pairs
  // onChangeFunction: function to be triggered when select box is changed
  // selectedId:

  const innerIdTitleList = addOverviewOption
    ? [[Constants.overviewId, Constants.overviewTitle]].concat(idTitleList)
    : idTitleList

  return (
    <FloatingLabel label={label}>
      <Form.Control
        as='select'
        defaultValue={selectedId}
        onChange={onChangeFunction}
        className='rounded-0 shadow'
        label={label}
      >
        {
          innerIdTitleList.map(
            ([geoId, geoTitle]) => (
              <option value={geoId} key={geoId}>{geoTitle}</option>
            )
          )
        }
      </Form.Control>
    </FloatingLabel>
  )
}

const ParametersSelectBox = ({ mapLocationsContextData }) => {
  const parametersDict = mapLocationsContextData.byParameter
  if ((!parametersDict) || (!Object.keys(parametersDict).length)) {
    return null
  }

  return (
    <>
      <span>Parameters:</span>
      <Form.Control as='select' multiple>
        {
          Object.entries(parametersDict).map(
            ([key, value]) => (
              <option key={key}>
                {key}&nbsp;
                ({parametersDict[key].length}&nbsp;
                {parametersDict[key].length === 1 ? 'location' : 'locations'})
              </option>
            )
          )
        }
      </Form.Control>
    </>
  )
}

/* ** OBJ - Bootstrap div ********************************************************************** */

export const MainMenuControl = ({ regionName, filtersData }) => {
  /* ** SET HOOKS ****************************************************************************** */

  // identifies all geo and event filters
  const { geo: retGeo, events: retEvt } = identifyGeoEvents(filtersData)

  // retireves context data
  const { filterContextData, setFilterContextData } = useContext(FilterContext)
  const { mapLocationsContextData } = useContext(MapLocationsContext)

  /* ** DEFS ** */

  const functionOnChangeGeoSubFilter = (event) => {
    // Triggered when the subregion selectbox is changed
    const newGeoFilterId = event.target.value
    const newFilterId = filterContextData.evtFilterId.concat('.').concat(newGeoFilterId)
    setFilterContextData({
      ...filterContextData, filterId: newFilterId, geoFilterId: newGeoFilterId
    })
  }

  const functionOnChangeEventSubFilter = (event) => {
    // Triggered when the event selectbox is changed
    const newEvtFilterId = event.target.value
    const newFilterId = newEvtFilterId.concat('.').concat(filterContextData.geoFilterId)
    setFilterContextData({
      ...filterContextData, filterId: newFilterId, evtFilterId: newEvtFilterId
    })
  }

  /* ** TEMP CONSTANTS ************************************************************************* */

  const addOverviewOption = true

  /* ** MAIN RENDER  *************************************************************************** */

  // build content of the menu
  const menuContent = (
    <Form>
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
            <SubFilterSelectBox
              idTitleList={retGeo} selectedId={filterContextData.geoFilterId}
              onChangeFunction={(changeGeoFilterEvt) => {
                functionOnChangeGeoSubFilter(changeGeoFilterEvt)
              }}
              addOverviewOption={addOverviewOption}
              label='Sub-Area'
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SubFilterSelectBox
              idTitleList={retEvt} selectedId={filterContextData.evtFilterId}
              onChangeFunction={(changeEvtFilterEvt) => {
                functionOnChangeEventSubFilter(changeEvtFilterEvt)
              }}
              addOverviewOption={addOverviewOption}
              label='Event'
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <ParametersSelectBox mapLocationsContextData={mapLocationsContextData} />
          </Col>
        </Row>
      </Container>
    </Form>
  )

  // containing div th
  return (
    <div className={'leaflet-control leaflet-bar '.concat(ownStyles.mainContainer)}>
      {menuContent}
    </div>
  )
}
