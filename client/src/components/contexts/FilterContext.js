import { createContext } from 'react'

const FilterContext = createContext({
  filterContextData: {
    evtFilterId: null,
    geoFilterId: null,
    filterId: null
  },
  setFilterContextData: (filter) => {}
})

export default FilterContext
