
/*
 * Functions here are used to change VarsState consistently
 */

// Include a new location entry
const addLocation = (locationId, icon, display, varsState, setVarsState) => {
  const newVarsState = { ...varsState }
  newVarsState['locations'][locationId] = {
    icon: icon,
    display: display
  }
  setVarsState(newVarsState)
}


// Include a set of new location entries
const addLocations = (locationIds, iconDefault, displayDefault, varsState, setVarsState) => {
  for (const locationId of locationIds) {
    addLocation(locationId, iconDefault, displayDefault, varsState, setVarsState)
  }
}


// aggregate all functions into a single namespace
const varStateLib = {
  "addLocation": addLocation,
  "addLocations": addLocations
}

export default varStateLib
