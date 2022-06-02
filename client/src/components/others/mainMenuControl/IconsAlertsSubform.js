import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row, FloatingLabel } from 'react-bootstrap'
import { apiUrl } from '../../../libs/api.js'
import axios from 'axios'
import { cloneDeep } from 'lodash';

// import recoil to replace contexts
import { useRecoilState, useRecoilValue } from "recoil";

// import contexts
import ConsCache from "../../contexts/ConsCache";
import consCacheLib from "../../contexts/consCacheLib";
import ConsFixed from "../../contexts/ConsFixed";
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext, atVarStateDomMainMenuControl, atVarStateLocations,
  atVarStateDomMapLegend } from "../../atoms/atsVarState";

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

// same as 'fetcher', but includes extra info in response
async function fetcherMultiargs (args) {
  const jsonData = await fetcher(args.url)
  return new Promise((resolve, reject) => { resolve([jsonData, args]) })
}


const IconsAlertsSubform = ( { settings } ) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  const { varsState, setVarState } = useContext(VarsState)
  
  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
  const atomVarStateDomMainMenuControl = useRecoilValue(atVarStateDomMainMenuControl)
  const atomVarStateLocations = useRecoilValue(atVarStateLocations)
  const atomVarStateDomMapLegend = useRecoilValue(atVarStateDomMapLegend)

  // TODO: consider using the atoms directly
  const [selectedThresholdGroup, setSelectedThresholdGroup] =
    useState(varsStateLib.getContextIconsArgs('alerts', varsState).thresholdGroupId)
  const [selectedModuleInstanceId, setSelectedModuleInstanceId] =
    useState(varsStateLib.getContextIconsArgs('alerts', varsState).moduleInstanceId)

  const atmVarStateContext = cloneDeep(atomVarStateContext)

  // TODO: move to VarsStateManager
  // react on change
  useEffect(() => {
    // only triggers when "evaluation" is selected and the selected metric is not null
    // if (varsStateLib.getContextIconsType(varsState) !== 'alerts') { return (null) }
    if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== 'alerts') { return (null) }

    const selectedThresholdGroupX = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).thresholdGroupId
    const selectedModuleInstanceIdX = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).moduleInstanceId
    
    if (!selectedThresholdGroup)   { return (null) }
    if (!selectedModuleInstanceId) { return (null) }

    // 1. get URL for retrieving timeseries
    const urlTimeseriesRequest = apiUrl(
      settings.apiBaseUrl,
      "v1",
      "timeseries",
      {
        filter: atsVarStateLib.getContextFilterId(atomVarStateContext),
        showStatistics: true,
        onlyHeaders: true
      }
    );

    // 2. define callback function that updates the icons
    const callbackFunc = (urlRequested) => {
      atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atomVarStateLocations,
                                         atomVarStateContext, atomVarStateDomMapLegend,
                                         consCache, consFixed, settings)
      // TODO - set updates
    }
    
    // 3. call URL and then callback, or callback directly
    if (consCacheLib.wasUrlRequested(urlTimeseriesRequest, consCache)) {
      callbackFunc(urlTimeseriesRequest)
    } else {
      const extraArgs = {
        url: urlTimeseriesRequest,
        filterId: varsStateLib.getContextFilterId(varsState)
      }
      varsStateLib.setUniformIcon(settings.loadingLocationIcon, varsState)
      fetcherMultiargs(extraArgs).then(([jsonData, extras]) => {
        consCacheLib.addUrlRequested(extras.url, consCache)
        jsonData.map((curTimeseries) => {
          consCacheLib.associateTimeseriesIdAndFilterId(curTimeseries.id, extras.filterId, consCache)
          consCacheLib.storeTimeseriesData(curTimeseries, consCache, consFixed)
          return null
        })
        callbackFunc(extras.url)
      })
      setVarState(Math.random())
    }

  }, [atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext),
      atsVarStateLib.getContextFilterId(atomVarStateContext),
      atsVarStateLib.getContextIconsType(atomVarStateContext),
      selectedThresholdGroup, selectedModuleInstanceId])

  // ** BUILD COMPONENT ************************************************************************

  // 
  if (atsVarStateLib.getContextIconsType(atomVarStateContext) != "alerts") { return (null) }
  // if (varsStateLib.getContextIconsType(varsState) != "alerts") { return (null) }

  //
  const changeSelectedThresholdGroup = (selectedItem) => {
    atsVarStateLib.setContextIcons('alerts', { thresholdGroupId: selectedItem.target.value },
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
    setSelectedThresholdGroup(selectedItem.target.value)
  }

  // 
  const changeSelectedModuleInstanceId = (selectedItem) => {
    atsVarStateLib.setContextIcons('alerts', { moduleInstanceId: selectedItem.target.value },
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
    setSelectedModuleInstanceId(selectedItem.target.value)
  }

  // build options for warnings / thresholdGroup
  const thresholdGroupOptions = []
  for (const [curId, curThreshGroup] of Object.entries(consFixed.thresholdGroup)) {
    thresholdGroupOptions.push(<option value={curId} key={curId}>{curThreshGroup.name}</option>)
  }

  /*
  // if no thresholdGroup selected, select one
  if (!selectedThresholdGroup) {
    const thresholdGroup = Object.keys(consFixed.thresholdGroup)[0]
    console.log("Will set A...")
    atsVarStateLib.setContextIcons('alerts', { thresholdGroupId: thresholdGroup }, atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
    setSelectedThresholdGroup(thresholdGroup)
    console.log(" ...set A.")
    return <></>
  }
  */
  if (!selectedThresholdGroup) {
    return(<></>)
  }

  // build options for module instance ids
  const moduleInstancesIds = consCacheLib.getModuleInstancesOfThreshouldGroup(selectedThresholdGroup, consCache)
  const moduleInstanceOptions = []
  for (const curModuleInstancesId of moduleInstancesIds) {
    moduleInstanceOptions.push(<option value={curModuleInstancesId} key={curModuleInstancesId}>
      {curModuleInstancesId}</option>)
  }

  /*
  // 
  if (!selectedModuleInstanceId) {
    const moduleInstanceInstanceId = Array.from(moduleInstancesIds)[0]
    console.log("Will set B...")
    atsVarStateLib.setContextIcons('alerts', { moduleInstanceId: moduleInstanceInstanceId }, atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
    setSelectedModuleInstanceId(moduleInstanceInstanceId)
    console.log(" ...set B.")
    return <></>
  }
  */
  if (!selectedModuleInstanceId) {
    return(<></>)
  }
  
  return (
    <>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
          <FloatingLabel label='Warning'>
            <Form.Control
              as='select'
              onChange={changeSelectedThresholdGroup}
              defaultValue={selectedThresholdGroup}
              className='rounded-1'
              label='Metric'
            >
              {thresholdGroupOptions}
            </Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
          <FloatingLabel label='Module Instance Id'>
            <Form.Control
              as='select'
              onChange={changeSelectedModuleInstanceId}
              defaultValue={selectedModuleInstanceId}
              className='rounded-1'
              label='Module Instance Id'
            >
              {moduleInstanceOptions}
            </Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
    </>
  )
}

export default IconsAlertsSubform
