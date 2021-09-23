import { createContext } from "react";

const TabActiveFeatureInfoContext = createContext({
  tabActiveFeatureInfoContextData: {},
  setTabActiveFeatureInfoContextData: (filter) => {},
});

export default TabActiveFeatureInfoContext;
