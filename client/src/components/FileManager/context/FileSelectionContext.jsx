import { createContext, useContext, useState } from "react";

const FileSelectionValueContext = createContext(null);
const SetFileSelectionContext = createContext(() => {});

export const FileSelectionProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <FileSelectionValueContext.Provider value={selectedFile}>
      <SetFileSelectionContext.Provider value={setSelectedFile}>
        {children}
      </SetFileSelectionContext.Provider>
    </FileSelectionValueContext.Provider>
  );
};

export const useSelectedFile = () => useContext(FileSelectionValueContext);
export const useSetSelectedFile = () => useContext(SetFileSelectionContext);
