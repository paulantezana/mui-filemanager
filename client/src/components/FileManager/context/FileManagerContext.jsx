import { createContext, useContext, useState } from "react";
import useFileManager from "./../hooks/useFileManager";

const FileManagerContext = createContext(null);

export const FileManagerProvider = ({
  children,
  operations = {},
  acceptPairs = [],
  permissions = [],
  folderModel = 'server', // server || client
  customComponents = [],
}) => {
  const manager = useFileManager({ operations, folderModel });
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const download = async (file) => {
    const blob = await operations.load(file);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'archivo';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <FileManagerContext.Provider value={{
      manager, acceptPairs, operations, customComponents, download,
      rowSelectionModel, setRowSelectionModel
    }}>
      {children}
    </FileManagerContext.Provider>
  );
};

export const useFileManagerContext = () => useContext(FileManagerContext);
