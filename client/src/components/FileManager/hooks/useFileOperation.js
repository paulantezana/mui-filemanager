import { useCallback } from "react";
import { useFileManagerContext } from "../context/FileManagerContext";
import fileBlobDownload from "../helpers/fileBlobDownload";

const useFileOperation = () => {
  const { config } = useFileManagerContext();
  const { operations } = config;

  const dowloandFile = async (file) => {
    const blob = await operations.load(file);
    fileBlobDownload(blob, file);
  };

  const deleteFile = async (file) => {
    await operations.delete(file);
  };

  const loadFile = useCallback(async (file) => {
    return await operations.load(file);
  }, []);

  return {
    dowloandFile,
    deleteFile,
    loadFile,
  }
}

export default useFileOperation;