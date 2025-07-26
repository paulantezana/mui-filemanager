import { createContext, useContext, useState } from "react";

const FullscreenPreviewValueContext = createContext(null);
const SetFullscreenPreviewContext = createContext(() => {});

export const FullscreenPreviewProvider = ({ children }) => {
  const [fullscreenPreviewFile, setFullscreenPreviewFile] = useState(null);

  return (
    <FullscreenPreviewValueContext.Provider value={fullscreenPreviewFile}>
      <SetFullscreenPreviewContext.Provider value={setFullscreenPreviewFile}>
        {children}
      </SetFullscreenPreviewContext.Provider>
    </FullscreenPreviewValueContext.Provider>
  );
};

export const useFullscreenPreviewFile = () => useContext(FullscreenPreviewValueContext);
export const useSetFullscreenPreviewFile = () => useContext(SetFullscreenPreviewContext);
