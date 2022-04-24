import { createContext } from 'react'

/*
 * ConsFixed should only be changed by appLoad. All other locations should only read it.
 */

const ConsFixed = createContext({
  consFixed: {
    region: {},
    boundaries: [],
    filters: [],
    locations: {},
    parameters: {},
    parameterGroups: {},
    thresholdValueSets: {},
    thresholdGroup: {},
    networkTimeseriesMatrix: {} // TODO: temp code
  }
})

export default ConsFixed
