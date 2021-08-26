import React, { useContext } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'

import MapLocationsContext from '../../contexts/MapLocationsContext'
import FilterContext from '../../contexts/FilterContext'

import { ParametersCheckBox } from './ParametersCheckBox'
import { SubFilterSelectBox } from './SubFilterSelectBox'

/* ** AUX FUNCS ******************************************************************************** */

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

export const TabFilters = ({ filtersData, overviewFilter }) => {
  /* ** SET HOOKS ****************************************************************************** */

  const { mapLocationsContextData, setMapLocationsContextData } = useContext(MapLocationsContext)
  const { filterContextData, setFilterContextData } = useContext(FilterContext)

  /* ** DEFS *********************************************************************************** */

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

  /* ** MAIN RENDER **************************************************************************** */

  const { geo: retGeo, events: retEvt } = identifyGeoEvents(filtersData)

  return (
    <Form>
      <Container>
        <Row>
          <Col>
            <SubFilterSelectBox
              idTitleList={retGeo}
              selectedId={filterContextData.geoFilterId}
              onChangeFunction={(changeGeoFilterEvt) => {
                functionOnChangeGeoSubFilter(changeGeoFilterEvt)
              }}
              addOverviewOption={overviewFilter}
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
              addOverviewOption={overviewFilter}
              label='Event'
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <MapLocationsContext.Provider
              value={{ mapLocationsContextData, setMapLocationsContextData }}
            >
              <ParametersCheckBox
                mapLocationsContextData={{ mapLocationsContextData, setMapLocationsContextData }}
              />
            </MapLocationsContext.Provider>
          </Col>
        </Row>
      </Container>
    </Form>
  )
}
