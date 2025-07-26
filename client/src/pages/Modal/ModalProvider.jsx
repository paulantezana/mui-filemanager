// ModalProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import ConfirmModal from './ConfirmModal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

const ModalProvider = ({ children }) => {
  const [modalProps, setModalProps] = useState(null);

  const showModal = (props) => {
    setModalProps({ ...props, open: true });
  };

  const hideModal = () => {
    if (modalProps?.onClose) modalProps.onClose();
    setModalProps(null);
  };

  const contextValue = {
    confirm: (options) => showModal({ ...options, type: 'confirm' }),
    success: (options) => showModal({ ...options, type: 'success' }),
    warning: (options) => showModal({ ...options, type: 'warning' }),
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalProps && (
        <ConfirmModal
          {...modalProps}
          onClose={hideModal}
        />
      )}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
