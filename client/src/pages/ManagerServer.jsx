import FileManager from "../components/FileManager/FileManager";
import FileService from "./services/FileService";
import { Dialog, DialogContent } from "@mui/material";


const fileService = new FileService();

const ManagerServer = ({ onClose }) => {
  const operations = {
    list: async (path) => {
      return await fileService.list(path);
    },
    info: (path) => {

    },
    create: async ({ type, data, path }) => {
      const { file } = data;
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

  return (<Dialog
    open
    fullWidth
    maxWidth="lg"
    onClose={onClose}
  >
    <DialogContent sx={{ padding: '.5rem' }} >
      <div style={{ height: 'calc(100vh - 80px)' }}>
        <FileManager operations={operations}></FileManager>
      </div>
    </DialogContent>
  </Dialog>);
}

export default ManagerServer;