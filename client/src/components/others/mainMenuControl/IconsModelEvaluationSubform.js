import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

// import contexts
import ConsCache from '../../contexts/ConsCache'
import VarsState from '../../contexts/VarsState'
import varsStateLib from '../../contexts/varsStateLib'

const IconsModelEvaluationSubform = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { varsState, setVarState } = useContext(VarsState)
  const [selectedMetric, setSelectedMetric] =
    useState(varsStateLib.getContextIconsArgs('evaluation', varsState).metric)

  // react on change
  useEffect(() => {
    // only triggers when "uniform" is selected
    if (varsStateLib.getContextIconsType(varsState) !== 'evaluation') { return (null) }

    // TODO: should make a call if not in cache, as in IconsUniformSubform, and as callback...
    varsStateLib.updateLocationIcons(varsState, consCache, settings)
    setVarState(Math.random())
  }, [varsStateLib.getContextIconsType(varsState), varsStateLib.getContextFilterId(varsState),
    varsStateLib.getContextIconsArgs('evaluation', varsState), selectedMetric])

  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) !== 'evaluation') { return (null) }

  // build reaction function
  const onClickFunction = (selectedItem) => {
    varsStateLib.setContextIcons('evaluation', { metric: selectedItem.target.value }, varsState)
    setSelectedMetric(selectedItem.target.value)
  }

  // build options
  const allOptions = []
  const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
  allOptions.push.apply(allOptions, allEvaluationIds.map(
    (evaluationId) => {
      return (<option value={evaluationId} key={evaluationId}>{evaluationId}</option>)
    }
  ))

  return (
    <Row>
      <Col>
        <FloatingLabel label='Metric'>
          <Form.Control
            as='select'
            onChange={onClickFunction}
            defaultValue={selectedMetric}
            className='rounded-1'
            label='Metric'
          >
            {allOptions}
          </Form.Control>
        </FloatingLabel>
      </Col>
    </Row>
  )
}

export default IconsModelEvaluationSubform
