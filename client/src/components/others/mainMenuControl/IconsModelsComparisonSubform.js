import React, { useContext, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

// import contexts
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'

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

const IconsModelsComparisonSubform = ( ) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { varsState } = useContext(VarsState)
  const [selectedParameter, setSelectedParameter] =
    useState(varsStateLib.getContextIconsArgs('comparison', varsState).parameterGroupId)
  const [selectedMetric, setSelectedMetric] =
    useState(varsStateLib.getContextIconsArgs('comparison', varsState).metric)
  const [selectedParameterMetric, setSelectedParameterMetric] =
    useState(getParameterMetric(selectedParameter, selectedMetric))

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
  
  // build parameter metrics options
  const allParameterMetricOptions = []
  const allParameterGroupIds = ['A', 'B', 'C']
  const availableMetrics = getAvailableMetrics()
  allParameterGroupIds.forEach((curParameterGroupId, curParameterGroupI) => {
    Object.keys(availableMetrics).forEach(function(curMetricId) {
      const parameterMetricId = getParameterMetric(curParameterGroupId, curMetricId)
      const parameterMetricValue = curParameterGroupId + ': ' + availableMetrics[curMetricId]
      allParameterMetricOptions.push(
        <option value={parameterMetricId} key={parameterMetricId}>{parameterMetricValue}</option>)
    })
  })

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
          Add check boxes here
        </Col>
      </Row>
    </>)
}

export default IconsModelsComparisonSubform
