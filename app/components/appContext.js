"use client"
import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showTranscription, setShowTranscription] = useState(false);

  return (
    <AppContext.Provider value={{ showTranscription, setShowTranscription }}>
      {children}
    </AppContext.Provider>
  );
};
