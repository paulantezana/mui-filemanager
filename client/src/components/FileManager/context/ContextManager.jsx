import { FileSelectionProvider } from './FileSelectionContext';
import { FullscreenPreviewProvider } from './FullscreenPreviewContext';
import { DisplayModeProvider } from './DisplayModeContext';
import { FileManagerProvider } from './FileManagerContext';

const ContextManager = ({
  children,
  operations = {},
  acceptPairs = [],
  permissions = [],
  folderModel = 'server', // server || client
  customComponents = [],
}) => {
  return (
    <FileManagerProvider
      operations={operations}
      acceptPairs={acceptPairs}
      permissions={permissions}
      folderModel={folderModel}
      customComponents={customComponents}
    >
      <FileSelectionProvider>
        <FullscreenPreviewProvider>
          <DisplayModeProvider>
            {children}
          </DisplayModeProvider>
        </FullscreenPreviewProvider>
      </FileSelectionProvider>
    </FileManagerProvider>
  );
};

export default ContextManager;
