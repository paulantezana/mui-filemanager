import { createContext, useContext } from "react";
import useFileManager from "./../hooks/useFileManager";

const FileManagerContext = createContext(null);

export const FileManagerProvider = ({
  children,
  config,
}) => {
  const manager = useFileManager(config);

  return (
    <FileManagerContext.Provider value={{ manager, config }}>
      {children}
    </FileManagerContext.Provider>
  );
};

export const useFileManagerContext = () => useContext(FileManagerContext);
