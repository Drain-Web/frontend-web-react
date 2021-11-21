import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { apiUrl } from '../../../libs/api.js'
import axios from 'axios'

// import contexts
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
  console.log('metricId:', metricId)
  console.log('settings:', settings.locationIconsOptions.evaluation.options)
  const paramGroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
  return Object.keys(paramGroups)
}

const getSimObsParameterIds = (metricId, parameterGroupId, settings) => {
  console.log(metricId)
  console.log(parameterGroupId)
  console.log(settings)
  const pgroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
  return [pgroups[parameterGroupId].parameters.sim, pgroups[parameterGroupId].parameters.obs]
}

const IconsModelEvaluationSubform = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { varsState, setVarState } = useContext(VarsState)
  const [selectedMetric, setSelectedMetric] =
    useState(varsStateLib.getContextIconsArgs('evaluation', varsState).metric)
  const [selectedParameterGroup, setSelectedParameterGroup] =
    useState(varsStateLib.getContextIconsArgs('evaluation', varsState).parameterGroupId)
  const [simModuleInstanceId, setSimModuleInstanceId] = useState('Dist115t140USGSobs')
  const [obsModuleInstanceId, setObsModuleInstanceId] = useState('ImportUSGSobs')

  // react on change
  useEffect(() => {
    // only triggers when "evaluation" is selected and the selected metric is not null
    if (varsStateLib.getContextIconsType(varsState) !== 'evaluation') { return (null) }
    if (!selectedMetric) { return (null) }
    if (!selectedParameterGroup) { return (null) }

    // TODO: get obs and mod parameter IDs from parameter group

    const [simParameterId, obsParameterId] = getSimObsParameterIds(selectedMetric,
      selectedParameterGroup, settings)

    // define url to be called and skip call if this was the last URL called
    const urlTimeseriesCalcRequest = apiUrl(
      settings.apiBaseUrl, 'v1dw', 'timeseries_calculator', {
        filter: varsStateLib.getContextFilterId(varsState),
        calc: selectedMetric,
        simParameterId: simParameterId,
        obsParameterId: obsParameterId,
        obsModuleInstanceId: obsModuleInstanceId, // selectedMetric.observationModuleInstanceId,
        simModuleInstanceId: simModuleInstanceId // TODO: selectedMetric.simulationModuleInstanceId
      }
    )

    // final response function: get data from consCache and update varsState
    const callbackFunc = (urlRequested) => {
      // const responseData = consCacheLib.getEvaluationResponseData(urlRequested, consCache)
      // console.log('FROM ConsCache, GOT', urlRequested)
      // console.log(' AS', responseData)
      varsStateLib.updateLocationIcons(varsState, consCache, settings)
      setVarState(Math.random())
    }

    //
    if (consCacheLib.wasUrlRequested(urlTimeseriesCalcRequest, consCache)) {
      callbackFunc(urlTimeseriesCalcRequest)
    } else {
      // request URL, update local states, update cache, access cache
      console.log('URL %s was not requested yet:', urlTimeseriesCalcRequest, consCache)
      const extraArgs = {
        url: urlTimeseriesCalcRequest
      }
      varsStateLib.hideAllLocationIcons(varsState)
      fetcherWith(urlTimeseriesCalcRequest, extraArgs).then(([jsonData, extras]) => {
        consCacheLib.addUrlRequested(extras.url, consCache)
        consCacheLib.storeEvaluationResponseData(extras.url, jsonData.evaluation, consCache)
        callbackFunc(extras.url)
      })
    }

    console.log('Will request:', urlTimeseriesCalcRequest)

    // TODO: should make a call if not in cache, as in IconsUniformSubform, and as callback...
    varsStateLib.updateLocationIcons(varsState, consCache, settings)
    setVarState(Math.random())
  }, [varsStateLib.getContextIconsType(varsState), varsStateLib.getContextFilterId(varsState),
    varsStateLib.getContextIconsArgs('evaluation', varsState), selectedMetric, 
    selectedParameterGroup])

  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) !== 'evaluation') { return (null) }

  // build reaction function
  const changeSelectedMetric = (selectedItem) => {
    varsStateLib.setContextIcons('evaluation', { metric: selectedItem.target.value }, varsState)
    setSelectedMetric(selectedItem.target.value)
  }

  const changeSelectedParameterGroup = (selectedItem) => {
    // varsStateLib.setContextIcons('evaluation', { metric: selectedItem.target.value }, varsState)
    // setSelectedMetric(selectedItem.target.value)
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

  return (
    <>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
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
        </Col>
      </Row>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
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
        </Col>
      </Row>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
          <FloatingLabel label='Simulations'>
            <Form.Control
              as='select'
              defaultValue={simModuleInstanceId}
              className='rounded-1'
              label='Simulations'
            >
              <option value={simModuleInstanceId} key={simModuleInstanceId}>{simModuleInstanceId}</option>
            </Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
          <FloatingLabel label='Observations'>
            <Form.Control
              as='select'
              defaultValue={obsModuleInstanceId}
              className='rounded-1'
              label='Observations'
            >
              <option value={obsModuleInstanceId} key={obsModuleInstanceId}>{obsModuleInstanceId}</option>
            </Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
    </>
  )
}

export default IconsModelEvaluationSubform
