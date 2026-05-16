import React, { createContext, useContext } from "react";

const ReadOnlyContext = createContext(false);

export const ReadOnlyProvider = ({ isReadOnly, children }) => (
  <ReadOnlyContext.Provider value={!!isReadOnly}>
    {children}
  </ReadOnlyContext.Provider>
);

export const useReadOnly = () => useContext(ReadOnlyContext);
