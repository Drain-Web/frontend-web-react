import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { useRecoilState, useRecoilValue } from "recoil"

// import contexts
import ConsCache from '../../contexts/ConsCache'
import ConsFixed from '../../contexts/ConsFixed'
import consCacheLib from '../../contexts/consCacheLib'

// import atoms
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext, atVarStateLocations, atVarStateDomMapLegend,
  atVarStateDomMainMenuControl } from "../../atoms/atsVarState";
import { cloneDeep } from 'lodash'

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'

const ICON_TYPE = "comparison"


// TODO
const getAvailableMetrics = () => {
  return {
    'higherMax': 'Higher Max',
    'lowerMax': 'Lower Max'
  }
}

const getGuideMessage = (numberSelectedModuleInstanceIds) => {
  if (numberSelectedModuleInstanceIds < 2) {
    return "Select at least 2 ModuleInstanceIds."
  }
  return null
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
  const { consFixed } = useContext(ConsFixed)
  const [guideMessage, setGuideMessage] = useState(null)

  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
  const atomVarStateDomMainMenuControl = useRecoilValue(atVarStateDomMainMenuControl)
  const [atomVarStateLocations, setAtVarStateLocations] = useRecoilState(atVarStateLocations)
  const [atomVarStateDomMapLegend, setAtVarStateDomMapLegend] = useRecoilState(atVarStateDomMapLegend)
  
  // when the component is loaded, some consistency checks are made
  useEffect(() => {
    // only triggers when "comparison" is selected and the selected metric is not null
    if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) { return (null) }

    // build parameter metrics options
    let firstParameterMetricOptionId = null
    const allParameterMetricOptions = []
    const allAvailableParameterGroupIds = settings.locationIconsOptions[ICON_TYPE].options.availableParameterGroupIds
    const availableMetrics = getAvailableMetrics()
    allAvailableParameterGroupIds.forEach((curParameterGroupId, curParameterGroupI) => {
      Object.keys(availableMetrics).forEach(function(curMetricId) {
        const parameterMetricId = getParameterMetric(curParameterGroupId, curMetricId)
        const parameterMetricValue = curParameterGroupId + ': ' + availableMetrics[curMetricId]
        allParameterMetricOptions.push(
          <option value={parameterMetricId} key={parameterMetricId}>{parameterMetricValue}</option>)
        if (!firstParameterMetricOptionId) {
          firstParameterMetricOptionId = parameterMetricId
        }
      })
    })
    
    // if no parameterMetric selected, select first
    if ((!atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).parameterGroupId) ||
        (!atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).metric)) {
      changeParameterMetric(firstParameterMetricOptionId)
      console.log("__Changing parameter metric to:", firstParameterMetricOptionId)
      return <></>
    }

  }, [atsVarStateLib.getContextIconsType(atomVarStateContext)])


  // react on change
  useEffect(() => {
    // only triggers when "comparison" is selected and the selected metric is not null
    if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) { return (null) }

    // if not enough modules select, shows uniform
    // varsStateLib.updateLocationIcons(varsState, consCache, consFixed, settings)
    // setVarState(Math.random())

    const atmVarStateLocations = cloneDeep(atomVarStateLocations)
    const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
    atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
      atomVarStateContext, atmVarStateDomMapLegend, consCache, consFixed, settings)
    setAtVarStateLocations(atmVarStateLocations)
    setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
  }, [
    atsVarStateLib.getContextIconsType(atomVarStateContext),
    atsVarStateLib.getContextFilterId(atomVarStateContext),
    atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).parameterGroupId,
    atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).metric,
    getParameterMetric(
      atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).parameterGroupId,
      atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).metric),
    atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).moduleInstanceIds
  ])

  /* ** BUILD COMPONENT ********************************************************************** */

  // only builds if in 'competition' tab
  if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) { 
    console.log("__Not in '", ICON_TYPE, "' but in",
      atsVarStateLib.getContextIconsType(atomVarStateContext))
    return (null)
  } else {
    console.log("__Yes, in", ICON_TYPE)
  }

  // build reaction function
  const changeParameterMetric = (selectedParameterMetric) => {
    let selParamMetric = null
    if (selectedParameterMetric.target) {
      selParamMetric = selectedParameterMetric.target.value
    } else {
      selParamMetric = selectedParameterMetric
    }
    const [parameterGroupId, metricId] = getParameterAndMetric(selParamMetric)

    // setSelectedParameterMetric(selParamMetric)
    // updateSelectedModuleInstanceIds(new Set(), varsState)  

    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons(ICON_TYPE, {
      parameterGroupId: parameterGroupId,
      metric: metricId,
      moduleInstanceIds: new Set()  // TODO: keep selected modules active
    },  atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
    setGuideMessage(getGuideMessage(0))
  }

  /*
  // updates varsState and hooks
  const updateSelectedModuleInstanceIds = (activeModuleInstanceIds, varsState) => {
    varsStateLib.setContextIcons(ICON_TYPE, { 
      moduleInstanceIds: activeModuleInstanceIds
    }, varsState)
    setSelectedModuleInstanceIds(activeModuleInstanceIds)
    setGuideMessage(getGuideMessage(activeModuleInstanceIds.size))
  }
  */

  // 
  const changeSelectedModuleInstances = (args) => {
    const targetIsChecked = args.target.checked
    const targetValue = args.target.value

    // get and update elements
    const activeModuleInstanceIds = new Set(
      atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).moduleInstanceIds)
    if (targetIsChecked) { 
      activeModuleInstanceIds.add(targetValue)
    } else {
      activeModuleInstanceIds.delete(targetValue)
    }
    
    // 
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons(ICON_TYPE, {
      moduleInstanceIds: activeModuleInstanceIds
    },  atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
    setGuideMessage(getGuideMessage(activeModuleInstanceIds.size))
  }
  
  // build parameter metrics options
  const allParameterMetricOptions = []
  const allAvailableParameterGroupIds = settings.locationIconsOptions[ICON_TYPE].options.availableParameterGroupIds
  const availableMetrics = getAvailableMetrics()
  allAvailableParameterGroupIds.forEach((curParameterGroupId, curParameterGroupI) => {
    Object.keys(availableMetrics).forEach(function(curMetricId) {
      const parameterMetricId = getParameterMetric(curParameterGroupId, curMetricId)
      const parameterMetricValue = curParameterGroupId + ': ' + availableMetrics[curMetricId]
      allParameterMetricOptions.push(
        <option value={parameterMetricId} key={parameterMetricId}>{parameterMetricValue}</option>)
    })
  })
  
  /*
  // if no parameterMetric selected, select first
  if ((!atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).parameterGroupId) ||
      (!atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).metric)) {
    changeParameterMetric(firstParameterMetricOptionId)
    console.log("__Changing parameter metric to:", firstParameterMetricOptionId)
    return <></>
  }
  */

  // build module instance options
  const allModuleInstanceOptionIds = consCacheLib.getModuleInstancesWithParameterGroup(
    atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).parameterGroupId, consCache)
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
          checked={atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).moduleInstanceIds.has(curModuleInstanceId)}
        />
      )
    })
  }

  console.log("__Building rows.")
  return (
    <>
      <Row className={ownStyles['row-padding-top']}>
        <Col>
          <FloatingLabel label='Parameter / Metric'>
            <Form.Control
              as='select'
              onChange={changeParameterMetric}
              defaultValue={getParameterMetric(
                atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).parameterGroupId,
                atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).metric)}
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
          {guideMessage}
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
