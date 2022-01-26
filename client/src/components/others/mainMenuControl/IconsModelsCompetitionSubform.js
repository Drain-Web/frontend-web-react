import React, { useContext, useEffect, useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { Col, Form, Row } from 'react-bootstrap'
import { apiUrl } from '../../../libs/api.js'

// import contexts
import ConsCache from '../../contexts/ConsCache.js'
import consCacheLib from '../../contexts/consCacheLib'
import ConsFixed from '../../contexts/ConsFixed.js'
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'

const getParameterGroupsOfMetric = (metricId, settings) => {
  const paramGroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
  return Object.keys(paramGroups)
}

const getSimObsParameterIds = (metricId, parameterGroupId, settings) => {
  // return two strings: the parameter ID of the simulations and the parameter id of the observations
  const pgroups = settings.locationIconsOptions.evaluation.options[metricId].parameterGroups
  return [pgroups[parameterGroupId].parameters.sim, pgroups[parameterGroupId].parameters.obs]
}

const getGuideMessage = (numberSelectedModuleInstanceIds) => {
  if (numberSelectedModuleInstanceIds < 2) {
    return "Select at least 2 ModuleInstanceIds."
  }
  return null
}

const IconsModelsCompetitionSubform = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  const { varsState, setVarState } = useContext(VarsState)
  const [selectedMetric, setSelectedMetric] =
    useState(varsStateLib.getContextIconsArgs('competition', varsState).metric)
  const [selectedParameterGroup, setSelectedParameterGroup] =
    useState(varsStateLib.getContextIconsArgs('competition', varsState).parameterGroupId)
  const [simModuleInstanceIds, setSimModuleInstanceIds] = 
    useState(varsStateLib.getContextIconsArgs('competition', varsState).simulationModuleInstanceIds)
  const [obsModuleInstanceId, setObsModuleInstanceId] = 
    useState(varsStateLib.getContextIconsArgs('competition', varsState).observationModuleInstanceId)
  const [guideMessage, setGuideMessage] = useState(null)

  // react on change
  useEffect(() => {
    // only triggers when "evaluation" is selected and the selected metric is not null
    if (varsStateLib.getContextIconsType(varsState) !== 'competition') { return (null) }
    if (!(selectedMetric && selectedParameterGroup)) { return (null) }

    // get obs and mod parameter IDs from parameter group
    const [simParameterId, obsParameterId] = getSimObsParameterIds(selectedMetric,
      selectedParameterGroup, settings)

    // define url to be called and skip call if this was the last URL called
    console.log("Building URL for:", obsModuleInstanceId, simModuleInstanceIds)
    const urlTimeseriesCalcRequest = apiUrl(
      settings.apiBaseUrl, 'v1dw', 'timeseries_calculator', {
        filter: varsStateLib.getContextFilterId(varsState),
        calc: selectedMetric,
        simParameterId: simParameterId,
        obsParameterId: obsParameterId,
        obsModuleInstanceId: obsModuleInstanceId,
        simModuleInstanceIds: simModuleInstanceIds
      }
    )

    // final response function: get data from consCache and update varsState
    const callbackFunc = (urlRequested) => {
      varsStateLib.updateLocationIcons(varsState, consCache, consFixed, settings)
      setVarState(Math.random())
    }

  }, [selectedMetric, selectedParameterGroup, simModuleInstanceIds, obsModuleInstanceId])

  /* ** FUNCTIONS **************************************************************************** */

  // build reaction function
  const changeSelectedMetric = (selectedItem) => {
    varsStateLib.setContextIcons('competition', { metric: selectedItem.target.value }, varsState)
    setSelectedMetric(selectedItem.target.value)
  }

  // TODO: implement this one
  const changeSelectedParameterGroup = (selectedItem) => {
    // varsStateLib.setContextIcons('evaluation', { metric: selectedItem.target.value }, varsState)
    // setSelectedMetric(selectedItem.target.value)
  }

  //
  const changeSelectedObsModuleInstanceId = (selectedItem) => {
    varsStateLib.setContextIcons('competition',
                                 { observationModuleInstanceId: selectedItem.target.value },
                                 varsState)
    setObsModuleInstanceId(selectedItem.target.value)
  }

  // 
  const changeSelectedModuleInstances = (args) => {
    const targetIsChecked = args.target.checked
    const targetValue = args.target.value

    // get and update elements
    const activeModuleInstanceIds = new Set(
      varsStateLib.getContextIconsArgs('competition', varsState).moduleInstanceIds)
    if (targetIsChecked) { 
      activeModuleInstanceIds.add(targetValue)
    } else {
      activeModuleInstanceIds.delete(targetValue)
    }
    updateSelectedModuleInstanceIds(activeModuleInstanceIds, varsState)
  }

  // updates varsState and hooks
  const updateSelectedModuleInstanceIds = (activeModuleInstanceIds, varsState) => {
    varsStateLib.setContextIcons("competition", { 
      moduleInstanceIds: activeModuleInstanceIds
    }, varsState)
    setSimModuleInstanceIds(activeModuleInstanceIds)
    setGuideMessage(getGuideMessage(activeModuleInstanceIds.size))
  }

  /* ** BUILD COMPONENTS ********************************************************************* */

  if (varsStateLib.getContextIconsType(varsState) != "competition") { return (null) }

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

  // build options for observed moduleInstanceIds
  let [simParameterId, obsParameterId] = [null, null]
  const [allSimModuleInstanceOptions, allObsModuleInstanceOptions] = [[], []]
  if (selectedMetric && selectedParameterGroup) {
    [simParameterId, obsParameterId] = getSimObsParameterIds(selectedMetric,
      selectedParameterGroup, settings)

    // get all module ids
    const allSimModInstIds = consCacheLib.getModuleInstancesWithParameter(simParameterId, consCache)
    const allObsModInstIds = consCacheLib.getModuleInstancesWithParameter(obsParameterId, consCache)

    // build observation module options
    for (const curObservationModuleInstanceId of allObsModInstIds) {
      allObsModuleInstanceOptions.push(
        <option value={curObservationModuleInstanceId} key={curObservationModuleInstanceId}>
          {curObservationModuleInstanceId}
        </option>
      )
    }

    // build simulation options
    /*
    for (const curSimulationModuleInstanceId of allSimModInstIds) {
      allSimModuleInstanceOptions.push(
        <option value={curSimulationModuleInstanceId} key={curSimulationModuleInstanceId}>
          {curSimulationModuleInstanceId}
        </option>
      )
    }
    */
    allSimModInstIds.forEach((curModuleInstanceId) => {
      // TODO - check if there is at least one time series of the current module instance in the selected filter
      allSimModuleInstanceOptions.push(
        <Form.Check
          type="checkbox"
          value={curModuleInstanceId}
          label={curModuleInstanceId}
          key={curModuleInstanceId}
          onChange={changeSelectedModuleInstances}
          checked={simModuleInstanceIds.has(curModuleInstanceId)}
        />
      )
    })

    // if no observation module instance selected, select one
    console.log("-+-", allObsModInstIds)
    if ((!obsModuleInstanceId) && (allObsModInstIds.size > 0)) {
      setObsModuleInstanceId(allObsModInstIds.values().next().value)
      return <></>
    }
  
  } else {
    allObsModuleInstanceOptions.push(<option value={null} key={null}>Select a metric and a parameter group!</option>)
  }

  //
  


  /* ** BUILD COMPONENT ********************************************************************** */
  
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
      <Row className={ownStyles['row-padding-top']}><Col>
        {guideMessage}
      </Col></Row>
      <Row className={ownStyles['row-padding-top']}><Col>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          {allSimModuleInstanceOptions}
        </Form.Group>
      </Col></Row>
    </>
  )
}

export default IconsModelsCompetitionSubform
