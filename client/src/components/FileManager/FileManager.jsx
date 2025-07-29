import ContextManager from "./context/ContextManager";
import Manager from './layouts/Manager';
import './styles/main.css';

const FileManager = ({
  operations = {},
  acceptPairs = [],
  permissions = [],
  folderModel = 'server',
  customComponents = [],
}) => {
  return (
    <ContextManager
      config={{
        operations,
        acceptPairs,
        permissions,
        folderModel,
        customComponents,
      }}
    >
      <Manager />
    </ContextManager>
  )
};

export default FileManager;