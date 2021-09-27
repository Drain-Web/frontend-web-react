import { createContext, useState } from "react";

export const TabActiveFeatureInfoContext = createContext();

export const TabActiveFeatureInfoProvider = ({ children }) => {
  const [showActiveFeatureInfo, setShowActiveFeatureInfo] = useState(true);
  return (
    <TabActiveFeatureInfoContext.Provider
      value={{ showActiveFeatureInfo, setShowActiveFeatureInfo }}
    >
      {children}
    </TabActiveFeatureInfoContext.Provider>
  );
};
