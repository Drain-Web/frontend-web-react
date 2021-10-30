/*
 * Functions here are used to read the content of consFixed.
 * Whatever is retrieved should NOT be modified.
 */

const getLocationData = (locationId, consFixed) => {
  console.log("Iterating over:", consFixed['locations']['locations'])
  for (const curLocation of consFixed['locations']['locations']) {
    if (curLocation['locationId'] === locationId) { return (curLocation); }
  }
  return (null);
}

// aggregate all public functions into a single namespace
const consFixedLib = {
  "getLocationData": getLocationData
}

export default consFixedLib
