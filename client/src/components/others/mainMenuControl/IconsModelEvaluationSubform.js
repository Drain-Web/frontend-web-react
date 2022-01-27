import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { apiUrl } from '../../../libs/api.js'
import axios from 'axios'

// import contexts
import ConsFixed from '../../contexts/ConsFixed'
import ConsCache from '../../contexts/ConsCache'
import consCacheLib from '../../contexts/consCacheLib'
import VarsState from '../../contexts/VarsState'
import varsStateLib from '../../contexts/varsStateLib'

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

// same as 'fetcher', but includes extra info in response
async function fetcherWith (url, extra) {
  const jsonData = await fetcher(url)
  return new Promise((resolve, reject) => { resolve([jsonData, extra]) })
}

const getParameterGroupsOfMetric = (metricId, settings) => {
  const paramGroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
  return Object.keys(paramGroups)
}

const getSimObsParameterIds = (metricId, parameterGroupId, settings) => {
  // return two strings: the parameter ID of the simulations and the parameter id of the observations
  const pgroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
  return [pgroups[parameterGroupId].parameters.sim, pgroups[parameterGroupId].parameters.obs]
}

const IconsModelEvaluationSubform = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  const { varsState, setVarState } = useContext(VarsState)
  const [selectedMetric, setSelectedMetric] =
    useState(varsStateLib.getContextIconsArgs('evaluation', varsState).metric)
  const [selectedParameterGroup, setSelectedParameterGroup] =
    useState(varsStateLib.getContextIconsArgs('evaluation', varsState).parameterGroupId)
  const [simModuleInstanceId, setSimModuleInstanceId] = 
    useState(varsStateLib.getContextIconsArgs('evaluation', varsState).simulationModuleInstanceId)
  const [obsModuleInstanceId, setObsModuleInstanceId] = 
    useState(varsStateLib.getContextIconsArgs('evaluation', varsState).observationModuleInstanceId)
    
  // react on change
  useEffect(() => {
    // only triggers when "evaluation" is selected and the selected metric is not null
    if (varsStateLib.getContextIconsType(varsState) !== 'evaluation') { return (null) }
    if (!selectedMetric) { return (null) }
    if (!selectedParameterGroup) { return (null) }

    // get obs and mod parameter IDs from parameter group
    const [simParameterId, obsParameterId] = getSimObsParameterIds(selectedMetric,
      selectedParameterGroup, settings)

    // define url to be called and skip call if this was the last URL called
    console.log("Building URL for:", obsModuleInstanceId, simModuleInstanceId)
    const urlTimeseriesCalcRequest = apiUrl(
      settings.apiBaseUrl, 'v1dw', 'timeseries_calculator', {
        filter: varsStateLib.getContextFilterId(varsState),
        calc: selectedMetric,
        simParameterId: simParameterId,
        obsParameterId: obsParameterId,
        obsModuleInstanceId: obsModuleInstanceId,
        simModuleInstanceId: simModuleInstanceId
      }
    )

    // final response function: get data from consCache and update varsState
    const callbackFunc = (urlRequested) => {
      // const responseData = consCacheLib.getEvaluationResponseData(urlRequested, consCache)
      // console.log('FROM ConsCache, GOT', urlRequested)
      // console.log(' AS', responseData)
      varsStateLib.updateLocationIcons(varsState, consCache, consFixed, settings)
      setVarState(Math.random())
    }

    //
    if (consCacheLib.wasUrlRequested(urlTimeseriesCalcRequest, consCache)) {
      console.log('URL was already requested')
      callbackFunc(urlTimeseriesCalcRequest)
    } else {
      // request URL, update local states, update cache, access cache
      console.log('URL %s was not requested yet:', urlTimeseriesCalcRequest, consCache)
      const extraArgs = {
        url: urlTimeseriesCalcRequest
      }
      varsStateLib.setUniformIcon(settings.loadingLocationIcon, varsState)
      fetcherWith(urlTimeseriesCalcRequest, extraArgs).then(([jsonData, extras]) => {
        consCacheLib.addUrlRequested(extras.url, consCache)
        consCacheLib.storeEvaluationResponseData(extras.url, jsonData.evaluation, consCache)
        callbackFunc(extras.url)
      })
    }
    console.log("Hiding locations")
    varsStateLib.hideAllLocationIcons(varsState)
    setVarState(Math.random())
  }, [varsStateLib.getContextIconsType(varsState), varsStateLib.getContextFilterId(varsState),
      varsStateLib.getContextIconsArgs('evaluation', varsState),
      selectedMetric, selectedParameterGroup, simModuleInstanceId, obsModuleInstanceId])

  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) !== 'evaluation') { return (null) }

  // build reaction function
  const changeSelectedMetric = (selectedItem) => {
    varsStateLib.setContextIcons('evaluation', { metric: selectedItem.target.value }, varsState)
    setSelectedMetric(selectedItem.target.value)
  }

  // TODO: implement this one
  const changeSelectedParameterGroup = (selectedItem) => {
    // varsStateLib.setContextIcons('evaluation', { metric: selectedItem.target.value }, varsState)
    // setSelectedMetric(selectedItem.target.value)
  }

  const changeSelectedObsModuleInstanceId = (selectedItem) => {
    varsStateLib.setContextIcons('evaluation', { observationModuleInstanceId: selectedItem.target.value }, varsState)
    setObsModuleInstanceId(selectedItem.target.value)
  }
  
  const changeSelectedSimModuleInstanceId = (selectedItem) => {
    varsStateLib.setContextIcons('evaluation', { simulationModuleInstanceId: selectedItem.target.value }, varsState)
    setSimModuleInstanceId(selectedItem.target.value)
  }

  // build options for metrics
  const allMetricOptions = []
  const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
  allMetricOptions.push.apply(allMetricOptions, allEvaluationIds.map(
    (evaluationId) => {
      return (<option value={evaluationId} key={evaluationId}>{evaluationId}</option>)
    }
  ))

  // if no metric selected, select one
  if (!selectedMetric) {
    setSelectedMetric(allEvaluationIds[0])
    return <></>
  }

  // build options for parameter groups
  const allParameterGroupOptions = []
  const paramGroupIds = selectedMetric ? getParameterGroupsOfMetric(selectedMetric, settings) : []
  if (selectedMetric) {
    // identify parameter groups of selected metric
    allParameterGroupOptions.push.apply(allParameterGroupOptions, paramGroupIds.map(
      (paramGroupId) => {
        return (<option value={paramGroupId} key={paramGroupId}>{paramGroupId}</option>)
      }
    ))

    // if no parameter group selected, select one
    if ((!selectedParameterGroup) && (paramGroupIds.length > 0)) {
      setSelectedParameterGroup(paramGroupIds[0])
      return <></>
    }
  } else {
    allParameterGroupOptions.push(<option value={null} key={null}>Select a metric!</option>)
  }

  // build options for moduleInstanceIds
  let [simParameterId, obsParameterId] = [null, null]
  let [allSimModuleInstanceOptions, allObsModuleInstanceOptions] = [[], []]

  if (selectedMetric && selectedParameterGroup) {
    [simParameterId, obsParameterId] = getSimObsParameterIds(selectedMetric,
      selectedParameterGroup, settings)
    
    // get all module ids
    const allSimModInstIds = consCacheLib.getModuleInstancesWithParameter(simParameterId, consCache)
    const allObsModInstIds = consCacheLib.getModuleInstancesWithParameter(obsParameterId, consCache)
  
    // build simulation options
    for (const curSimulationModuleInstanceId of allSimModInstIds) {
      allSimModuleInstanceOptions.push(
        <option value={curSimulationModuleInstanceId} key={curSimulationModuleInstanceId}>
          {curSimulationModuleInstanceId}
        </option>
      )
    }

    // build observation module options
    for (const curObservationModuleInstanceId of allObsModInstIds) {
      allObsModuleInstanceOptions.push(
        <option value={curObservationModuleInstanceId} key={curObservationModuleInstanceId}>
          {curObservationModuleInstanceId}
        </option>
      )
    }

    // if no simulation module instance selected, select one
    if ((!simModuleInstanceId) && (allSimModInstIds.size > 0)) {
      setSimModuleInstanceId(allSimModInstIds.values().next().value)
      return <></>
    }

    // if no observation module instance selected, select one
    if ((!obsModuleInstanceId) && (allObsModInstIds.size > 0)) {
      setObsModuleInstanceId(allObsModInstIds.values().next().value)
      return <></>
    }
    
  } else {
    allSimModuleInstanceOptions.push(<option value={null} key={null}>Select a metric and a parameter group!</option>)
    allObsModuleInstanceOptions.push(<option value={null} key={null}>Select a metric and a parameter group!</option>)
  }

  return (
    <>
      <Row className={ownStyles['row-padding-top']}><Col>
        <FloatingLabel label='Metric'>
          <Form.Control
            as='select'
            onChange={changeSelectedMetric}
            defaultValue={selectedMetric}
            className='rounded-1'
            label='Metric'
          >
            {allMetricOptions}
          </Form.Control>
        </FloatingLabel>
      </Col></Row>
      <Row className={ownStyles['row-padding-top']}><Col>
        <FloatingLabel label='Parameter Group'>
          <Form.Control
            as='select'
            onChange={changeSelectedParameterGroup}
            defaultValue={selectedParameterGroup}
            className='rounded-1'
            label='Parameter Group'
          >
            {allParameterGroupOptions}
          </Form.Control>
        </FloatingLabel>
      </Col></Row>
      <Row className={ownStyles['row-padding-top']}><Col>
        <FloatingLabel label='Simulations'>
          <Form.Control
            as='select'
            onChange={changeSelectedSimModuleInstanceId}
            defaultValue={simModuleInstanceId}
            className='rounded-1'
            label='Simulations'
          >
            {allSimModuleInstanceOptions}
            {/* <option value={simModuleInstanceId} key={simModuleInstanceId}>{simModuleInstanceId}</option> */}
          </Form.Control>
        </FloatingLabel>
      </Col></Row>
      <Row className={ownStyles['row-padding-top']}><Col>
        <FloatingLabel label='Observations'>
          <Form.Control
            as='select'
            onChange={changeSelectedObsModuleInstanceId}
            defaultValue={obsModuleInstanceId}
            className='rounded-1'
            label='Observations'
          >
            {allObsModuleInstanceOptions}
            { /*<option value={obsModuleInstanceId} key={obsModuleInstanceId}>{obsModuleInstanceId}</option> */ }
          </Form.Control>
        </FloatingLabel>
      </Col></Row>
    </>
  )
}

export default IconsModelEvaluationSubform
