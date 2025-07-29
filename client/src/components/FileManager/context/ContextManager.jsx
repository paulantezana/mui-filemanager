import { FileSelectionProvider } from './FileSelectionContext';
import { FullscreenPreviewProvider } from './FullscreenPreviewContext';
import { DisplayModeProvider } from './DisplayModeContext';
import { FileManagerProvider } from './FileManagerContext';
import { ItemSelectionProvider } from './ItemSelectionContext';

const ContextManager = ({
  children,
  config,
}) => {
  console.log('ContextManager');
  return (
    <FileManagerProvider config={config}>
      <ItemSelectionProvider>
        <FileSelectionProvider>
          <FullscreenPreviewProvider>
            <DisplayModeProvider>
              {children}
            </DisplayModeProvider>
          </FullscreenPreviewProvider>
        </FileSelectionProvider>
      </ItemSelectionProvider>
    </FileManagerProvider>
  );
};

export default ContextManager;
