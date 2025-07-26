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
      operations={operations}
      acceptPairs={acceptPairs}
      permissions={permissions}
      folderModel={folderModel}
      customComponents={customComponents}
    >
      <Manager />
    </ContextManager>
  )
};

export default FileManager;