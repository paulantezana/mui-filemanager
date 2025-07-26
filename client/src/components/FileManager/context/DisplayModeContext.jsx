import { createContext, useContext, useState } from "react";

const DisplayModeValueContext = createContext('grid');
const SetDisplayModeContext = createContext(() => {});

export const DisplayModeProvider = ({ children }) => {
  const [displayMode, setDisplayMode] = useState('grid');

  return (
    <DisplayModeValueContext.Provider value={displayMode}>
      <SetDisplayModeContext.Provider value={setDisplayMode}>
        {children}
      </SetDisplayModeContext.Provider>
    </DisplayModeValueContext.Provider>
  );
};

export const useDisplayMode = () => useContext(DisplayModeValueContext);
export const useSetDisplayMode = () => useContext(SetDisplayModeContext);
