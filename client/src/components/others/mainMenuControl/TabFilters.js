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

const identifyGeoEvents = (filtersData) => {
  // Function that identifies unique geo units and events
  // Returns two dictionaries (geo list, evt list) with {id: label} each

  // first identify unique events and geo filters into dictionaries
  const [evtDict, geoDict] = [{}, {}]
  for (const curFilter of filtersData) {
    const curFilterIdSplit = curFilter.id.split('.')
    const curFilterNameSplit = curFilter.description.split('@')
    if ((curFilterIdSplit.length !== 2) || (curFilterNameSplit.length !== 2)) {
      console.log('Cannot parse filter "' + curFilter.id + '":' + curFilter.description + '.')
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

const isLocationAttribute = (valueFunction) => {
  const firstLetter = valueFunction.charAt(0)
  const lastLetter = valueFunction.charAt(valueFunction.length - 1)
  return ((firstLetter === '@') && (lastLetter == '@'))
}

const getByIdFromList = (list, id) => {
  for (const idx in list) {
    if (list[idx].id === id) { return (list[idx]) }
  }
  return (null)
}

const getByFilterIdFromDict = (dict, filterId) => {
  for (const idx of Object.keys(dict)) {
    if (dict[idx].filterId === filterId) { return (dict[idx]) }
  }
  return (null)
}


export const TabFilters = ({ filtersData, locationsData, thresholdValueSets, thresholdGroups,
  settings}) => {
  // ** SET HOOKS ******************************************************************************

  // Get global states and set local states
  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
  const [atomVarStateDomTimeSeriesData, setAtVarStateDomTimeSeriesData] = useRecoilState(atVarStateDomTimeSeriesData)

  // ** DEFS ***********************************************************************************

  const changeGeoSubFilter = (event) => {
    // Triggered when the subregion selectbox is changed
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    const atmVarStateDomTimeSeriesData = cloneDeep(atomVarStateDomTimeSeriesData)
    const curFilterId = atsVarStateLib.getContextFilterId(atomVarStateContext)
    console.log('Changed geo subfilter to:', event.target.value)
    const newGeoFilterId = event.target.value
    const curEvtFilterId = curFilterId.split('.')[0]
    const newFilterId = curEvtFilterId.concat('.').concat(newGeoFilterId)
    console.log(' Setting:', newFilterId)
    atsVarStateLib.setContextFilterId(newFilterId, atmVarStateContext, atmVarStateDomTimeSeriesData)
    setAtVarStateContext(atmVarStateContext)
    setAtVarStateDomTimeSeriesData(atmVarStateDomTimeSeriesData)
  }

  const changeEventSubFilter = (event) => {
    // Triggered when the event selectbox is changed
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    const atmVarStateDomTimeSeriesData = cloneDeep(atomVarStateDomTimeSeriesData)
    const curFilterId = atsVarStateLib.getContextFilterId(atomVarStateContext)
    console.log('Changed event subfilter to:', event.target.value)
    const curGeoFilterId = curFilterId.split('.')[1]
    const newEvtFilterId = event.target.value
    const newFilterId = newEvtFilterId.concat('.').concat(curGeoFilterId)
    console.log(' Setting:', newFilterId, 'to', JSON.stringify(atmVarStateContext))
    atsVarStateLib.setContextFilterId(newFilterId, atmVarStateContext, atmVarStateDomTimeSeriesData)
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

  const { geo: retGeo, events: retEvt } = identifyGeoEvents(filtersData)
  return (
    <Form>
      <Container className='p-0'>
        <Row>
          <Col>
            <SubFilterSelectBox
              idTitleList={retGeo}
              selectedId={atsVarStateLib.getContextFilterGeoId(atomVarStateContext)}
              onChangeFunction={changeGeoSubFilter}
              label='Sub-Area'
            />
          </Col>
        </Row>
        <Row className={ownStyles['row-padding-top']}><Col>
          <SubFilterSelectBox
            idTitleList={retEvt}
            selectedId={atsVarStateLib.getContextFilterEvtId(atomVarStateContext)}
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
