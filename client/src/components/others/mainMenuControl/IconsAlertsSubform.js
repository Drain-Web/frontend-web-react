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

  // get contexts
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  
  // get atoms
  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
  const atomVarStateDomMainMenuControl = useRecoilValue(atVarStateDomMainMenuControl)
  const [atomVarStateLocations, setAtVarStateLocations] = useRecoilState(atVarStateLocations)
  const [atomVarStateDomMapLegend, setAtVarStateDomMapLegend] = useRecoilState(atVarStateDomMapLegend)

  const atmVarStateContext = cloneDeep(atomVarStateContext)

  // TODO: move to VarsStateManager
  // react on change
  useEffect(() => {
    // only triggers when "evaluation" is selected and the selected metric is not null
    if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== 'alerts') { return (null) }

    const selectedThresholdGroupX = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).thresholdGroupId
    const selectedModuleInstanceIdX = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).moduleInstanceId
    
    if (!selectedThresholdGroupX)   { return (null) }
    if (!selectedModuleInstanceIdX) { return (null) }

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
      const atmVarStateLocations = cloneDeep(atomVarStateLocations)
      const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
      atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
                                         atomVarStateContext, atmVarStateDomMapLegend,
                                         consCache, consFixed, settings)
      setAtVarStateLocations(atmVarStateLocations)
      setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
    }
    
    // 3. call URL and then callback, or callback directly
    if (consCacheLib.wasUrlRequested(urlTimeseriesRequest, consCache)) {
      callbackFunc(urlTimeseriesRequest)
    } else {
      const extraArgs = {
        url: urlTimeseriesRequest,
        filterId: atsVarStateLib.getContextFilterId(atomVarStateContext)
      }
      const atmVarStateLocations = cloneDeep(atomVarStateLocations)
      atsVarStateLib.setUniformIcon(settings.loadingLocationIcon, atmVarStateLocations)
      fetcherMultiargs(extraArgs).then(([jsonData, extras]) => {
        consCacheLib.addUrlRequested(extras.url, consCache)
        jsonData.map((curTimeseries) => {
          consCacheLib.associateTimeseriesIdAndFilterId(curTimeseries.id, extras.filterId, consCache)
          consCacheLib.storeTimeseriesData(curTimeseries, consCache, consFixed)
          return null
        })
        callbackFunc(extras.url)
      })
      setAtVarStateLocations(atmVarStateLocations)
    }

  }, [atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext),
      atsVarStateLib.getContextFilterId(atomVarStateContext),
      atsVarStateLib.getContextIconsType(atomVarStateContext),
      atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).thresholdGroupId,
      atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).moduleInstanceId])

  // ** ON CLICK FUNCTIONS *********************************************************************

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

  // ** BUILD COMPONENT ************************************************************************

  // 
  if (atsVarStateLib.getContextIconsType(atomVarStateContext) != "alerts") {
    console.log("> Failed by Subform:", atsVarStateLib.getContextIconsType(atomVarStateContext))
    return (null)
  }

  // build options for warnings / thresholdGroup
  const thresholdGroupOptions = []
  for (const [curId, curThreshGroup] of Object.entries(consFixed.thresholdGroup)) {
    thresholdGroupOptions.push(<option value={curId} key={curId}>{curThreshGroup.name}</option>)
  }

  // if no thresholdGroup or moduleInstanceId selected, break it
  const contextIconsArgs = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext)
  console.log("HAS:", JSON.stringify(contextIconsArgs))
  if (!contextIconsArgs.thresholdGroupId ) {
    console.log("Hide by no selectedThresholdGroup even now.")
    return(<></>)
  }
  if (!contextIconsArgs.moduleInstanceId) {
    console.log("Hide by no selectedModuleInstanceId.")
    return(<></>)
  }

  // build options for module instance ids
  const selectedThresholdGroupId = atsVarStateLib.getContextIconsArgs('alerts',
                                                                      atomVarStateContext).thresholdGroupId
  const moduleInstancesIds = consCacheLib.getModuleInstancesOfThreshouldGroup(selectedThresholdGroupId, consCache)
  const moduleInstanceOptions = []
  for (const curModuleInstancesId of moduleInstancesIds) {
    moduleInstanceOptions.push(<option value={curModuleInstancesId} key={curModuleInstancesId}>
      {curModuleInstancesId}</option>)
  }
  
  return (
    <>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
          <FloatingLabel label='Warning'>
            <Form.Control
              as='select'
              onChange={changeSelectedThresholdGroup}
              defaultValue={atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).thresholdGroupId}
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
              defaultValue={atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).moduleInstanceId}
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
