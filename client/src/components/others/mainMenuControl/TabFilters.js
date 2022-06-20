import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { cloneDeep } from 'lodash';

// import custom components
import IconsAlertsSubform from './IconsAlertsSubform'
import IconsModelEvaluationSubform from './IconsModelEvaluationSubform'
import IconsModelsComparisonSubform from './IconsModelsComparisonSubform'
import IconsModelsCompetitionSubform from './IconsModelsCompetitionSubform'
import IconsUniformSubform from './IconsUniformSubform'
import IconsViewSelectBox from './IconsViewSelectBox'
import { SubFilterSelectBox } from './SubFilterSelectBox'

// import recoil to replace contexts
import { useRecoilState } from "recoil";

// import atms
import { atVarStateContext, atVarStateDomTimeSeriesData } from '../../atoms/atsVarState'
import atsVarStateLib from '../../atoms/atsVarStateLib'

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'


// ** AUX FUNCS ********************************************************************************

// Function that identifies unique geo units and events
// Returns two dictionaries (geo list, evt list) with {id: label} each
const identifyGeoEvents = (filtersData, curFilterGeoId, curFilterEvtId) => {

  // first identify unique events and geo filters into dictionaries {id: name}
  // only considers the ones in which the current event OR the current geo is part of it
  const [evtDict, geoDict] = [{}, {}]
  for (const curFilter of filtersData) {
    const curFilterIdSplit = curFilter.id.split('.')
    const curFilterNameSplit = curFilter.description.split('@')
    if ((curFilterIdSplit.length !== 2) || (curFilterNameSplit.length !== 2)) {
      console.warn('Cannot parse filter "' + curFilter.id + '":' + curFilter.description + '.')
      continue
    }
    const [curEvtId, curGeoId] = curFilterIdSplit
    const [curEvtName, curGeoName] = curFilterNameSplit

    // check if at least one of the selected filters is contemplated
    if ((curFilterEvtId !== curEvtId) && (curFilterGeoId !== curGeoId)) { continue }

    // add to the dictionaries
    evtDict[curEvtId] = curEvtName
    geoDict[curGeoId] = curGeoName
  }

  // then convert the dictionaries into lists of [id, name] elements
  const [evtList, geoList] = [[], []]
  for (const [k, v] of Object.entries(geoDict)) { geoList.push([k, v]) }
  for (const [k, v] of Object.entries(evtDict)) { evtList.push([k, v]) }

  return { geo: geoList, events: evtList }
}


export const TabFilters = ({ filtersData, settings }) => {
  // ** SET HOOKS ******************************************************************************

  // Get global states and set local states
  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
  const [atomVarStateDomTimeSeriesData, setAtVarStateDomTimeSeriesData] =
    useRecoilState(atVarStateDomTimeSeriesData)

  // ** DEFS ***********************************************************************************

  // Triggered when the subregion selectbox is changed
  const changeGeoSubFilter = (event) => {
    // get atoms
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    const atmVarStateDomTimeSeriesData = cloneDeep(atomVarStateDomTimeSeriesData)
    const curFilterId = atsVarStateLib.getContextFilterId(atomVarStateContext)

    // merge new event with current geo
    const newGeoFilterId = event.target.value
    const curEvtFilterId = curFilterId.split('.')[0]
    const newFilterId = curEvtFilterId.concat('.').concat(newGeoFilterId)

    // save state
    atsVarStateLib.setContextFilterId(newFilterId, atmVarStateContext,
      atmVarStateDomTimeSeriesData)
    setAtVarStateContext(atmVarStateContext)
    setAtVarStateDomTimeSeriesData(atmVarStateDomTimeSeriesData)
  }

  // Triggered when the event selectbox is changed
  const changeEventSubFilter = (event) => {
    // get atoms
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    const atmVarStateDomTimeSeriesData = cloneDeep(atomVarStateDomTimeSeriesData)
    
    // merge new event with current geo
    const curFilterId = atsVarStateLib.getContextFilterId(atomVarStateContext)
    const curGeoFilterId = curFilterId.split('.')[1]
    const newEvtFilterId = event.target.value
    const newFilterId = newEvtFilterId.concat('.').concat(curGeoFilterId)
    
    // save state
    atsVarStateLib.setContextFilterId(newFilterId, atmVarStateContext,
      atmVarStateDomTimeSeriesData)
    setAtVarStateContext(atmVarStateContext)
    setAtVarStateDomTimeSeriesData(atmVarStateDomTimeSeriesData)
  }

  const updateIconType = (event) => {
    // Triggered when the icon type select box is changed
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    const newIconView = event.target.value
    atsVarStateLib.setContextIcons(newIconView, {}, atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }

  // ** MAIN RENDER ****************************************************************************

  // gather info
  const curFilterGeoId = atsVarStateLib.getContextFilterGeoId(atomVarStateContext)
  const curFilterEvtId = atsVarStateLib.getContextFilterEvtId(atomVarStateContext)
  const { geo: retGeo, events: retEvt } = identifyGeoEvents(filtersData, curFilterGeoId,
    curFilterEvtId)

  return (
    <Form>
      <Container className='p-0'>
        <Row><Col>
          <SubFilterSelectBox
            idTitleList={retGeo}
            selectedId={curFilterGeoId}
            onChangeFunction={changeGeoSubFilter}
            label='Sub-Area'
          />
        </Col></Row>
        <Row className={ownStyles['row-padding-top']}><Col>
          <SubFilterSelectBox
            idTitleList={retEvt}
            selectedId={curFilterEvtId}
            onChangeFunction={changeEventSubFilter}
            label='Event'
          />
        </Col></Row>
        <Row className={ownStyles['row-padding-top']}><Col>
          {/* TODO: move default icon view to settings file */}
          <IconsViewSelectBox 
            onChange={updateIconType}
            label="Location icons"
          />
        </Col></Row>
        <Row className={ownStyles['row-padding-top']}><Col>
          <IconsUniformSubform settings={settings} />
        </Col></Row>
        <Row className={ownStyles['row-padding-top']}><Col>
          <IconsAlertsSubform settings={settings} />
        </Col></Row>
        <IconsModelEvaluationSubform settings={settings} />
        <Row className={ownStyles['row-padding-top']}><Col>
          <IconsModelsComparisonSubform settings={settings} />
        </Col></Row>
        <Row className={ownStyles['row-padding-top']}><Col>
          <IconsModelsCompetitionSubform settings={settings} />
        </Col></Row>
      </Container>
    </Form>
  )
}
