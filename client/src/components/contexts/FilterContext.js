import { createContext } from 'react'

const FilterContext = createContext({
  filterContextData: {
    evtFilterId: null,
    geoFilterId: null,
    filterId: null,
    inOverview: null
  },
  setFilterContextData: (filter) => {}
})

export default FilterContext
