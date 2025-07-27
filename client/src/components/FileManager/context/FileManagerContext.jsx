import { createContext, useContext, useState } from "react";
import useFileManager from "./../hooks/useFileManager";
import fileBlobDownload from "../helpers/fileBlobDownload";

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
    fileBlobDownload(blob);
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
