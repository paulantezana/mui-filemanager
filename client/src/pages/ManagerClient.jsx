import { useState } from "react";
import FileManager from "../components/FileManager/FileManager";
import FileService from "./services/FileService";
import { Dialog, DialogContent } from "@mui/material";
import data from './data';

const fileService = new FileService();

const ManagerClient = ({ onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const operations = {
    // list: data,
    list: async (path) => {
      return await fileService.tree();
    },
    info: (path) => {

    },
    create: async ({ type, file, path }) => {
      if (type === 'folder') {
        return await fileService.createFolder(path);
      } else if (type === 'file') {
        return await fileService.uploadFile(file, path);
      }
    },
    update: (path) => {

    },
    delete: async ({ path }) => {
      return await fileService.deletePath(path);
    },
    load: async ({ path }) => {
      return await fileService.downloadFile(path);
    },
  }

  const customColumns = [];

  return (<Dialog
    open
    fullWidth
    maxWidth="lg"
    onClose={onClose}
  >
    <DialogContent sx={{ padding: '.5rem' }} >
      <div style={{ height: 'calc(100vh - 80px)' }}>
        <FileManager operations={operations} customColumns={customColumns} folderModel="client"></FileManager>
      </div>
    </DialogContent>
  </Dialog>);
}

export default ManagerClient;