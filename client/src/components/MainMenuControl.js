import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import '../style/MainMenuControl.css'

/* Map menu that allows selection of filters and more.
 */

// Dictionary to make the position argument more readable
// TODO - should it move to somewhere else?
const POSITION_CLASSES = {
  bottom_left: 'leaflet-bottom leaflet-left',
  bottom_right: 'leaflet-bottom leaflet-right',
  top_left: 'leaflet-top leaflet-left',
  top_right: 'leaflet-top leaflet-right'
}

const identifyGeoEvents = (filtersData) => {
  // Function that identifies unique geo units and events
  // Returns two dictionaries with {id: label}

  // first identify unique events and geo filters into dictionaries
  const [geoDict, evtDict] = [{}, {}]
  for (const curFilter of filtersData) {
    const curFilterIdSplit = curFilter.id.split('.')
    const curFilterNameSplit = curFilter.description.split('@')
    if ((curFilterIdSplit.length !== 2) || (curFilterNameSplit.length !== 2)) {
      console.log('Unable to parse filter "' + curFilter.id + '":"' + curFilter.description + '".')
      continue
    }
    const [curGeoId, curEvtId] = curFilterIdSplit
    const [curGeoName, curEvtName] = curFilterNameSplit
    geoDict[curGeoId] = curGeoName
    evtDict[curEvtId] = curEvtName
  }

  // then convert the dictionaries into lists of [id, name] elements
  const [geoList, evtList] = [[], []]
  for (const [k, v] of Object.entries(geoDict)) {
    geoList.push([k, v])
  }
  for (const [k, v] of Object.entries(evtDict)) {
    evtList.push([k, v])
  }

  return { geo: geoList, events: evtList }
}

const getDropDown = (id, title, idTitleList) => {
  // Function that builds a Dropdown item

  return (
    <Dropdown>
      <DropdownButton id={id} title={title}>
        {
          idTitleList.map(
            ([geoId, geoTitle]) => (
              <Dropdown.Item eventKey={geoId} key={geoId}>
                {geoTitle}
              </Dropdown.Item>
            )
          )
        }
      </DropdownButton>
    </Dropdown>
  )
}

const MainMenuControl = ({ position, regionName, filtersData }) => {
  // positions: String with one of the keys of POSITION_CLASSES

  // identifies all geo and event filters
  const { geo: retGeo, events: retEvt } = identifyGeoEvents(filtersData)

  // build content of the menu
  const menuContent = (
    <div className='mainContainer'>
      <div>Region: {regionName}</div>
      <hr />
      <div>
        <span>Geo:</span>{getDropDown('dropdown-geofilter', 'Sel. Geo.', retGeo)}
      </div>
      <div>
        <span>Event:</span>{getDropDown('dropdown-evtfilter', 'Sel. Evt.', retEvt)}
      </div>
    </div>
  )

  // containing div th
  const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.top_right
  return (
    <div className={positionClass}>
      <div className='leaflet-control leaflet-bar'>{menuContent}</div>
    </div>
  )
}

export default MainMenuControl
