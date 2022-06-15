import React, { useContext, useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import axios from 'axios'
import { useRecoilState } from "recoil"

// import contexts
import ConsFixed from '../../contexts/ConsFixed'
import ConsCache from '../../contexts/ConsCache'
import consCacheLib from '../../contexts/consCacheLib'

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'

// import atoms
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext } from "../../atoms/atsVarState";
import { cloneDeep } from 'lodash'

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

// TODO: move to a shared place
const getSimObsParameterIds = (metricId, parameterGroupId, settings) => {
  // return two strings: the parameter ID of the simulations and the parameter id of the observations
  const pgroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
  return [pgroups[parameterGroupId].parameters.sim, pgroups[parameterGroupId].parameters.obs]
}

const IconsModelEvaluationSubform = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)

  // get atoms
  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)

  // when the component is loaded, some consistency checks are made
  useEffect(() => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    const iconsArgs = atsVarStateLib.getContextIconsArgs('evaluation', atmVarStateContext)
    let anyChange = false

    // if no metric selected, select one
    if (!iconsArgs.metric) {
      const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
      atsVarStateLib.setContextIconsArgs('evaluation', 'metric', allEvaluationIds[0],
                                         atmVarStateContext)
      iconsArgs.metric = allEvaluationIds[0]
      anyChange = true
    }

    // if no parameter group selected, select one
    const paramGroupIds = getParameterGroupsOfMetric(iconsArgs.metric, settings)
    if ((!iconsArgs.parameterGroupId) && (paramGroupIds.length > 0)) {
      atsVarStateLib.setContextIconsArgs('evaluation', 'parameterGroupId', paramGroupIds[0],
                                         atmVarStateContext)
      iconsArgs.parameterGroupId = paramGroupIds[0]
      anyChange = true
    }

    // 
    const [simParameterId, obsParameterId] = getSimObsParameterIds(iconsArgs.metric,
      iconsArgs.parameterGroupId, settings)

    // get all module ids
    const allSimModInstIds = consCacheLib.getModuleInstancesWithParameter(simParameterId, consCache)
    const allObsModInstIds = consCacheLib.getModuleInstancesWithParameter(obsParameterId, consCache)

    // if no simulation module instance selected, select one
    if ((!iconsArgs.simulationModuleInstanceId) && (allSimModInstIds) && (allSimModInstIds.size > 0)) {
      atsVarStateLib.setContextIconsArgs('evaluation', 'simulationModuleInstanceId',
                                         allSimModInstIds.values().next().value,
                                         atmVarStateContext)
      anyChange = true
    }

    // if no observation module instance selected, select one
    if ((!iconsArgs.observationModuleInstanceId) && (allObsModInstIds) && (allObsModInstIds.size > 0)) {
      atsVarStateLib.setContextIconsArgs('evaluation', 'observationModuleInstanceId',
                                         allObsModInstIds.values().next().value,
                                         atmVarStateContext)
      anyChange = true
    }

    // update if needed
    if (anyChange) { setAtVarStateContext(atmVarStateContext) }

  }, [])


  // TODO: review it makes sense
  useEffect(() => {

    // get base values
    const iconsArgs = atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext)
    const selectedMetric = iconsArgs.metric
    const selectedParameterGroup = iconsArgs.parameterGroupId

    // basic check
    if ((!selectedMetric) || (!selectedParameterGroup)) { return }

    // get all module ids
    const [simParameterId, obsParameterId] = getSimObsParameterIds(selectedMetric,
      selectedParameterGroup, settings)
    const allSimModInstIds = consCacheLib.getModuleInstancesWithParameter(simParameterId, consCache)
    const allObsModInstIds = consCacheLib.getModuleInstancesWithParameter(obsParameterId, consCache)

    const atmVarStateContext = cloneDeep(atomVarStateContext)
    let anyChange = false
    
    // if no simulation module instance selected, select one
    if ((!iconsArgs.simulationModuleInstanceId) && (allSimModInstIds) && (allSimModInstIds.size > 0)) {
      atsVarStateLib.setContextIconsArgs('evaluation', 'simulationModuleInstanceId',
                                         allSimModInstIds.values().next().value,
                                         atmVarStateContext)
      anyChange = true
    }

    // if no observation module instance selected, select one
    if ((!iconsArgs.observationModuleInstanceId) && (allObsModInstIds) && (allObsModInstIds.size > 0)) {
      atsVarStateLib.setContextIconsArgs('evaluation', 'observationModuleInstanceId',
                                         allObsModInstIds.values().next().value,
                                         atmVarStateContext)
      anyChange = true
    }

    // update if needed
    if (anyChange) { setAtVarStateContext(atmVarStateContext) }

  }, [atsVarStateLib.getContextIconsType(atomVarStateContext)])
  

  // ** BUILD COMPONENT ************************************************************************

  // if (varsStateLib.getContextIconsType(varsState) !== 'evaluation') { return (null) }
  if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== "evaluation") {
    return (null)
  }

  // build reaction function
  const changeSelectedMetric = (selectedItem) => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons('evaluation', { metric: selectedItem.target.value }, 
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }

  // TODO: implement this one
  const changeSelectedParameterGroup = (selectedItem) => {
    // varsStateLib.setContextIcons('evaluation', { metric: selectedItem.target.value }, varsState)
    // setSelectedMetric(selectedItem.target.value)
  }

  // 
  const changeSelectedObsModuleInstanceId = (selectedItem) => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons('evaluation',
                                   { observationModuleInstanceId: selectedItem.target.value },
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }
  
  // 
  const changeSelectedSimModuleInstanceId = (selectedItem) => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons('evaluation',
                                   { simulationModuleInstanceId: selectedItem.target.value },
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }

  // build options for metrics
  const allMetricOptions = []
  const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
  allMetricOptions.push.apply(allMetricOptions, allEvaluationIds.map((evaluationId) => {
    return (<option value={evaluationId} key={evaluationId}>{evaluationId}</option>)
  }))

  // build options for parameter groups
  const allParameterGroupOptions = []
  const iconsArgs = atsVarStateLib.getContextIconsArgs('evaluation', atomVarStateContext)
  const selectedMetric = iconsArgs.metric
  const selectedParameterGroup = iconsArgs.parameterGroupId
  const simModuleInstanceId = iconsArgs.simulationModuleInstanceId
  const obsModuleInstanceId = iconsArgs.observationModuleInstanceId
  const paramGroupIds = selectedMetric ? getParameterGroupsOfMetric(selectedMetric, settings) : []
  if (selectedMetric) {
    // identify parameter groups of selected metric
    allParameterGroupOptions.push.apply(allParameterGroupOptions, paramGroupIds.map(
      (paramGroupId) => {
        return (<option value={paramGroupId} key={paramGroupId}>{paramGroupId}</option>)
      }
    ))

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
    
  } else {
    const selectMetricMsg = "Select a metric and a parameter group!"
    const selectMetricOption = (<option value={null} key={null}>{selectMetricMsg}</option>)
    allSimModuleInstanceOptions.push(selectMetricOption)
    allObsModuleInstanceOptions.push(selectMetricOption)
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
            label='Metric'>
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
            label='Parameter Group'>
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
            label='Simulations'>
              {allSimModuleInstanceOptions}
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
            label='Observations'>
              {allObsModuleInstanceOptions}
          </Form.Control>
        </FloatingLabel>
      </Col></Row>
    </>
  )
}

export default IconsModelEvaluationSubform
