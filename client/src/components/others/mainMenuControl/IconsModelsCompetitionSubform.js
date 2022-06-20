import React, { useContext, useEffect, useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { Col, Form, Row } from 'react-bootstrap'
import { apiUrl } from '../../../libs/api.js'
import { useRecoilState, useRecoilValue } from "recoil"
import axios from 'axios'

// import contexts
import ConsCache from '../../contexts/ConsCache.js'
import consCacheLib from '../../contexts/consCacheLib'
import ConsFixed from '../../contexts/ConsFixed.js'

// import atoms
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext, atVarStateLocations, atVarStateDomMapLegend,
         atVarStateDomMainMenuControl } from
  "../../atoms/atsVarState";
import { cloneDeep } from 'lodash'

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

const ICON_TYPE = "competition"

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

const getGuideMessage = (numberSelectedModuleInstanceIds) => {
  if (numberSelectedModuleInstanceIds < 2) {
    return "Select at least 2 ModuleInstanceIds."
  }
  return null
}

const IconsModelsCompetitionSubform = ({ settings }) => {
  // ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  const [guideMessage, setGuideMessage] = useState(null)

  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
  const [atomVarStateLocations, setAtVarStateLocations] = useRecoilState(atVarStateLocations)
  const [atomVarStateDomMapLegend, setAtVarStateDomMapLegend] = 
    useRecoilState(atVarStateDomMapLegend)
  const atomVarStateDomMainMenuControl =  useRecoilValue(atVarStateDomMainMenuControl)

  // when the component is loaded, some consistency checks are made
  useEffect(() => {

    // basic check 1
    if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) { return (null) }

    const atmVarStateContext = cloneDeep(atomVarStateContext)
    const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atmVarStateContext)
    let anyChange = false

    // if no metric selected, select one
    if (!iconsArgs.metric) {
      const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
      atsVarStateLib.setContextIconsArgs(ICON_TYPE, 'metric', allEvaluationIds[0],
                                         atmVarStateContext)
      iconsArgs.metric = allEvaluationIds[0]
      anyChange = true
    }
    
    // if no parameter group selected, select one
    const paramGroupIds = iconsArgs.metric ? getParameterGroupsOfMetric(iconsArgs.metric, settings) : []
    if ((!iconsArgs.parameterGroupId) && (paramGroupIds.length > 0)) {
      iconsArgs.parameterGroupId = paramGroupIds[0]
      anyChange = true
    }

    // if no observation module instance selected, select one
    let [_, obsParameterId] = getSimObsParameterIds(iconsArgs.metric, iconsArgs.parameterGroupId, settings)
    const allObsModInstIds = consCacheLib.getModuleInstancesWithParameter(obsParameterId, consCache)
    if ((!iconsArgs.observationModuleInstanceId) && (allObsModInstIds) && (allObsModInstIds.size > 0)) {
      iconsArgs.observationModuleInstanceId = allObsModInstIds.values().next().value
      anyChange = true
    }


    // if no observation module ID selected, select one
    /*
    if (!iconsArgs.observationModuleInstanceId) {
      console.log("..allObsModInstIds:", Array.from(allObsModInstIds)[0])
      changeSelectedObsModuleInstanceId({
        "target": { "value": Array.from(allObsModInstIds)[0] }
      })
    }
    */

    // update if needed
    if (anyChange) {
      console.log("Updated context from competition subform.")
      setAtVarStateContext(atmVarStateContext)
    }

  }, [atsVarStateLib.getContextIconsType(atomVarStateContext)])

  // TODO: move to VarsStateManager
  // react on change
  useEffect(() => {
    // only triggers when "evaluation" is selected and the selected metric is not null

    // basic check 1
    if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) { return (null) }

    // basic check 2
    const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext)
    let continueIt = true
    if (!iconsArgs.metric) { continueIt = false }
    if (!iconsArgs.parameterGroupId) { continueIt = false }
    if (!continueIt) { return (null) }

    // get obs and mod parameter IDs from parameter group
    const [simParameterId, obsParameterId] = getSimObsParameterIds(iconsArgs.metric,
      iconsArgs.parameterGroupId, settings)

    // final response function: get data from consCache and update varsState
    const callbackFunc = () => {
      const atmVarStateLocations = cloneDeep(atomVarStateLocations)
      const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
      atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
        atomVarStateContext, atmVarStateDomMapLegend,
        consCache, consFixed, settings)
      setAtVarStateLocations(atmVarStateLocations)
      setAtVarStateDomMapLegend(atmVarStateDomMapLegend)
    }

    // define url
    let urlTimeseriesCalcRequest = null
    if (iconsArgs.simulationModuleInstanceIds.size >= 2) {

      // define url to be called and skip call if this was the last URL called
      const simModInstIds = Array.from(iconsArgs.simulationModuleInstanceIds).join(",")
      urlTimeseriesCalcRequest = apiUrl(
        settings.apiBaseUrl, 'v1dw', 'timeseries_calculator', {
          filter: atsVarStateLib.getContextFilterId(atomVarStateContext),   // varsStateLib.getContextFilterId(varsState),
          calc: iconsArgs.metric,
          simParameterId: simParameterId,
          obsParameterId: obsParameterId,
          obsModuleInstanceId: iconsArgs.observationModuleInstanceId,
          simModuleInstanceIds: simModInstIds
        }
      )
    }

    //
    if (consCacheLib.wasUrlRequested(urlTimeseriesCalcRequest, consCache) ||
        !urlTimeseriesCalcRequest) {
      callbackFunc()

    } else {
      
      // icons to loading
      new Promise((resolve, _) => { resolve(null) }).then((value) => {
        _setLocationIconsLoading()
      })
      
      // request URL, update local states, update cache, access cache
      const extraArgs = { url: urlTimeseriesCalcRequest }
      fetcherWith(urlTimeseriesCalcRequest, extraArgs).then(([jsonData, extras]) => {
        consCacheLib.addUrlRequested(extras.url, consCache)
        consCacheLib.storeCompetitionResponseData(extras.url, jsonData.competition, consCache)
        callbackFunc()
      })
    }

    // varsStateLib.hideAllLocationIcons(varsState)
    // setVarState(Math.random())
  }, [
    atsVarStateLib.getContextIconsType(atomVarStateContext),
    atsVarStateLib.getContextFilterId(atomVarStateContext),
    atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).metric,
    atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).parameterGroupId,
    atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).simulationModuleInstanceId,
    atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext).observationModuleInstanceId
  ])

  // ** FUNCTIONS ******************************************************************************

  // 
  const _setLocationIconsLoading = () => {
    const atmVarStateLocations = cloneDeep(atomVarStateLocations)
    atsVarStateLib.setUniformIcon(settings.loadingLocationIcon, atmVarStateLocations)
    setAtVarStateLocations(atmVarStateLocations)
  }

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

  /* ** BUILD COMPONENTS ********************************************************************* */

  // only builds if in 'competition' tab
  if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) {
    return (null)
  }

  // build options for metrics
  const allMetricOptions = []
  const allEvaluationIds = Object.keys(settings.locationIconsOptions.evaluation.options)
  allMetricOptions.push.apply(allMetricOptions, allEvaluationIds.map(
    (evaluationId) => {
      return (<option value={evaluationId} key={evaluationId}>{evaluationId}</option>)
    }
  ))

  const iconsArgs = atsVarStateLib.getContextIconsArgs(ICON_TYPE, atomVarStateContext)

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
