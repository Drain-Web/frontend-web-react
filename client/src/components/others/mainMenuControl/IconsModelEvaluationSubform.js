import React, { useContext } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { useRecoilState } from "recoil"

// import contexts
import ConsCache from '../../contexts/ConsCache'
import consCacheLib from '../../contexts/consCacheLib'

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'

// import atoms
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext } from "../../atoms/atsVarState";
import { cloneDeep } from 'lodash'

const ICON_TYPE = "evaluation"

// TODO: move to a shared place
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
  
  // ** ON-CLICK FUNCTIONS *********************************************************************

  // build reaction function
  const changeSelectedMetric = (selectedItem) => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons(ICON_TYPE, { metric: selectedItem.target.value }, 
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
    atsVarStateLib.setContextIcons(ICON_TYPE,
                                   { observationModuleInstanceId: selectedItem.target.value },
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }
  
  // 
  const changeSelectedSimModuleInstanceId = (selectedItem) => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons(ICON_TYPE,
                                   { simulationModuleInstanceId: selectedItem.target.value },
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }

  // ** BUILD COMPONENT ************************************************************************

  // only builds if in 'evaluation' tab and if everything is set
  if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) { return (null) }

  // basic check
  const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext)
  let continueIt = true
  if (!iconsArgs.metric) { continueIt = false }
  if (!iconsArgs.parameterGroupId) { continueIt = false }
  if (!iconsArgs.observationModuleInstanceId) { continueIt = false }
  if (!iconsArgs.simulationModuleInstanceId) { continueIt = false }
  if (!continueIt) {

    // if the only information missing is the simulation, inform the user
    if (iconsArgs.metric && iconsArgs.parameterGroupId && iconsArgs.observationModuleInstanceId) {
      return (<p>No simulation data to evaluate.</p>)
    } else {
      return (null)
    }
  }

  // build options for metrics
  const allMetricOptions = []
  const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
  allMetricOptions.push.apply(allMetricOptions, allEvaluationIds.map((evaluationId) => {
    return (<option value={evaluationId} key={evaluationId}>{evaluationId}</option>)
  }))

  // build options for parameter groups
  const allParameterGroupOptions = []
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
    const allSimModInstIds = consCacheLib.getModuleInstancesWithParameter(simParameterId,
      consCache)
    const allObsModInstIds = consCacheLib.getModuleInstancesWithParameter(obsParameterId,
      consCache)
  
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
