import React, { useContext } from 'react'
import { Col, Form, Row, FloatingLabel } from 'react-bootstrap'
import { cloneDeep } from 'lodash';

// import recoil to replace contexts
import { useRecoilState } from "recoil";

// import contexts
import ConsCache from "../../contexts/ConsCache";
import consCacheLib from "../../contexts/consCacheLib";
import ConsFixed from "../../contexts/ConsFixed";

// import CSS styles
import ownStyles from '../../../style/MainMenuControl.module.css'
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext } from "../../atoms/atsVarState";


const IconsAlertsSubform = ( { settings } ) => {
  // ** SET HOOKS ******************************************************************************

  // get contexts
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  
  // get atoms
  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)

  // ** ON CLICK FUNCTIONS *********************************************************************

  // 
  const changeSelectedThresholdGroup = (selectedItem) => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons('alerts', { thresholdGroupId: selectedItem.target.value },
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }

  // 
  const changeSelectedModuleInstanceId = (selectedItem) => {
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons('alerts', { moduleInstanceId: selectedItem.target.value },
                                   atmVarStateContext)
    setAtVarStateContext(atmVarStateContext)
  }

  // ** BUILD COMPONENT ************************************************************************

  // 
  if (atsVarStateLib.getContextIconsType(atomVarStateContext) != "alerts") { return (null) }

  // build options for warnings / thresholdGroup
  const thresholdGroupOptions = []
  for (const [curId, curThreshGroup] of Object.entries(consFixed.thresholdGroup)) {
    thresholdGroupOptions.push(<option value={curId} key={curId}>{curThreshGroup.name}</option>)
  }

  // if no thresholdGroup or moduleInstanceId selected, break it
  const contextIconsArgs = atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext)
  if (!contextIconsArgs.thresholdGroupId ) {
    console.log("Hide by no selectedThresholdGroup even now.")
    return(<></>)
  }
  if (!contextIconsArgs.moduleInstanceId) {
    console.log("Hide by no selectedModuleInstanceId.")
    return(<></>)
  }

  // build options for module instance ids
  const selectedThresholdGroupId = atsVarStateLib.getContextIconsArgs('alerts',
                                                                      atomVarStateContext).thresholdGroupId
  const moduleInstancesIds = consCacheLib.getModuleInstancesOfThreshouldGroup(selectedThresholdGroupId, consCache)
  const moduleInstanceOptions = []
  for (const curModuleInstancesId of moduleInstancesIds) {
    moduleInstanceOptions.push(<option value={curModuleInstancesId} key={curModuleInstancesId}>
      {curModuleInstancesId}</option>)
  }
  
  return (
    <>
      <Row className={ownStyles['row-padding-top']}><Col>
          <FloatingLabel label='Warning'>
            <Form.Control
              as='select'
              onChange={changeSelectedThresholdGroup}
              defaultValue={atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).thresholdGroupId}
              className='rounded-1'
              label='Metric'
            >
              {thresholdGroupOptions}
            </Form.Control>
          </FloatingLabel>
      </Col> </Row>
      <Row className={ownStyles['row-padding-top']}> <Col>
          <FloatingLabel label='Module Instance Id'>
            <Form.Control
              as='select'
              onChange={changeSelectedModuleInstanceId}
              defaultValue={atsVarStateLib.getContextIconsArgs('alerts', atomVarStateContext).moduleInstanceId}
              className='rounded-1'
              label='Module Instance Id'
            >
              {moduleInstanceOptions}
            </Form.Control>
          </FloatingLabel>
      </Col> </Row>
    </>
  )
}

export default IconsAlertsSubform
