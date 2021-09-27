import React, { useContext } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import MapLocationsContext from '../../contexts/MapLocationsContext'
import FilterContext from '../../contexts/FilterContext'
import ownStyles from '../../../style/MainMenuControl.module.css'

import { ParametersCheckBox } from './ParametersCheckBox'
import { SubFilterSelectBox } from './SubFilterSelectBox'
import { ThresholdValueSetCheckBox } from './ThresholdValueSetCheckBox'
import { ThresholdGroupSelectBox } from './ThresholdGroupSelectBox'

/* ** AUX FUNCS ****************************************************************************** */

const identifyGeoEvents = (filtersData) => {
  // Function that identifies unique geo units and events
  // Returns two dictionaries (geo list, evt list) with {id: label} each

  // first identify unique events and geo filters into dictionaries
  const [evtDict, geoDict] = [{}, {}]
  for (const curFilter of filtersData) {
    const curFilterIdSplit = curFilter.id.split('.')
    const curFilterNameSplit = curFilter.description.split('@')
    if ((curFilterIdSplit.length !== 2) || (curFilterNameSplit.length !== 2)) {
      console.log('Unable to parse filter "' + curFilter.id + '":' + curFilter.description + '.')
      continue
    }
    const [curEvtId, curGeoId] = curFilterIdSplit
    const [curEvtName, curGeoName] = curFilterNameSplit
    evtDict[curEvtId] = curEvtName
    geoDict[curGeoId] = curGeoName
  }

  // then convert the dictionaries into lists of [id, name] elements
  const [evtList, geoList] = [[], []]
  for (const [k, v] of Object.entries(geoDict)) {
    geoList.push([k, v])
  }
  for (const [k, v] of Object.entries(evtDict)) {
    evtList.push([k, v])
  }

  return { geo: geoList, events: evtList }
}

const isLocationAttribute = (valueFunction) => {
  const firstLetter = valueFunction.charAt(0)
  const lastLetter = valueFunction.charAt(valueFunction.length-1)
  return ((firstLetter === '@') && (lastLetter == '@'))
}

const getByIdFromList = (list, id) => {
  for (const idx in list) {
    if (list[idx].id === id) { return (list[idx]) }
  }
  return (null)
}

const getByFilterIdFromDict = (dict, filterId) => {
  for (const idx of Object.keys(dict)) {
    if (dict[idx].filterId === filterId) { return (dict[idx]) }
  }
  return (null)
}


const updateLocationIcons = (mapLocationsContextData, selectedThreshGroupId, locationsData, filterId) => {
  // changes 

  // get selected parameter id
  const selectedParamIds = mapLocationsContextData.showParametersLocations
  let selectedParamId = null
  if ((selectedParamIds) && (selectedParamIds.size == 1)){
    selectedParamId = selectedParamIds.values().next().value
  } else {
    console.log("No selectedParamId from", selectedParamIds)
  }

  // goes updating location icons
  const thresholdGroupsByParams = mapLocationsContextData.thresholdGroups.byParameter
  console.log("mapLocationsContextData I:", mapLocationsContextData)
  for (const curLocationId in mapLocationsContextData.byLocations) {
    const curLocation = mapLocationsContextData.byLocations[curLocationId]

    // set as default icon
    if (!selectedParamId) {
      // TODO
      continue
    }

    // define proper icon
    for (const curParameterId in curLocation.timeseries) {
      if (curParameterId in thresholdGroupsByParams) {
        if (selectedThreshGroupId in thresholdGroupsByParams[curParameterId]) {
          const threshGroup = thresholdGroupsByParams[curParameterId][selectedThreshGroupId]

          // get the statistic associated to the thresh Group
          const curTSs = curLocation.timeseries[curParameterId]
          const curTS = getByFilterIdFromDict(curTSs, filterId)
          if (!curTS) { continue }
          const levelValue = curTS.maxValue             // TODO: make it variable

          // get location attributes
          let locationAttributes = null
          for (const curLocationStatIdx in locationsData.locations){
            const curSubLocation = locationsData.locations[curLocationStatIdx]
            if (curSubLocation.locationId == curLocationId) {
              locationAttributes = curSubLocation.attributes
              break
            }
          }
          // console.log("locationAttributes:", locationAttributes)
          
          let [anyThreshFound, lastWarningOverpast] = [false, null]

          // get the first limit extrapolated
          for (const curLevelThreshIdx in threshGroup){
            // get this location value if available
            const curLevelThresh = threshGroup[curLevelThreshIdx]
            const curValueFunction = curLevelThresh.valueFunction
            const curWarningLevel = curLevelThresh.levelThreshold.upWarningLevelId

            //
            if (isLocationAttribute(curValueFunction)) {
              const locAttrId = curValueFunction.substr(1, curValueFunction.length-2)
              // console.log("Loc Attr:", curValueFunction, '->', locAttrId)
              const locAttrDict = getByIdFromList(locationAttributes, locAttrId)
              // console.log('     got:', locAttrDict)
              if (locAttrDict) {
                anyThreshFound = true
                if (levelValue <= locAttrDict.number) { break }
                lastWarningOverpast = curWarningLevel
              }

            } else {
              console.warn("IGNORED: Not a Loc Attr:", curValueFunction)
              console.warn("TODO: Implement this case.")
              continue
            }
          }

          if (!anyThreshFound) {
            curLocation.show = false
            break
          }

          // set selected warning to location
          if (!lastWarningOverpast) {
            curLocation.warning = null
            continue
          }

          // finally set the warning
          curLocation.warning = lastWarningOverpast

          // if got into here, this is done
          break
        }
      }
    }
  }

  console.log("mapLocationsContextData O:", mapLocationsContextData)
  return { ...mapLocationsContextData }
}


export const TabFilters = ({ filtersData, locationsData, thresholdValueSets, thresholdGroups,
  overviewFilter }) => {
  /* ** SET HOOKS **************************************************************************** */

  const { mapLocationsContextData, setMapLocationsContextData } = useContext(MapLocationsContext)
  const { filterContextData, setFilterContextData } = useContext(FilterContext)

  /* ** DEFS ********************************************************************************* */

  const functionOnChangeGeoSubFilter = (event) => {
    // Triggered when the subregion selectbox is changed
    const newGeoFilterId = event.target.value
    const newFilterId = filterContextData.evtFilterId.concat('.').concat(newGeoFilterId)
    setFilterContextData({
      ...filterContextData, filterId: newFilterId, geoFilterId: newGeoFilterId
    })
  }

  const functionOnChangeEventSubFilter = (event) => {
    // Triggered when the event selectbox is changed
    const newEvtFilterId = event.target.value
    const newFilterId = newEvtFilterId.concat('.').concat(filterContextData.geoFilterId)
    setFilterContextData({
      ...filterContextData, filterId: newFilterId, evtFilterId: newEvtFilterId
    })
  }

  const functionOnChangeIconsThreshGroup = (event, filterId) => {
    // Triggered when the threshold group icon selectbox is changed
    const newEvtThreshGroupId = event.target.value
    setMapLocationsContextData(updateLocationIcons(mapLocationsContextData, newEvtThreshGroupId,
      locationsData, filterId))
  }

  /* ** MAIN RENDER ************************************************************************** */

  const { geo: retGeo, events: retEvt } = identifyGeoEvents(filtersData)
  return (
    <MapLocationsContext.Provider
      value={{ mapLocationsContextData, setMapLocationsContextData }}
    >
      <Form>
        <Container className='p-0'>
          <Row><Col>
            <SubFilterSelectBox
              idTitleList={retGeo}
              selectedId={filterContextData.geoFilterId}
              onChangeFunction={(changeGeoFilterEvt) => {
                functionOnChangeGeoSubFilter(changeGeoFilterEvt)
              }}
              addOverviewOption={overviewFilter}
              label='Sub-Area'
            />
          </Col></Row>
          <Row className={ownStyles['row-padding-top']}><Col>
            <SubFilterSelectBox
              idTitleList={retEvt}
              selectedId={filterContextData.evtFilterId}
              onChangeFunction={(changeEvtFilterEvt) => {
                functionOnChangeEventSubFilter(changeEvtFilterEvt)
              }}
              addOverviewOption={overviewFilter}
              label='Event'
            />
          </Col></Row>
          <Row className={ownStyles['row-padding-top']}><Col>
            <ParametersCheckBox />
          </Col></Row>
          {/*
          <Row className={ownStyles['row-padding-top']}><Col>
            <ThresholdValueSetCheckBox thresholdValueSets={thresholdValueSets} />
          </Col></Row>
          */}
          <Row className={ownStyles['row-padding-top']}><Col>
            <ThresholdGroupSelectBox
              thresholdGroups={thresholdGroups}
              onChangeFunction={(changeThresholdGroupEvt) => {
                functionOnChangeIconsThreshGroup(changeThresholdGroupEvt, filterContextData.filterId)
              }}
            />
          </Col></Row>
        </Container>
      </Form>
    </MapLocationsContext.Provider>
  )
}

// mapLocationsContextData={{ mapLocationsContextData, setMapLocationsContextData }}
