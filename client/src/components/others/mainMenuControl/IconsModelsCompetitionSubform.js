import React, { useContext, useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { Col, Form, Row } from 'react-bootstrap'
import { useRecoilState } from "recoil"

// import contexts
import ConsCache from '../../contexts/ConsCache.js'
import consCacheLib from '../../contexts/consCacheLib'

// import atoms
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext } from "../../atoms/atsVarState";
import { cloneDeep } from 'lodash'

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'

const ICON_TYPE = "competition"

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

const getGuideMessage = (numberSelectedModuleInstanceIds) => {
  if (numberSelectedModuleInstanceIds < 2) {
    return "Select at least 2 ModuleInstanceIds."
  }
  return null
}

const IconsModelsCompetitionSubform = ({ settings }) => {
  // ** SET HOOKS ******************************************************************************

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const [guideMessage, setGuideMessage] = useState(null)

  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)

  // ** FUNCTIONS ******************************************************************************

  // effectively changes the context value in the atom
  const changeContextValue = (valueKey, newValue) => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    const newValues = {}
    newValues[valueKey] = newValue
    atsVarStateLib.setContextIcons(ICON_TYPE, newValues,  atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }

  // reaction function (metric)
  const changeSelectedMetric = (selectedItem) => {
    changeContextValue('metric', selectedItem.target.value)
  }

  // reaction function (parameter group)
  const changeSelectedParameterGroup = (selectedItem) => {
    changeContextValue('parameterGroupId', selectedItem.target.value)
  }

  //
  const changeSelectedObsModuleInstanceId = (selectedItem) => {
    changeContextValue('observationModuleInstanceId', selectedItem.target.value)
  }

  // 
  const changeSelectedModuleInstances = (args) => {
    const targetIsChecked = args.target.checked
    const targetValue = args.target.value

    //
    const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext)
    const activeModuleInstanceIds = new Set(iconsArgs.simulationModuleInstanceIds)

    // get and update elements
    /*
    const activeModuleInstanceIds = new Set(
      varsStateLib.getContextIconsArgs('competition', varsState).simulationModuleInstanceIds)
    */
    if (targetIsChecked) { 
      activeModuleInstanceIds.add(targetValue)
    } else {
      activeModuleInstanceIds.delete(targetValue)
    }

    // 
    changeContextValue('simulationModuleInstanceIds', activeModuleInstanceIds)
    // updateSelectedModuleInstanceIds(activeModuleInstanceIds, varsState)
    setGuideMessage(getGuideMessage(activeModuleInstanceIds.size))
  }

  // updates varsState and hooks
  /*
  const updateSelectedModuleInstanceIds = (activeModuleInstanceIds, varsState) => {
    
    varsStateLib.setContextIcons("competition", { 
      simulationModuleInstanceIds: activeModuleInstanceIds
    }, varsState)
    setSimModuleInstanceIds(activeModuleInstanceIds)
    setGuideMessage(getGuideMessage(activeModuleInstanceIds.size))
  }
  */

  // ** BUILD COMPONENTS ***********************************************************************

  // only builds if in 'competition' tab
  if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) { return (null) }

  // only builds if has the basic info
  const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext)
  if (iconsArgs.metric, iconsArgs.parameterGroupId) { return (null) }

  // build options for metrics
  const allMetricOptions = []
  const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
  allMetricOptions.push.apply(allMetricOptions, allEvaluationIds.map(
    (evaluationId) => {
      return (<option value={evaluationId} key={evaluationId}>{evaluationId}</option>)
    }
  ))

  // build options for parameter groups
  const allParameterGroupOptions = []
  const paramGroupIds = iconsArgs.metric ? getParameterGroupsOfMetric(iconsArgs.metric, settings) : []
  if (iconsArgs.metric) {
    // identify parameter groups of selected metric
    allParameterGroupOptions.push.apply(allParameterGroupOptions, paramGroupIds.map(
      (paramGroupId) => {
        return (<option value={paramGroupId} key={paramGroupId}>{paramGroupId}</option>)
      }
    ))

    /*
    // if no parameter group selected, select one
    if ((!selectedParameterGroup) && (paramGroupIds.length > 0)) {
      setSelectedParameterGroup(paramGroupIds[0])
      return <></>
    }
    */
  } else {
    allParameterGroupOptions.push(<option value={null} key={null}>Select a metric!</option>)
  }

  // build options for observed moduleInstanceIds
  let [simParameterId, obsParameterId] = [null, null]
  const [allSimModuleInstanceOptions, allObsModuleInstanceOptions] = [[], []]
  if (iconsArgs.metric && iconsArgs.parameterGroupId) {
    [simParameterId, obsParameterId] = getSimObsParameterIds(iconsArgs.metric,
      iconsArgs.parameterGroupId, settings)

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
    allSimModInstIds.forEach((curModuleInstanceId) => {
      // TODO - check if there is at least one time series of the current module instance in
      //   the selected filter
      allSimModuleInstanceOptions.push(
        <Form.Check
          type="checkbox"
          value={curModuleInstanceId}
          label={curModuleInstanceId}
          key={curModuleInstanceId}
          onChange={changeSelectedModuleInstances}
          checked={iconsArgs.simulationModuleInstanceIds.has(curModuleInstanceId)}
        />
      )
    })
  
  } else {
    allObsModuleInstanceOptions.push(<option value={null} key={null}>
      Select a metric and a parameter group!
    </option>)
  }


  /* ** BUILD COMPONENT ********************************************************************** */
  
  return (
    <>
      <Row className={ownStyles['row-padding-top']}><Col>
        <FloatingLabel label='Metric'>
          <Form.Control
            as='select'
            onChange={changeSelectedMetric}
            defaultValue={iconsArgs.metric}
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
            defaultValue={iconsArgs.parameterGroupId}
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
            defaultValue={iconsArgs.observationModuleInstanceId}
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
