import { useState } from "react";
import FileManager from "../components/FileManager/FileManager";
import FileService from "./services/FileService";


const fileService = new FileService();

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const operations = {
    list: async (path) => {
      return await fileService.list(path);
    },
    info: (path) => {

    },
    create: async ({ type, data, path }) => {
      if (type === 'folder') {
        return await fileService.createFolder(path);
      } else if (type === 'file') {
        return await fileService.uploadFile(data, path);
      }
    },
    update: (path) => {

    },
    delete:  async (path) => {
      return await fileService.deletePath(path);
    },
    load: async (path) => {
      return await fileService.downloadFile(path);
    },
  }

  return (<div style={{ height: '100vh' }}>
    <FileManager
      operations={operations}
    // acceptPairs={[['.txt', 'text/plain'], ['.xml', 'text/xml']]}

    />
  </div>);

  // return (<div>
  //   <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
  //     Go to File Manager
  //   </Button>
  //   {modalOpen && <FileManagerModal
  //     onClose={() => setModalOpen(false)}
  //   />}
  // </div>);
}

export default Home;