import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

// import contexts
import consCacheLib from '../../contexts/consCacheLib'
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'
import ConsCache from '../../contexts/ConsCache'


// TODO
const getAvailableMetrics = () => {
  return {
    'higherMax': 'Higher Max',
    'higherMean': 'Higher Mean',
    'lowerMax': 'Lower Max',
    'lowerMean': 'Lower Mean'
  }
}

const getParameterAndMetric = (parameterMetric) => {
  return parameterMetric.split('|');
}

const getParameterMetric = (param, metric) => {
  return param + '|' + metric
}


const IconsModelsComparisonSubform = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { varsState } = useContext(VarsState)
  const [selectedParameter, setSelectedParameter] =
    useState(varsStateLib.getContextIconsArgs('comparison', varsState).parameterGroupId)
  const [selectedMetric, setSelectedMetric] =
    useState(varsStateLib.getContextIconsArgs('comparison', varsState).metric)
  const [selectedParameterMetric, setSelectedParameterMetric] =
    useState(getParameterMetric(selectedParameter, selectedMetric))
  const [selectedModuleInstanceIds, setSelectedModuleInstanceIds] =
    useState(varsStateLib.getContextIconsArgs('comparison', varsState).moduleInstanceIds)
    
  // react on change
  useEffect(() => {
    // only triggers when "evaluation" is selected and the selected metric is not null
    if (varsStateLib.getContextIconsType(varsState) !== 'comparison') { return (null) }

    const selModInstIds = Array.from(selectedModuleInstanceIds)
    const allIcons = settings.locationIconsOptions.comparison.icons
    const useIcons = allIcons.slice(0, selModInstIds.length)

    // TODO - call varsStateLib.updateLocationIcons()
    console.log("Selected:", selectedModuleInstanceIds)
    console.log("Truly:", varsStateLib.getContextIconsArgs('comparison', varsState).moduleInstanceIds)
    console.log("Sliced icons:", useIcons, "in", selModInstIds.length)


  }, [varsStateLib.getContextIconsType(varsState), varsStateLib.getContextFilterId(varsState),
    varsStateLib.getContextIconsArgs('comparison', varsState),
    selectedParameter, selectedMetric, selectedParameterMetric, selectedModuleInstanceIds])

  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) != "comparison") { return (null) }

  // build reaction function
  const changeParameterMetric = (selectedParameterMetric) => {
    const [parameterGroupId, metricId] = getParameterAndMetric(selectedParameterMetric.target.value)
    varsStateLib.setContextIcons("comparison", { 
      parameterGroupId: parameterGroupId,
      metric: metricId
    }, varsState)
    setSelectedParameter(parameterGroupId)
    setSelectedMetric(metricId)
    setSelectedParameterMetric(selectedParameterMetric.target.value)
  }

  // 
  const changeSelectedModuleInstances = (args) => {
    const targetIsChecked = args.target.checked
    const targetValue = args.target.value

    // get and update elements
    const activeModuleInstanceIds = new Set(
      varsStateLib.getContextIconsArgs('comparison', varsState).moduleInstanceIds)
    if (targetIsChecked) { 
      activeModuleInstanceIds.add(targetValue)
    } else {
      activeModuleInstanceIds.delete(targetValue)
    }

    // save them
    varsStateLib.setContextIcons("comparison", { 
      moduleInstanceIds: activeModuleInstanceIds
    }, varsState)
    setSelectedModuleInstanceIds(activeModuleInstanceIds)
  }
  
  // build parameter metrics options
  let firstParameterMetricOptionId = null
  const allParameterMetricOptions = []
  const allAvailableParameterGroupIds = settings.locationIconsOptions.comparison.options.availableParameterGroupIds
  const availableMetrics = getAvailableMetrics()
  allAvailableParameterGroupIds.forEach((curParameterGroupId, curParameterGroupI) => {
    Object.keys(availableMetrics).forEach(function(curMetricId) {
      const parameterMetricId = getParameterMetric(curParameterGroupId, curMetricId)
      const parameterMetricValue = curParameterGroupId + ': ' + availableMetrics[curMetricId]
      allParameterMetricOptions.push(
        <option value={parameterMetricId} key={parameterMetricId}>{parameterMetricValue}</option>)
      firstParameterMetricOptionId = firstParameterMetricOptionId ? firstParameterMetricOptionId : parameterMetricId
    })
  })

  // if no parameterMetric selected, select first
  if (!selectedParameterMetric) {
    changeParameterMetric(firstParameterMetricOptionId)
    return <></>
  }

  // build module instance options
  const allModuleInstanceOptionIds = consCacheLib.getModuleInstancesWithParameterGroup(selectedParameter, consCache)
  const allModuleInstanceOptions = []
  if (allModuleInstanceOptionIds) {
    allModuleInstanceOptionIds.forEach((curModuleInstanceId) => {
      // TODO - check if there is at least one time series of the current module instance in the selected filter
      allModuleInstanceOptions.push(
        <Form.Check
          type="checkbox"
          value={curModuleInstanceId}
          label={curModuleInstanceId}
          key={curModuleInstanceId}
          onChange={changeSelectedModuleInstances}
        />
      )
    })
  }

  return (
    <>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
          <FloatingLabel label='Parameter / Metric'>
            <Form.Control
              as='select'
              onChange={changeParameterMetric}
              defaultValue={selectedParameterMetric}
              className='rounded-1'
              label='Metric'
            >
              {allParameterMetricOptions}
            </Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            {allModuleInstanceOptions}
          </Form.Group>
        </Col>
      </Row>
    </>)
}

export default IconsModelsComparisonSubform
